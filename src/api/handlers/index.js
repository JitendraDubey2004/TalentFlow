// src/api/handlers/index.js

import { jobHandlers } from './jobsHandlers';
import { candidateHandlers } from './candidatesHandlers'; 
import { assessmentHandlers } from './assessmentHandlers'; 
export const handlers = [
  ...jobHandlers,
   ...candidateHandlers,
   ...assessmentHandlers,
];