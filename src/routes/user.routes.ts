import { Router } from 'express';
import { getAllUsers, getProfile } from '../controllers/user.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.get('/', authorizeAdmin, getAllUsers);

export default router;
