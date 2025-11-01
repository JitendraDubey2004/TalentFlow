// src/api/msw/server.js

import { setupWorker } from 'msw/browser';
import { handlers } from '../handlers';

let worker;

export async function prepareMockServer() {
  // Start MSW only in development mode
  if (import.meta.env.DEV) {
    console.log("🧩 MSW: Starting mock service worker (development mode)...");
    worker = setupWorker(...handlers);
    await worker.start({ onUnhandledRequest: 'bypass' });
  } else {
    console.log("🚀 Production mode: Skipping MSW initialization");
  }
}
