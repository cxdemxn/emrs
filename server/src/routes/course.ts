import express, { RequestHandler } from 'express';
import { 
  createCourse, 
  getAllCourses, 
  getCourseById, 
  updateCourse, 
  deleteCourse,
  getCoursesByDepartmentAndLevel
} from '../controllers/course';
import { authenticate, isAdmin } from '../middleware/auth';

const router = express.Router();

// All course routes require authentication
router.use(authenticate as RequestHandler);

// Create course (admin only)
router.post('/', isAdmin as RequestHandler, createCourse as RequestHandler);

// Get all courses
router.get('/', getAllCourses as RequestHandler);

// Get courses by department and level
router.get('/department/:departmentId/level/:level', getCoursesByDepartmentAndLevel as RequestHandler);

// Get course by ID
router.get('/:id', getCourseById as RequestHandler);

// Update course (admin only)
router.put('/:id', isAdmin as RequestHandler, updateCourse as RequestHandler);

// Delete course (admin only)
router.delete('/:id', isAdmin as RequestHandler, deleteCourse as RequestHandler);

export default router;
