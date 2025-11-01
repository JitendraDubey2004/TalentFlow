// src/api/msw/server.js

import { setupWorker } from 'msw/browser';
import { handlers } from '../handlers';

let worker;

export async function prepareMockServer() {
  console.log("🧩 MSW: Starting mock service worker...");
  worker = setupWorker(...handlers);
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
}
