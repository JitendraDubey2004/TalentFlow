// src/api/seeds/seedData.js

import { faker } from '@faker-js/faker';
import db from '../db/dexie';

// required stages for candidates [cite: 35]
const CANDIDATE_STAGES = [
    "applied", 
    "screen", 
    "tech", 
    "offer", 
    "hired", 
    "rejected"
];

//  question types for assessments 
const QUESTION_TYPES = [
    'single-choice', 'multi-choice', 'short-text', 
    'long-text', 'numeric', 'file-upload'
];



const generateJobs = (count) => {
    const jobs = [];
    for (let i = 1; i <= count; i++) {
        const title = faker.person.jobTitle();
        jobs.push({
            id: i,
            title: title,
            // Simple slug generation
            slug: title.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, ''),
            // Mix of active and archived status
            status: faker.helpers.arrayElement(['active', 'archived', 'active', 'active']),
            // Random tags
            tags: faker.helpers.arrayElements(['Frontend', 'Backend', 'Fullstack', 'Remote', 'Urgent', 'Lead'], { min: 1, max: 3 }),
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
            questions.push({
                id: q + 1,
                type: faker.helpers.arrayElement(QUESTION_TYPES),
                text: faker.lorem.sentence(),
            
                options: faker.helpers.maybe(() => (
                    ['single-choice', 'multi-choice'].includes(QUESTION_TYPES[q % QUESTION_TYPES.length])
                        ? faker.helpers.arrayElements(faker.lorem.words(10).split(' '), { min: 3, max: 5 })
                        : undefined
                ), { probability: 0.5 }),
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



export async function seedDatabase() {
    console.log("Checking database for seed data...");
    
    
    const jobCount = await db.jobs.count();

    if (jobCount === 0) {
        console.log("Seeding database...");

        const jobs = generateJobs(25); 
        const jobIds = jobs.map(j => j.id);
        const candidates = generateCandidates(1000, jobIds);  
        const assessments = generateAssessments(3, jobIds.slice(0, 3)); 

      
        try {
            await db.jobs.bulkAdd(jobs);
            await db.candidates.bulkAdd(candidates);
            await db.assessments.bulkAdd(assessments);
            
            console.log(`Seeding complete! ${jobs.length} jobs and ${candidates.length} candidates created.`);
        } catch (error) {
            console.error("Error during database seeding:", error);
        }
    } else {
        console.log("Database already seeded. Total jobs:", jobCount);
    }
}