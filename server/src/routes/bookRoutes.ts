import { Router, Request as ExpressRequest, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getFeaturedBooks, getAllBooks, addBook } from '../controllers/bookController';

const router = Router();

router.get('/featured', (req: ExpressRequest, res: Response) => getFeaturedBooks(req, res));
router.get('/', (req: ExpressRequest, res: Response) => getAllBooks(req, res));
router.post('/', authenticateToken, (req, res: Response) => addBook(req, res));

export default router;
