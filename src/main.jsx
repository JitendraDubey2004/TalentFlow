// src/main.jsx (FINAL FIXED VERSION)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { seedDatabase } from './api/seeds/seedData.js';

async function main() {
  // 🧩 Start MSW only in development mode
  if (import.meta.env.DEV) {
    const { prepareMockServer } = await import('./api/msw/server.js');
    await prepareMockServer();
  } else {
    console.log("🚀 Production build: MSW not loaded");
  }

  // 🧩 Seed mock/local data
  await seedDatabase();

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

main();
