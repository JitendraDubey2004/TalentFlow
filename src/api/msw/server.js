// src/api/msw/server.js

import { setupWorker } from 'msw/browser';
import { handlers } from '../handlers';

let worker;

export async function prepareMockServer() {
  try {
    console.log("🧩 MSW: Starting mock service worker (enabled for all environments)...");
    worker = setupWorker(...handlers);
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js', // ensure it's served from /public
      },
    });
  } catch (err) {
    console.error("❌ Failed to start MSW:", err);
  }
}
