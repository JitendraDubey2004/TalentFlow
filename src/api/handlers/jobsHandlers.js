// src/api/handlers/jobsHandlers.js

import { http, HttpResponse } from 'msw';
import db from '../db/dexie';

const BASE_URL = '/api'; 


//  artificial latency (200-1200ms) on write endpoints. 
const simulateLatency = (min = 200, max = 1200) => 
    new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

//  5-10% error rate on write endpoints. 
const shouldFail = (errorRate = 0.1) => Math.random() < errorRate;

// --- API Handlers ---


export const getJobsHandler = http.get(`${BASE_URL}/jobs`, async ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get('search')?.toLowerCase() || '';
  const status = url.searchParams.get('status') || '';
  const pageSize = parseInt(url.searchParams.get('pageSize')) || 10; 
  const page = parseInt(url.searchParams.get('page')) || 1;
  const sort = url.searchParams.get('sort') || 'order';

  let jobs = await db.jobs.toArray();

  // Filtering Logic
  jobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search);
    const matchesStatus = !status || job.status === status;
    return matchesSearch && matchesStatus;
  });
  
  // Sorting Logic 
  jobs.sort((a, b) => {
    if (sort === 'order') return a.order - b.order;
    if (a[sort] < b[sort]) return -1;
    if (a[sort] > b[sort]) return 1;
    return 0;
  });

  // Pagination Logic
  const totalItems = jobs.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = (page - 1) * pageSize;
  const paginatedJobs = jobs.slice(start, start + pageSize);

  return HttpResponse.json({
    data: paginatedJobs,
    meta: { total: totalItems, page, pageSize, totalPages }
  }, { status: 200 });
});

// GET /jobs/:jobId (READ DETAIL)
export const getJobDetailsHandler = http.get(`${BASE_URL}/jobs/:jobId`, async ({ params }) => {
  const jobId = parseInt(params.jobId);
  const job = await db.jobs.get(jobId);

  if (!job) {
    return HttpResponse.json({ message: 'Job not found' }, { status: 404 });
  }
  return HttpResponse.json(job, { status: 200 });
});

// POST /jobs (CREATE)
export const createJobHandler = http.post(`${BASE_URL}/jobs`, async ({ request }) => {
  await simulateLatency(); 
  
  if (shouldFail(0.08)) {
    return HttpResponse.json({ message: 'Network error, please try again.' }, { status: 500 });
  }

  const newJobData = await request.json();

  if (!newJobData.title) {
    return HttpResponse.json({ message: 'Job title is required.' }, { status: 400 });
  }

  const maxOrderJob = await db.jobs.orderBy('order').last();
  const nextOrder = maxOrderJob ? maxOrderJob.order + 1 : 1;

  const job = {
    ...newJobData,
    id: db.jobs.autoIncrement, 
    slug: newJobData.title.toLowerCase().replace(/\s/g, '-').slice(0, 50),
    status: newJobData.status || "active",
    tags: newJobData.tags || [],
    order: nextOrder,
    createdAt: new Date().toISOString(),
  };

  try {
    const id = await db.jobs.add(job); 
    return HttpResponse.json({ id, ...job }, { status: 201 });
  } catch (error) {
    console.error("Dexie error on job creation:", error);
    return HttpResponse.json({ message: 'Database error during creation.' }, { status: 500 });
  }
});

// PATCH /jobs/:id (EDIT/UPDATE)
export const updateJobHandler = http.patch(`${BASE_URL}/jobs/:jobId`, async ({ params, request }) => {
  await simulateLatency();
  
  if (shouldFail(0.08)) { 
    return HttpResponse.json({ message: 'Network error, please try again.' }, { status: 500 });
  }
  
  const jobId = parseInt(params.jobId);
  const updateData = await request.json();

  try {
    // Persistence via Dexie
    await db.jobs.update(jobId, updateData); 
    
    // Returning the updated job (or a success message)
    const updatedJob = await db.jobs.get(jobId);
    return HttpResponse.json(updatedJob, { status: 200 });
  } catch (error) {
    console.error(`Dexie error on job update for ID ${jobId}:`, error);
    return HttpResponse.json({ message: 'Database error during update.' }, { status: 500 });
  }
});

// PATCH /jobs/:id/reorder (REORDER with Rollback Test)
export const reorderJobHandler = http.patch(`${BASE_URL}/jobs/:jobId/reorder`, async ({ params, request }) => {
  await simulateLatency(); 
  
  if (shouldFail(0.15)) { 
    console.error(`[MSW] Simulating 500 error for reorder of job ${params.jobId}`);
    return HttpResponse.json({ message: 'Simulated network failure. Rollback needed.' }, { status: 500 });
  }

  const { fromOrder, toOrder } = await request.json();
  const jobId = parseInt(params.jobId);

  // Reorder logic: uses a transaction to ensure all updates succeed or fail together
  try {
    await db.transaction('rw', db.jobs, async () => {
      const affectedJobs = await db.jobs.where('order').between(
        Math.min(fromOrder, toOrder), 
        Math.max(fromOrder, toOrder), 
        true, 
        true
      ).toArray();

      const isMovingDown = toOrder > fromOrder;
      
      const updates = affectedJobs.map(job => {
        if (job.id === jobId) {
          return db.jobs.update(jobId, { order: toOrder });
        } else if (isMovingDown) {
          return db.jobs.update(job.id, { order: job.order - 1 });
        } else {
          return db.jobs.update(job.id, { order: job.order + 1 });
        }
      });
      
      await Promise.all(updates);
    });
    return HttpResponse.json({ success: true, message: 'Reordering successful.' }, { status: 200 });

  } catch (error) {
    console.error("Dexie transaction failed during reorder:", error);
    return HttpResponse.json({ message: 'Internal database error during reorder.' }, { status: 500 });
  }
});


// Array of all job handlers to be passed to MSW
export const jobHandlers = [
    getJobsHandler,
    getJobDetailsHandler,
    createJobHandler,
    updateJobHandler,
    reorderJobHandler,
];