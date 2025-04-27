import { Router, Request as ExpressRequest, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getUserProfile, updateUserProfile } from '../controllers/userController';

const router = Router();

router.get('/profile', authenticateToken, (req: ExpressRequest, res: Response) => getUserProfile(req, res));
router.put('/profile', authenticateToken, (req: ExpressRequest, res: Response) => updateUserProfile(req, res));

export default router;
