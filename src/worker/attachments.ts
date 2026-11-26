import type { AttachmentInfo } from '../types';
export async function inspectFile(name: string, type: string, bytes: Uint8Array): Promise<AttachmentInfo> {
  const prefix = Array.from(bytes.subarray(0, 8)).join(',');
  const sample = new TextDecoder('latin1').decode(bytes);
  const signature = sample.startsWith('%PDF-')
    ? 'PDF'
    : prefix.startsWith('80,75,3,4')
      ? 'ZIP'
      : prefix.startsWith('208,207,17,224')
        ? 'OLE'
        : prefix.startsWith('77,90')
          ? 'PE'
          : prefix.startsWith('137,80,78,71')
            ? 'PNG'
            : prefix.startsWith('255,216,255')
              ? 'JPEG'
              : '—';
  const flags: string[] = [];
  const ext = name.toLowerCase().split('.').pop() ?? '';
  const expected: Record<string, string> = {
    pdf: 'PDF',
    zip: 'ZIP',
    docx: 'ZIP',
    xlsx: 'ZIP',
    pptx: 'ZIP',
    docm: 'ZIP',
    xlsm: 'ZIP',
    pptm: 'ZIP',
    png: 'PNG',
    jpg: 'JPEG',
    jpeg: 'JPEG',
    exe: 'PE'
  };
  if ((expected[ext] && expected[ext] !== signature) || (signature === 'PE' && ext !== 'exe'))
    flags.push('extension ≠ signature');
  if (signature === 'PE') flags.push('PE');
  if (signature === 'PDF')
    for (const flag of ['JavaScript', 'JS', 'EmbeddedFile'])
      if (new RegExp('/' + flag + '\\b').test(sample)) flags.push('PDF /' + flag);
  if (signature === 'ZIP' && /vbaProject\.bin/i.test(sample)) flags.push('Office VBA');
  const sha = new Uint8Array(await crypto.subtle.digest('SHA-256', new Uint8Array(bytes)));
  return {
    name,
    type,
    signature,
    flags,
    size: bytes.length,
    sha256: Array.from(sha, (b) => b.toString(16).padStart(2, '0')).join('')
  };
}
