// src/utils/fetchWithFallback.js

export async function fetchWithFallback(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`⚠️ Fallback triggered for ${url}: ${err.message}`);

    // Import seed data dynamically
    const seed = await import('../api/seeds/seedData.js');

    // Return matching mock data for production fallback
    if (url.includes('/api/candidates')) {
      return { data: seed.candidates };
    }
    if (url.includes('/api/jobs')) {
      return { data: seed.jobs };
    }
    if (url.includes('/api/assessments')) {
      return { data: seed.assessments || [] };
    }

    return { data: [] };
  }
}
