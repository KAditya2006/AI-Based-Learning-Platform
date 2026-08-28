import { z } from 'zod';
import { CompetencyDomain } from '../models/Competency';

// Admin Schemas
export const createCompetencySchema = z.object({
  body: z.object({
    frameworkId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Framework ID'),
    name: z.string().min(2),
    code: z.string().min(2),
    domain: z.nativeEnum(CompetencyDomain),
    description: z.string().optional()
  })
});

export const updateCompetencySchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    code: z.string().min(2).optional(),
    domain: z.nativeEnum(CompetencyDomain).optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional()
  })
});

// AI Schemas
export const chatSchema = z.object({
  body: z.object({
    conversationId: z.string().min(1),
    message: z.string().min(1)
  })
});

export const generateQuestionsSchema = z.object({
  body: z.object({
    materialId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Material ID'),
    competencyId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Competency ID'),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    count: z.number().min(1).max(10)
  })
});

// Learning Schemas
export const createLearningResourceSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    type: z.enum(['COURSE', 'VIDEO', 'DOCUMENT', 'INTERACTIVE']),
    source: z.enum(['INTERNAL', 'IGOT', 'PROGRAMME', 'OTHER']),
    externalId: z.string().optional(),
    url: z.string().url().optional(),
    durationMinutes: z.number().min(1),
    competencies: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional()
  })
});

export const updateLearningResourceSchema = z.object({
  body: createLearningResourceSchema.shape.body.partial()
});

export const updateProgressSchema = z.object({
  body: z.object({
    progressPercentage: z.number().min(0).max(100)
  })
});

// Profile Schemas
export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    department: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    designation: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    bio: z.string().optional()
  })
});

// Quiz Schemas
export const createQuestionSchema = z.object({
  body: z.object({
    text: z.string().min(1),
    options: z.array(z.object({
      id: z.string().min(1),
      text: z.string().min(1),
      isCorrect: z.boolean()
    })).min(2),
    explanation: z.string().optional(),
    competencyId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    difficultyLevel: z.number().min(1).max(5),
    isActive: z.boolean().optional()
  })
});
