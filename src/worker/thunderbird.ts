interface MailClient {
  tabs: { query(filter: { active: true; currentWindow: true }): Promise<{ id: number }[]> };
  messageDisplay: { getDisplayedMessage(tab: number): Promise<{ id: number } | null> };
  messages: { getRaw(id: number, opts: { data_format: 'File' }): Promise<File> };
}
export async function displayedFile(): Promise<File> {
  const api = (globalThis as typeof globalThis & { browser?: MailClient }).browser;
  if (!api) throw Error('mail client');
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  const mail = tab && (await api.messageDisplay.getDisplayedMessage(tab.id));
  if (!mail) throw Error('message');
  return api.messages.getRaw(mail.id, { data_format: 'File' });
}
