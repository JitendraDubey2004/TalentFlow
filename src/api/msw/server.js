// src/api/msw/server.js
import { setupWorker } from 'msw/browser';
import { handlers } from '../handlers';

const worker = setupWorker(...handlers);

export async function prepareMockServer() {
  console.log("🧩 MSW: Starting Mock Service Worker (all environments)");
  
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js', // ensures correct path on Vercel
    },
  });
}

