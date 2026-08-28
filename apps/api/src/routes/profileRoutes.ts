import { Router } from 'express';
import { getProfile, updateProfile, getMetadata } from '../controllers/profileController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { updateProfileSchema } from '../schemas';

const router = Router();

router.get('/metadata', authenticate, getMetadata);
router.get('/', authenticate, getProfile);
router.patch('/', authenticate, validateRequest(updateProfileSchema), updateProfile);

export default router;
