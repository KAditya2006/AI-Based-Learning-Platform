import { PersonalizationService } from '../PersonalizationService';
import { SkillGapLevel } from '../../models/SkillGap';

describe('PersonalizationService', () => {
  describe('calculatePriority', () => {
    it('should return CRITICAL for gap classification 4', () => {
      expect(PersonalizationService.calculatePriority(4, 1)).toBe('CRITICAL');
    });

    it('should return CRITICAL if gap size >= 3 regardless of classification', () => {
      expect(PersonalizationService.calculatePriority(2, 3)).toBe('CRITICAL');
    });

    it('should return HIGH for classification 3', () => {
      expect(PersonalizationService.calculatePriority(3, 1)).toBe('HIGH');
    });

    it('should return MEDIUM for classification 2', () => {
      expect(PersonalizationService.calculatePriority(2, 1)).toBe('MEDIUM');
    });

    it('should return LOW for classification 1', () => {
      expect(PersonalizationService.calculatePriority(1, 0.5)).toBe('LOW');
    });
  });
});
