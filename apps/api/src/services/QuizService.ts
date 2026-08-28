import { Assessment, AssessmentAttempt, Question, AssessmentType } from '../models';
import { AssessmentService } from './AssessmentService';

export class QuizService {
  static async submitQuiz(
    learnerId: string,
    assessmentId: string,
    answers: { questionId: string; selectedOptionId: string }[]
  ) {
    const assessment = await Assessment.findById(assessmentId).populate('questions');
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    let correctCount = 0;
    const totalQuestions = assessment.questions.length;

    // We need to fetch all questions for scoring
    const questions = await Question.find({ _id: { $in: assessment.questions } });

    for (const answer of answers) {
      const q = questions.find(q => q._id.toString() === answer.questionId);
      if (q && q.correctOptionId === answer.selectedOptionId) {
        correctCount++;
      }
    }

    const percentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const passed = percentage >= assessment.passingScore;

    // Record the attempt
    const attempt = await AssessmentAttempt.create({
      learner: learnerId,
      assessment: assessmentId,
      answers,
      score: correctCount,
      percentage,
      passed,
      startedAt: new Date(), // We assume it started now for simplicity in this phase
      completedAt: new Date()
    });

    // Find previous level
    const previous = await AssessmentService.getPreviousLevel(learnerId, assessment.competency.toString());
    const newLevel = AssessmentService.evaluateCompetencyLevel(previous, percentage);

    // If completed, update competency level
    await AssessmentService.submitAssessment(
      learnerId,
      assessment.competency.toString(),
      newLevel,
      AssessmentType.QUIZ,
      `Assessment: ${assessment.title}`,
      `Scored ${percentage.toFixed(2)}%. Previous level was ${previous}, new level is ${newLevel}.`
    );

    return { attempt, previousLevel: previous, newLevel };
  }
}
