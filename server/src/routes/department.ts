import express, { RequestHandler } from 'express';
import { 
  createDepartment, 
  getAllDepartments, 
  getDepartmentById, 
  updateDepartment, 
  deleteDepartment,
  getDepartmentRegistrationCode
} from '../controllers/department';
import { authenticate, isAdmin } from '../middleware/auth';

const router = express.Router();

// Get department by ID (public route for student registration)
router.get('/:id', getDepartmentById as RequestHandler);

// All other department routes require authentication
router.use(authenticate as RequestHandler);

// Create department (admin only)
router.post('/', isAdmin as RequestHandler, createDepartment as RequestHandler);

// Get all departments
router.get('/', getAllDepartments as RequestHandler);

// Update department (admin only)
router.put('/:id', isAdmin as RequestHandler, updateDepartment as RequestHandler);

// Delete department (admin only)
router.delete('/:id', isAdmin as RequestHandler, deleteDepartment as RequestHandler);

// Get department registration code/QR (admin only)
router.get('/:id/registration-code', isAdmin as RequestHandler, getDepartmentRegistrationCode as RequestHandler);

export default router;
