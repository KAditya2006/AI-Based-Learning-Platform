import { Router } from 'express';
import { 
  getDepartmentIntelligence, 
  getRoleIntelligence, 
  getCompetencyHeatmap, 
  getLearningEffectiveness,
  getInsights,
  generateInsights
} from '../../controllers/intelligenceController';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { UserRole } from '../../models';

export const intelligenceRouter = Router();

intelligenceRouter.use(authenticate, authorize([UserRole.ADMIN]));

intelligenceRouter.get('/departments', getDepartmentIntelligence);
intelligenceRouter.get('/roles', getRoleIntelligence);
intelligenceRouter.get('/heatmap', getCompetencyHeatmap);
intelligenceRouter.get('/learning-effectiveness', getLearningEffectiveness);
intelligenceRouter.get('/insights', getInsights);
intelligenceRouter.post('/insights/generate', generateInsights);
