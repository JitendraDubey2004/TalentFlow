// src/api/msw/server.js

import { setupWorker } from 'msw/browser';
import { handlers } from '../handlers'; 
const worker = setupWorker(...handlers);


export async function prepareMockServer() {
  if (import.meta.env.DEV) {
    console.log("Starting Mock Service Worker...");
    await worker.start({ 
        onUnhandledRequest: 'bypass' 
    });
  }
}