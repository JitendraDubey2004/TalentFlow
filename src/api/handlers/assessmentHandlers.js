// src/api/handlers/assessmentHandlers.js

import { http, HttpResponse } from 'msw';
import db from '../db/dexie';

const BASE_URL = '/api'; 

//  Simulation Helpers 
const simulateLatency = (min = 200, max = 1200) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
const shouldFail = (errorRate = 0.1) => Math.random() < errorRate;

//  API Endpoints 

// GET /assessments/:jobId (Retrieve Assessment Structure)
export const getAssessmentHandler = http.get(`${BASE_URL}/assessments/:jobId`, async ({ params }) => {
  const jobId = parseInt(params.jobId);

  const assessment = await db.assessments.where('jobId').equals(jobId).first();

  if (!assessment) {
    return HttpResponse.json({ jobId, sections: [] }, { status: 200 });
  }

  return HttpResponse.json(assessment, { status: 200 });
});


// PUT /assessments/:jobId (Save Assessment Structure)
export const saveAssessmentHandler = http.put(`${BASE_URL}/assessments/:jobId`, async ({ params, request }) => {
  await simulateLatency(); 

  if (shouldFail(0.08)) {
    return HttpResponse.json(
      { message: 'Network error, failed to save assessment structure.' },
      { status: 500 }
    );
  }

  const jobId = parseInt(params.jobId);
  const assessmentData = await request.json();

  if (!assessmentData.sections) {
    return HttpResponse.json(
      { message: 'Assessment must contain sections.' },
      { status: 400 }
    );
  }

  try {
    const id = await db.assessments.put({
      ...assessmentData,
      jobId: jobId,
      updatedAt: new Date().toISOString(),
    });

    return HttpResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    console.error('Dexie error on saving assessment structure:', error);
    return HttpResponse.json(
      { message: 'Database error during save.' },
      { status: 500 }
    );
  }
});


// POST /assessments/:jobId/submit (Store Candidate Response Locally)
export const submitAssessmentHandler = http.post(`${BASE_URL}/assessments/:jobId/submit`, async ({ params, request }) => {
  await simulateLatency();

  if (shouldFail(0.08)) {
    return HttpResponse.json(
      { message: 'Network error, submission failed.' },
      { status: 500 }
    );
  }

  const jobId = parseInt(params.jobId);
  const responseData = await request.json();

  if (!responseData.candidateId || !responseData.responses) {
    return HttpResponse.json(
      { message: 'Candidate ID and responses are required.' },
      { status: 400 }
    );
  }

  try {
    const submissionRecord = {
      jobId: jobId,
      candidateId: responseData.candidateId,
      responses: responseData.responses,
      submissionDate: new Date().toISOString(),
    };

    const id = await db.assessmentResponses.add(submissionRecord);
    return HttpResponse.json({ success: true, responseId: id }, { status: 201 });
  } catch (error) {
    console.error('Dexie error on assessment submission:', error);
    return HttpResponse.json(
      { message: 'Database error during submission.' },
      { status: 500 }
    );
  }
});


// DELETE /assessments/:jobId (Delete Assessment Structure)
export const deleteAssessmentHandler = http.delete(`${BASE_URL}/assessments/:jobId`, async ({ params }) => {
  await simulateLatency();

  if (shouldFail(0.05)) {
    return HttpResponse.json(
      { message: 'Network error, failed to delete assessment.' },
      { status: 500 }
    );
  }

  const jobId = parseInt(params.jobId);

  try {
    const count = await db.assessments.where('jobId').equals(jobId).delete();

    if (count === 0) {
      return HttpResponse.json({ message: 'Assessment not found.' }, { status: 404 });
    }

    return HttpResponse.json(
      { success: true, message: 'Assessment deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Dexie error on deleting assessment structure:', error);
    return HttpResponse.json(
      { message: 'Database error during deletion.' },
      { status: 500 }
    );
  }
});

// Export all handlers
export const assessmentHandlers = [
  getAssessmentHandler,
  saveAssessmentHandler,
  submitAssessmentHandler,
  deleteAssessmentHandler,
];
