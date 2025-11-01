// src/api/handlers/jobsHandlers.js

import { http, HttpResponse } from 'msw';
import db from '../db/dexie';

const BASE_URL = '/api';

// Simulate latency (to mimic a real API)
const simulateLatency = (min = 200, max = 1200) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));

// Optional random network failure (disabled in production)
const shouldFail = (errorRate = import.meta.env.DEV ? 0.08 : 0) =>
  Math.random() < errorRate;

// Fallback mock data for production (when Dexie is empty or blocked)
const fallbackJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    slug: 'frontend-developer',
    status: 'active',
    tags: ['React', 'JavaScript', 'UI'],
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Backend Engineer',
    slug: 'backend-engineer',
    status: 'active',
    tags: ['Node.js', 'Express', 'API'],
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'QA Engineer',
    slug: 'qa-engineer',
    status: 'inactive',
    tags: ['Testing', 'Automation', 'Cypress'],
    order: 3,
    createdAt: new Date().toISOString(),
  },
];

// Handlers 

// GET /jobs
export const getJobsHandler = http.get(`${BASE_URL}/jobs`, async ({ request }) => {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const status = url.searchParams.get('status') || '';
    const pageSize = parseInt(url.searchParams.get('pageSize')) || 10;
    const page = parseInt(url.searchParams.get('page')) || 1;
    const sort = url.searchParams.get('sort') || 'order';

    let jobs = [];

    try {
      jobs = await db.jobs.toArray();
    } catch  {
      console.warn('[MSW] Dexie not accessible — using fallback jobs.');
    }

    if (!jobs || jobs.length === 0) {
      jobs = fallbackJobs;
    }

    // Filter by search and status
    jobs = jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(search);
      const matchesStatus = !status || job.status === status;
      return matchesSearch && matchesStatus;
    });

    // Sort
    jobs.sort((a, b) => {
      if (sort === 'order') return a.order - b.order;
      return (a[sort] || '').localeCompare(b[sort] || '');
    });

    // Pagination
    const totalItems = jobs.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const start = (page - 1) * pageSize;
    const paginatedJobs = jobs.slice(start, start + pageSize);

    return HttpResponse.json(
      {
        data: paginatedJobs,
        meta: { total: totalItems, page, pageSize, totalPages },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[MSW] getJobsHandler failed:', err);
    return HttpResponse.json({ message: 'Failed to fetch jobs' }, { status: 500 });
  }
});

// GET /jobs/:jobId
export const getJobDetailsHandler = http.get(`${BASE_URL}/jobs/:jobId`, async ({ params }) => {
  const jobId = parseInt(params.jobId);

  try {
    let job = await db.jobs.get(jobId);
    if (!job) job = fallbackJobs.find((j) => j.id === jobId);

    if (!job) {
      return HttpResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    return HttpResponse.json(job, { status: 200 });
  } catch  {
    console.warn('[MSW] Dexie unavailable, returning fallback job');
    const job = fallbackJobs.find((j) => j.id === jobId);
    return job
      ? HttpResponse.json(job, { status: 200 })
      : HttpResponse.json({ message: 'Job not found' }, { status: 404 });
  }
});

// POST /jobs (Create)
export const createJobHandler = http.post(`${BASE_URL}/jobs`, async ({ request }) => {
  await simulateLatency();

  if (shouldFail()) {
    return HttpResponse.json({ message: 'Network error, please try again.' }, { status: 500 });
  }

  const newJobData = await request.json();

  if (!newJobData.title) {
    return HttpResponse.json({ message: 'Job title is required.' }, { status: 400 });
  }

  try {
    const maxOrderJob = await db.jobs.orderBy('order').last();
    const nextOrder = maxOrderJob ? maxOrderJob.order + 1 : 1;

    const job = {
      ...newJobData,
      slug: newJobData.title.toLowerCase().replace(/\s/g, '-').slice(0, 50),
      status: newJobData.status || 'active',
      order: nextOrder,
      createdAt: new Date().toISOString(),
    };

    const id = await db.jobs.add(job);
    return HttpResponse.json({ id, ...job }, { status: 201 });
  } catch  {
    console.warn('[MSW] Using fallback createJob');
    const fallbackJob = {
      id: fallbackJobs.length + 1,
      ...newJobData,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    fallbackJobs.push(fallbackJob);
    return HttpResponse.json(fallbackJob, { status: 201 });
  }
});

// PATCH /jobs/:id (Update)
export const updateJobHandler = http.patch(`${BASE_URL}/jobs/:jobId`, async ({ params, request }) => {
  await simulateLatency();

  const jobId = parseInt(params.jobId);
  const updateData = await request.json();

  try {
    await db.jobs.update(jobId, updateData);
    const updatedJob = await db.jobs.get(jobId);
    return HttpResponse.json(updatedJob, { status: 200 });
  } catch  {
    const jobIndex = fallbackJobs.findIndex((j) => j.id === jobId);
    if (jobIndex !== -1) {
      fallbackJobs[jobIndex] = { ...fallbackJobs[jobIndex], ...updateData };
      return HttpResponse.json(fallbackJobs[jobIndex], { status: 200 });
    }
    return HttpResponse.json({ message: 'Job not found.' }, { status: 404 });
  }
});

// PATCH /jobs/:id/reorder
export const reorderJobHandler = http.patch(`${BASE_URL}/jobs/:jobId/reorder`, async ({ request }) => {
  await simulateLatency();

  try {
    const { fromOrder, toOrder } = await request.json();

    if (fromOrder === undefined || toOrder === undefined) {
      return HttpResponse.json({ message: 'Invalid reorder request' }, { status: 400 });
    }

    return HttpResponse.json({ success: true, message: 'Reorder simulated successfully' }, { status: 200 });
  } catch  {
    return HttpResponse.json({ message: 'Error during reorder.' }, { status: 500 });
  }
});

//  Export all handlers
export const jobHandlers = [
  getJobsHandler,
  getJobDetailsHandler,
  createJobHandler,
  updateJobHandler,
  reorderJobHandler,
];
