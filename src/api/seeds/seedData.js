// src/api/seeds/seedData.js

import { faker } from '@faker-js/faker';
import db from '../db/dexie';

// Candidate pipeline stages
const CANDIDATE_STAGES = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

// Assessment question types
const QUESTION_TYPES = [
  'single-choice',
  'multi-choice',
  'short-text',
  'long-text',
  'numeric',
  'file-upload',
];

// Utility Generators 

const generateJobs = (count) => {
  const jobs = [];
  for (let i = 1; i <= count; i++) {
    const title = faker.person.jobTitle();
    jobs.push({
      id: i,
      title,
      slug: title.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, ''),
      status: faker.helpers.arrayElement(['active', 'archived', 'active', 'active']),
      tags: faker.helpers.arrayElements(
        ['Frontend', 'Backend', 'Fullstack', 'Remote', 'Urgent', 'Lead'],
        { min: 1, max: 3 }
      ),
      order: i,
      description: faker.lorem.paragraph(),
      createdAt: faker.date.past(),
    });
  }
  return jobs;
};

const generateCandidates = (count, jobIds) => {
  const candidates = [];
  for (let i = 1; i <= count; i++) {
    candidates.push({
      id: i,
      jobId: faker.helpers.arrayElement(jobIds),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      stage: faker.helpers.arrayElement(CANDIDATE_STAGES),
      phone: faker.phone.number(),
      appliedAt: faker.date.past(),
    });
  }
  return candidates;
};

const generateAssessments = (count, jobIds) => {
  const assessments = [];
  for (let i = 0; i < count; i++) {
    const questions = [];

    for (let q = 0; q < faker.number.int({ min: 10, max: 20 }); q++) {
      const type = faker.helpers.arrayElement(QUESTION_TYPES);
      const isChoiceType = ['single-choice', 'multi-choice'].includes(type);

      questions.push({
        id: q + 1,
        type,
        text: faker.lorem.sentence(),
        options: isChoiceType
          ? faker.helpers.arrayElements(faker.lorem.words(10).split(' '), {
              min: 3,
              max: 5,
            })
          : undefined,
        required: faker.datatype.boolean(),
      });
    }

    assessments.push({
      id: i + 1,
      jobId: jobIds[i],
      title: `Assessment for ${faker.person.jobTitle()}`,
      sections: [{ title: 'Main Section', questions }],
      createdAt: faker.date.recent(),
    });
  }
  return assessments;
};

//Main Seeder 

export async function seedDatabase() {
  if (!import.meta.env.DEV) {
    console.log('[Seed] Skipping seeding in production build.');
    return; // prevent Dexie writes in production
  }

  console.log('Checking database for seed data...');

  try {
    const jobCount = await db.jobs.count();

    if (jobCount === 0) {
      console.log('Seeding local Dexie database...');

      const jobs = generateJobs(25);
      const jobIds = jobs.map((j) => j.id);
      const candidates = generateCandidates(1000, jobIds);
      const assessments = generateAssessments(3, jobIds.slice(0, 3));

      await db.jobs.bulkAdd(jobs);
      await db.candidates.bulkAdd(candidates);
      await db.assessments.bulkAdd(assessments);

      console.log(
        `✅ Seeding complete! ${jobs.length} jobs and ${candidates.length} candidates created.`
      );
    } else {
      console.log(`Database already seeded. Total jobs: ${jobCount}`);
    }
  } catch (error) {
    console.error('[Seed] Error during database seeding:', error);
  }
}
