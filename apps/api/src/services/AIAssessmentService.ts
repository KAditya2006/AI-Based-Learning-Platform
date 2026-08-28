import { GeneratedQuestion, Competency, MaterialChunk } from '../models';
import { JobService } from './JobService';
import { aiService } from '../ai/AIService';

export class AIAssessmentService {
  static async generateQuestions(requesterId: string, materialId: string, competencyId: string, difficulty: string, count: number) {
    const job = await JobService.createJob(requesterId, 'MCQ_GENERATION', { materialId, competencyId, difficulty, count });

    JobService.executeAsync(job._id.toString(), async () => {
      // Fetch some chunks to provide as context
      const chunks = await MaterialChunk.find({ materialId }).limit(5);
      const textChunks = chunks.map(c => c.text);

      const comp = await Competency.findById(competencyId);
      const competencyName = comp ? comp.name : 'General Knowledge';

      // Call AI
      const result = await aiService.generateMCQs(requesterId, job._id.toString(), textChunks, competencyName, difficulty, count);

      // Save as draft questions
      const createdQuestions = [];
      for (const q of result.questions) {
        // Validation Checks
        if (!q.text || q.text.trim().length === 0) continue;
        if (!q.options || q.options.length < 2) continue;
        
        // Ensure options have unique text
        const optionTexts = q.options.map((o: any) => o.text.trim().toLowerCase());
        const uniqueOptions = new Set(optionTexts);
        if (uniqueOptions.size !== optionTexts.length) continue; // Duplicates found
        
        // Ensure exactly one correct answer
        const correctCount = q.options.filter((o: any) => o.id === q.correctOptionId).length;
        if (correctCount !== 1) continue; // Invalid correct option ID

        const draft = await GeneratedQuestion.create({
          jobId: job._id,
          materialId,
          competencyId,
          text: q.text,
          options: q.options,
          correctOptionId: q.correctOptionId,
          explanation: q.explanation,
          difficulty,
          status: 'DRAFT',
          createdBy: requesterId
        });
        createdQuestions.push(draft._id);
      }

      return { generatedQuestionIds: createdQuestions };
    });

    return job;
  }

  static async updateQuestionStatus(questionId: string, status: 'APPROVED' | 'REJECTED') {
    const q = await GeneratedQuestion.findByIdAndUpdate(questionId, { status }, { new: true });
    if (!q) throw new Error('Generated Question not found');
    
    // If approved, you might copy it to the main `Question` collection
    if (status === 'APPROVED') {
      const { Question } = require('../models');
      await Question.create({
        text: q.text,
        options: q.options,
        correctOptionId: q.correctOptionId,
        explanation: q.explanation,
        difficulty: q.difficulty,
        competency: q.competencyId,
        source: 'AI_GENERATED',
        status: 'ACTIVE'
      });
    }

    return q;
  }
}
