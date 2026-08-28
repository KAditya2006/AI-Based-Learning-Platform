import { AssessmentService } from '../AssessmentService';

describe('AssessmentService - Deterministic Scoring', () => {
  describe('evaluateCompetencyLevel', () => {
    it('should jump up 2 levels for exceptional score (>= 95)', () => {
      expect(AssessmentService.evaluateCompetencyLevel(1, 95)).toBe(3);
      expect(AssessmentService.evaluateCompetencyLevel(2, 100)).toBe(4);
    });

    it('should cap at level 5 even with exceptional score', () => {
      expect(AssessmentService.evaluateCompetencyLevel(4, 98)).toBe(5);
      expect(AssessmentService.evaluateCompetencyLevel(5, 100)).toBe(5);
    });

    it('should jump up 1 level for strong score (80 - 94)', () => {
      expect(AssessmentService.evaluateCompetencyLevel(1, 80)).toBe(2);
      expect(AssessmentService.evaluateCompetencyLevel(3, 94)).toBe(4);
    });

    it('should maintain current level for average score (50 - 79)', () => {
      expect(AssessmentService.evaluateCompetencyLevel(2, 50)).toBe(2);
      expect(AssessmentService.evaluateCompetencyLevel(3, 79)).toBe(3);
    });

    it('should drop 1 level for failing score (< 50)', () => {
      expect(AssessmentService.evaluateCompetencyLevel(4, 49)).toBe(3);
      expect(AssessmentService.evaluateCompetencyLevel(2, 0)).toBe(1);
    });

    it('should not drop below level 1', () => {
      expect(AssessmentService.evaluateCompetencyLevel(1, 40)).toBe(1);
      expect(AssessmentService.evaluateCompetencyLevel(1, 0)).toBe(1);
    });
  });
});
