import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { QuizService } from './QuizService';
import { Assessment, Question, AssessmentAttempt } from '../models';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

describe('QuizService', () => {
  it('should correctly grade a submitted assessment and update attempt status', async () => {
    // 1. Setup mock questions
    const q1 = await Question.create({
      text: 'What is 2+2?',
      options: [
        { id: 'a', text: '3' },
        { id: 'b', text: '4' }
      ],
      correctOptionId: 'b',
      difficulty: 'BEGINNER',
      source: 'TEST',
      status: 'ACTIVE'
    });

    const q2 = await Question.create({
      text: 'What is the capital of France?',
      options: [
        { id: 'a', text: 'London' },
        { id: 'b', text: 'Paris' }
      ],
      correctOptionId: 'b',
      difficulty: 'BEGINNER',
      source: 'TEST',
      status: 'ACTIVE'
    });

    // 2. Setup mock assessment
    const assessment = await Assessment.create({
      title: 'Basic Knowledge',
      description: 'A test assessment',
      passingScore: 50,
      questions: [q1._id, q2._id],
      isPublished: true,
      attemptPolicy: 'UNLIMITED'
    });

    const learnerId = new mongoose.Types.ObjectId().toString();

    // 3. Submit assessment with 50% score (1 correct, 1 wrong)
    const answers = [
      { questionId: q1._id.toString(), selectedOptionId: 'b' }, // Correct
      { questionId: q2._id.toString(), selectedOptionId: 'a' }  // Wrong
    ];

    const result = await QuizService.submitQuiz(learnerId, assessment._id.toString(), answers);

    // 4. Verify results
    expect(result.attempt.score).toBe(1);
    expect(result.attempt.percentage).toBe(50);
    expect(result.attempt.passed).toBe(true); // Since passing score is 50
    expect(result.attempt.answers.length).toBe(2);

    // 5. Submit with 100%
    const answers100 = [
      { questionId: q1._id.toString(), selectedOptionId: 'b' }, // Correct
      { questionId: q2._id.toString(), selectedOptionId: 'b' }  // Correct
    ];
    const result2 = await QuizService.submitQuiz(learnerId, assessment._id.toString(), answers100);
    expect(result2.attempt.score).toBe(2);
    expect(result2.attempt.percentage).toBe(100);
    expect(result2.attempt.passed).toBe(true);
    
    // 6. Submit with 0%
    const answers0 = [
      { questionId: q1._id.toString(), selectedOptionId: 'a' }, // Wrong
      { questionId: q2._id.toString(), selectedOptionId: 'a' }  // Wrong
    ];
    const result3 = await QuizService.submitQuiz(learnerId, assessment._id.toString(), answers0);
    expect(result3.attempt.score).toBe(0);
    expect(result3.attempt.percentage).toBe(0);
    expect(result3.attempt.passed).toBe(false);
  });
});
