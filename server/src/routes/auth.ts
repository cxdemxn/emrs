import express, { RequestHandler } from 'express';
import { register, login, getProfile } from '../controllers/auth';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Add RequestHandler type to fix TypeScript errors
router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);
router.get('/profile', authenticate as RequestHandler, getProfile as RequestHandler);

export default router;
