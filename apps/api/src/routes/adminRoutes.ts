import { Router } from 'express';
import { getWorkforce, getUserById, getAdminCompetencies, createAdminCompetency, updateAdminCompetency, getAnalytics, createUser, updateUser, deleteUser, getAuditLogs } from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validateRequest } from '../middleware/validate';
import { createCompetencySchema, updateCompetencySchema } from '../schemas';
import { UserRole } from '../models';

const router = Router();

// Apply auth and admin authorization to all admin routes
router.use(authenticate, authorize([UserRole.ADMIN]));

router.get('/analytics', getAnalytics);

router.get('/users', getWorkforce);
router.post('/users', createUser);
router.get('/users/:id', getUserById);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/audit-logs', getAuditLogs);

router.get('/competencies', getAdminCompetencies);
router.post('/competencies', validateRequest(createCompetencySchema), createAdminCompetency);
router.patch('/competencies/:id', validateRequest(updateCompetencySchema), updateAdminCompetency);

export default router;
