// src/api/handlers/candidatesHandlers.js

import { http, HttpResponse } from 'msw';
import db from '../db/dexie';

const BASE_URL = '/api';

// --- Helpers ---
const simulateLatency = (min = 200, max = 1200) =>
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

const shouldFail = (errorRate = 0.1) => Math.random() < errorRate;

// --- GET /candidates?search=&stage=&page= ---
export const getCandidatesHandler = http.get(`${BASE_URL}/candidates`, async ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get('search')?.toLowerCase() || '';
  const stage = url.searchParams.get('stage') || '';
  const page = parseInt(url.searchParams.get('page')) || 1;
  const pageSize = parseInt(url.searchParams.get('pageSize')) || 1000;

  let collection = db.candidates;

  // Filter by stage if provided
  if (stage) {
    collection = collection.where('stage').equals(stage);
  }

  let candidates = await collection.toArray();

  // Client-side search by name or email
  if (search) {
    candidates = candidates.filter(
      c =>
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search)
    );
  }

  // Pagination
  const totalItems = candidates.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = (page - 1) * pageSize;
  const paginatedCandidates = candidates.slice(start, start + pageSize);

  return HttpResponse.json(
    {
      data: paginatedCandidates,
      meta: { total: totalItems, page, pageSize, totalPages },
    },
    { status: 200 }
  );
});

// --- POST /candidates (Add Candidate) ---
export const postCandidateHandler = http.post(`${BASE_URL}/candidates`, async ({ request }) => {
  await simulateLatency();

  if (shouldFail(0.08)) {
    return HttpResponse.json(
      { message: 'Network error, failed to add candidate.' },
      { status: 500 }
    );
  }

  const newCandidateData = await request.json();

  // Validation
  if (!newCandidateData.name || !newCandidateData.email) {
    return HttpResponse.json(
      { message: 'Name and email are required.' },
      { status: 400 }
    );
  }

  const candidate = {
    name: newCandidateData.name,
    email: newCandidateData.email,
    stage: newCandidateData.stage || 'applied',
    jobId: 1,
    appliedAt: new Date().toISOString(),
  };

  try {
    const id = await db.candidates.add(candidate);
    const createdCandidate = { id, ...candidate };

    console.log('✅ Candidate added:', createdCandidate);
    return HttpResponse.json({ data: createdCandidate }, { status: 201 });
  } catch (error) {
    console.error('Dexie error on candidate creation:', error);
    return HttpResponse.json(
      { message: 'Database error during creation.' },
      { status: 500 }
    );
  }
});

// --- PATCH /candidates/:candidateId (Stage Transition) ---
export const updateCandidateHandler = http.patch(
  `${BASE_URL}/candidates/:candidateId`,
  async ({ params, request }) => {
    await simulateLatency();

    if (shouldFail(0.08)) {
      return HttpResponse.json(
        { message: 'Network error, stage update failed.' },
        { status: 500 }
      );
    }

    const candidateId = parseInt(params.candidateId);
    const updateData = await request.json();

    try {
      const candidate = await db.candidates.get(candidateId);
      if (!candidate) {
        return HttpResponse.json({ message: 'Candidate not found.' }, { status: 404 });
      }

      await db.transaction('rw', db.candidates, db.candidateTimelines, async () => {
        await db.candidates.update(candidateId, updateData);

        // Record stage change
        if (updateData.stage && updateData.stage !== candidate.stage) {
          await db.candidateTimelines.add({
            candidateId,
            oldStage: candidate.stage,
            newStage: updateData.stage,
            timestamp: new Date().toISOString(),
            note: updateData.note || null,
          });
        }
      });

      const updatedCandidate = await db.candidates.get(candidateId);
      return HttpResponse.json({ data: updatedCandidate }, { status: 200 });
    } catch (error) {
      console.error(`Dexie error updating candidate ${candidateId}:`, error);
      return HttpResponse.json(
        { message: 'Database error during update.' },
        { status: 500 }
      );
    }
  }
);

// --- GET /candidates/:id/timeline ---
export const getCandidateTimelineHandler = http.get(
  `${BASE_URL}/candidates/:candidateId/timeline`,
  async ({ params }) => {
    const candidateId = parseInt(params.candidateId);

    let timeline = await db.candidateTimelines
      .where('candidateId')
      .equals(candidateId)
      .sortBy('timestamp');

    // Ensure initial applied stage exists
    if (timeline.length === 0) {
      const candidate = await db.candidates.get(candidateId);
      if (candidate) {
        timeline.unshift({
          candidateId,
          newStage: candidate.stage || 'applied',
          timestamp: candidate.appliedAt || new Date().toISOString(),
          isInitial: true,
        });
      }
    }

    return HttpResponse.json({ data: timeline }, { status: 200 });
  }
);

// --- Export All ---
export const candidateHandlers = [
  getCandidatesHandler,
  postCandidateHandler,
  updateCandidateHandler,
  getCandidateTimelineHandler,
];

