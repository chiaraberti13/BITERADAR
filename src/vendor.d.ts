declare module 'unicode-confusables' {
  export function rectifyConfusion(value: string): string;
}
declare module 'punycode/' {
  export function toUnicode(value: string): string;
}
