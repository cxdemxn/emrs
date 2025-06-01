import express, { RequestHandler } from 'express';
import { 
  registerStudent, 
  getAllStudents, 
  getStudentById, 
  updateStudent, 
  deleteStudent,
  getStudentsByDepartment,
  getStudentNotifications,
  markNotificationAsRead
} from '../controllers/student';
import { authenticate, isAdmin } from '../middleware/auth';

const router = express.Router();

// Student registration (public route)
router.post('/register', registerStudent as RequestHandler);

// All other student routes require authentication
router.use(authenticate as RequestHandler);

// Get all students (admin only)
router.get('/', isAdmin as RequestHandler, getAllStudents as RequestHandler);

// Get students by department (admin only)
router.get('/department/:departmentId', isAdmin as RequestHandler, getStudentsByDepartment as RequestHandler);

// Get student by ID
router.get('/:id', getStudentById as RequestHandler);

// Update student
router.put('/:id', updateStudent as RequestHandler);

// Delete student (admin only)
router.delete('/:id', isAdmin as RequestHandler, deleteStudent as RequestHandler);

// Get student notifications
router.get('/:id/notifications', getStudentNotifications as RequestHandler);

// Mark notification as read
router.put('/notifications/:notificationId/read', markNotificationAsRead as RequestHandler);

export default router;
