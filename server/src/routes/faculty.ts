import express, { RequestHandler } from 'express';
import { 
  createFaculty, 
  getAllFaculties, 
  getFacultyById, 
  updateFaculty, 
  deleteFaculty 
} from '../controllers/faculty';
import { authenticate, isAdmin } from '../middleware/auth';

const router = express.Router();

// All faculty routes require authentication
router.use(authenticate as RequestHandler);

// Create faculty (admin only)
router.post('/', isAdmin as RequestHandler, createFaculty as RequestHandler);

// Get all faculties
router.get('/', getAllFaculties as RequestHandler);

// Get faculty by ID
router.get('/:id', getFacultyById as RequestHandler);

// Update faculty (admin only)
router.put('/:id', isAdmin as RequestHandler, updateFaculty as RequestHandler);

// Delete faculty (admin only)
router.delete('/:id', isAdmin as RequestHandler, deleteFaculty as RequestHandler);

export default router;
