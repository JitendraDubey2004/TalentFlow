// src/main.jsx (FINAL UPDATE for setup)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

import { seedDatabase } from './api/seeds/seedData.js';
import { prepareMockServer } from './api/msw/server.js'; 

async function main() {
 
  if (import.meta.env.DEV) {
    await prepareMockServer(); 
  }


  await seedDatabase();

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
}

main();