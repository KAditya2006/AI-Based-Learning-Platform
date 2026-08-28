import { Router } from 'express';
import { getAllCompetencies, getCompetencyById } from '../controllers/competencyController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getAllCompetencies);
router.get('/:id', authenticate, getCompetencyById);

export default router;
