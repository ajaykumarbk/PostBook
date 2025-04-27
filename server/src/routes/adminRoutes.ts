import { Router, Request as ExpressRequest, Response } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';
import { getAllUsers } from '../controllers/adminController';

const router = Router();

router.get('/users', authenticateToken, requireAdmin, (req: ExpressRequest, res: Response) => getAllUsers(req, res));

export default router;
