import { Router } from 'express';
import { getMySkillGaps, getSkillGapById } from '../controllers/skillGapController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getMySkillGaps);
router.get('/:id', authenticate, getSkillGapById);

export default router;
