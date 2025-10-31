// src/api/db/dexie.js

import Dexie from 'dexie';

const db = new Dexie('TalentFlowDB');

db.version(2).stores({
  users: '++id, name, email, password',
  // Jobs: Index on id, title, status, tags, and order for filtering/sorting/reordering
  jobs: '++id, title, status, *tags, order', 
  
  // Candidates: Index on id, name, email (for client-side search), and stage (for server-like filter)
  candidates: '++id, name, email, stage, jobId, appliedAt',
  
  // Assessments: Index on jobId to link assessments to specific jobs
  assessments: '++id, jobId', 
  
  // Timeline/Notes: Index on candidateId to fetch a candidate's history
  candidateTimelines: '++id, candidateId, timestamp', 
  
  // Store for candidate responses to assessments
  assessmentResponses: '++id, candidateId, jobId, submissionDate',
});

export default db;