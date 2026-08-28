import { SkillGapService } from '../SkillGapService';
import { SkillGapLevel } from '../../models/SkillGap';

describe('SkillGapService', () => {
  describe('calculateGapLevel', () => {
    it('should return NO_GAP when gapSize is 0 or less', () => {
      expect(SkillGapService.calculateGapLevel(0)).toBe(SkillGapLevel.NO_GAP);
      expect(SkillGapService.calculateGapLevel(-1)).toBe(SkillGapLevel.NO_GAP);
    });

    it('should return LOW for gapSize 1', () => {
      expect(SkillGapService.calculateGapLevel(1)).toBe(SkillGapLevel.LOW);
    });

    it('should return MODERATE for gapSize 2', () => {
      expect(SkillGapService.calculateGapLevel(2)).toBe(SkillGapLevel.MODERATE);
    });

    it('should return HIGH for gapSize 3', () => {
      expect(SkillGapService.calculateGapLevel(3)).toBe(SkillGapLevel.HIGH);
    });

    it('should return CRITICAL for gapSize 4 or more', () => {
      expect(SkillGapService.calculateGapLevel(4)).toBe(SkillGapLevel.CRITICAL);
      expect(SkillGapService.calculateGapLevel(5)).toBe(SkillGapLevel.CRITICAL);
    });
  });
});
