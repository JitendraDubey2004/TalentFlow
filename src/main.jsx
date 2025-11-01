// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { seedDatabase } from './api/seeds/seedData.js';

async function main() {
  //  Start MSW in all environments
  try {
    const { prepareMockServer } = await import('./api/msw/server.js');
    await prepareMockServer();
  } catch (err) {
    console.warn("⚠️ MSW could not start:", err);
  }

  //  Seed mock/local data
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
