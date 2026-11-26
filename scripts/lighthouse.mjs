import { spawn } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
const url = 'http://127.0.0.1:4174/';
const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  env: { ...process.env, PORT: '4174' },
  stdio: 'inherit'
});
let chrome;
try {
  let ready = false;
  for (let i = 0; i < 50; i++) {
    if (server.exitCode !== null) throw Error('Preview server exited');
    try {
      ready = (await fetch(url)).ok;
    } catch {
      /* startup */
    }
    if (ready) break;
    await wait(100);
  }
  if (!ready) throw Error('Preview server failed');
  const socket = createServer();
  await new Promise((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  chrome = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--remote-debugging-port=' + port]
  });
  const result = await lighthouse(url, {
    port,
    onlyCategories: ['performance', 'accessibility'],
    logLevel: 'error',
    output: 'json'
  });
  if (!result || result.lhr.runtimeError) throw Error('Audit failed: ' + result?.lhr.runtimeError?.message);
  await mkdir('.lighthouseci', { recursive: true });
  await writeFile('.lighthouseci/report.json', JSON.stringify(result.lhr));
  for (const [key, category] of Object.entries(result.lhr.categories)) {
    console.log(key, category.score);
    if (category.score === null || category.score < 0.9) process.exitCode = 1;
  }
} finally {
  if (chrome) await chrome.close();
  server.kill();
}
