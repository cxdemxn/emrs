import express, { RequestHandler } from 'express';
import { 
  createTimetable,
  getAllTimetables,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
  publishTimetable,
  addExamSlot,
  removeExamSlot,
  autoScheduleExams,
  getTimetableByDepartmentAndLevel,
  getExamSlots
} from '../controllers/timetable';
import { authenticate, isAdmin } from '../middleware/auth';

const router = express.Router();

// All timetable routes require authentication
router.use(authenticate as RequestHandler);

// Create timetable (admin only)
router.post('/', isAdmin as RequestHandler, createTimetable as RequestHandler);

// Get all timetables
router.get('/', getAllTimetables as RequestHandler);

// Get timetable by department and level (for students)
router.get('/department/:departmentId/level/:level', getTimetableByDepartmentAndLevel as RequestHandler);

// Get timetable by ID
router.get('/:id', getTimetableById as RequestHandler);

// Update timetable (admin only)
router.put('/:id', isAdmin as RequestHandler, updateTimetable as RequestHandler);

// Delete timetable (admin only)
router.delete('/:id', isAdmin as RequestHandler, deleteTimetable as RequestHandler);

// Publish timetable (admin only)
router.put('/:id/publish', isAdmin as RequestHandler, publishTimetable as RequestHandler);

// Add exam slot to timetable (admin only)
router.post('/:id/exam-slots', isAdmin as RequestHandler, addExamSlot as RequestHandler);

// Get all exam slots for a timetable
router.get('/:id/exam-slots', authenticate as RequestHandler, getExamSlots as RequestHandler);

// Remove exam slot from timetable (admin only)
router.delete('/:id/exam-slots/:slotId', isAdmin as RequestHandler, removeExamSlot as RequestHandler);

// Auto-schedule exams (admin only)
router.post('/:id/auto-schedule', isAdmin as RequestHandler, autoScheduleExams as RequestHandler);

export default router;
