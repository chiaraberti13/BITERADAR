// Read only selected MAPI streams. Never materialise an unbounded directory or
// follow a sector twice. Unsupported compound files fail before stream allocation.
export function readMsg(input: ArrayBuffer) {
  const bytes = new Uint8Array(input),
    view = new DataView(input);
  const u16 = (n: number) => view.getUint16(n, true),
    u32 = (n: number) => view.getUint32(n, true);
  const invalid = (): never => {
    throw new Error('msg');
  };
  if (
    bytes.length < 512 ||
    bytes.slice(0, 8).join() !== '208,207,17,224,161,177,26,225' ||
    u16(28) !== 65534 ||
    ![9, 12].includes(u16(30)) ||
    u16(32) !== 6 ||
    u32(56) !== 4096 ||
    u32(72) !== 0
  )
    invalid();
  const size = 2 ** u16(30),
    sectors = bytes.length / size - 1,
    end = 0xfffffffe,
    free = 0xffffffff;
  if (!Number.isInteger(sectors) || sectors < 1 || u32(44) > 109 || u32(44) > sectors) invalid();
  function sector(id: number) {
    if (id >= sectors) invalid();
    return bytes.subarray((id + 1) * size, (id + 2) * size);
  }
  function words(block: Uint8Array) {
    const data = new DataView(block.buffer, block.byteOffset, block.byteLength);
    return Array.from({ length: block.length / 4 }, (_, i) => data.getUint32(i * 4, true));
  }
  const fat: number[] = [];
  for (let i = 0; i < u32(44); i++) fat.push(...words(sector(u32(76 + 4 * i))));
  function blocks(start: number, table: number[], max: number) {
    const ids: number[] = [],
      seen = new Set<number>();
    for (let n = start; n !== end; n = table[n]) {
      if (n >= table.length || seen.has(n) || ids.length >= max) invalid();
      seen.add(n);
      ids.push(n);
    }
    return ids;
  }
  function combine(chunks: Uint8Array[], length: number) {
    const out = new Uint8Array(length);
    let pos = 0;
    for (const c of chunks) {
      const part = c.subarray(0, length - pos);
      out.set(part, pos);
      pos += part.length;
    }
    if (pos !== length) invalid();
    return out;
  }
  const dir = blocks(u32(48), fat, Math.min(sectors, Math.ceil((2048 * 128) / size))).flatMap((id) => {
    const b = sector(id);
    return Array.from({ length: size / 128 }, (_, i) => {
      const p = i * 128,
        d = new DataView(b.buffer, b.byteOffset + p, 128);
      const len = d.getUint16(64, true),
        type = b[p + 66];
      if (type && (len < 2 || len > 64 || len % 2)) invalid();
      const name = new TextDecoder('utf-16le').decode(b.subarray(p, p + Math.max(0, len - 2)));
      return {
        name,
        type,
        left: d.getUint32(68, true),
        right: d.getUint32(72, true),
        child: d.getUint32(76, true),
        start: d.getUint32(116, true),
        len: d.getUint32(120, true),
        high: d.getUint32(124, true)
      };
    });
  });
  const root = dir[0];
  if (root?.type !== 5) invalid();
  const regular = (start: number, length: number) =>
    combine(blocks(start, fat, Math.ceil(length / size)).map(sector), length);
  if (root.high || root.len > input.byteLength) invalid();
  const mini = root.len ? regular(root.start, root.len) : new Uint8Array();
  if (u32(64) > sectors) invalid();
  const miniFat = u32(64) ? blocks(u32(60), fat, u32(64)).flatMap((id) => words(sector(id))) : [];
  let allocated = 0;
  function stream(e: typeof root) {
    if (e.high || (allocated += e.len) > input.byteLength * 2 || e.len > input.byteLength) invalid();
    if (!e.len) return new Uint8Array();
    if (e.len >= 4096) return regular(e.start, e.len);
    return combine(
      blocks(e.start, miniFat, Math.ceil(e.len / 64)).map((id) => mini.subarray(id * 64, id * 64 + 64)),
      e.len
    );
  }
  const visited = new Set<number>();
  function children(parent: typeof root) {
    const queue = [parent.child],
      entries = new Map<string, typeof root>();
    while (queue.length) {
      const i = queue.pop()!;
      if (i === free) continue;
      const e = dir[i];
      if (!e || visited.has(i) || ![1, 2].includes(e.type)) invalid();
      visited.add(i);
      entries.set(e.name, e);
      queue.push(e.left, e.right);
    }
    return entries;
  }
  const fields = children(root);
  if (!fields.has('__properties_version1.0')) invalid();
  function prop(fields: Map<string, typeof root>, id: string) {
    for (const type of ['001F', '001E']) {
      const entry = fields.get('__substg1.0_' + id + type);
      if (entry)
        return new TextDecoder(type === '001F' ? 'utf-16le' : 'windows-1252').decode(stream(entry)).replace(/\0+$/, '');
    }
    return '';
  }
  const attachments = [];
  for (const entry of fields.values()) {
    if (!entry.name.startsWith('__attach_version1.0_')) continue;
    if (attachments.length >= 64) invalid();
    const f = children(entry),
      content = f.get('__substg1.0_37010102');
    if (!content) throw Error('msg'); // Embedded messages and OLE objects are unsupported.
    attachments.push({ name: prop(f, '3707') || prop(f, '3704'), type: prop(f, '370E'), bytes: stream(content) });
  }
  const html = fields.get('__substg1.0_10130102');
  return {
    headers: prop(fields, '007D'),
    subject: prop(fields, '0037'),
    from: prop(fields, '5D01') || prop(fields, '0C1F'),
    displayName: prop(fields, '0C1A'),
    text: prop(fields, '1000'),
    html: prop(fields, '1013') || (html ? new TextDecoder().decode(stream(html)) : ''),
    attachments
  };
}
