import { parse, type Input } from './parse';
import { analyze } from '../lib/scoring';
import type { AnalysisResult } from '../types';
export interface ParseRequest {
  input: Input;
  kind: 'auto' | 'msg';
  receiver: string;
}
export type ParseResponse = { ok: true; result: AnalysisResult } | { ok: false };
self.onmessage = async ({ data }: MessageEvent<ParseRequest>) => {
  try {
    self.postMessage({
      ok: true,
      result: analyze(await parse(data.input, data.kind), data.receiver)
    } satisfies ParseResponse);
  } catch {
    self.postMessage({ ok: false } satisfies ParseResponse);
  }
};
