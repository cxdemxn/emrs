import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import Logger from '../utils/logger';

// Register a new student
export const registerStudent = async (req: Request, res: Response) => {
  Logger.info('Processing student registration request');
  try {
    const { name, email, password, level, departmentId, registrationCode } = req.body;

    // Validate input
    if (!name || !email || !password || !level || !departmentId || !registrationCode) {
      return res.status(400).json({ 
        message: 'Name, email, password, level, departmentId, and registrationCode are required' 
      });
    }

    // Validate level (100, 200, 300, 400)
    if (![100, 200, 300, 400].includes(level)) {
      return res.status(400).json({ message: 'Level must be 100, 200, 300, or 400' });
    }

    // Check if department exists and verify registration code
    Logger.debug(`Verifying department and registration code: ${departmentId}`);
    const department = await prisma.department.findFirst({
      where: { 
        id: departmentId,
        registrationCode 
      },
      include: { faculty: true }
    });

    if (!department) {
      Logger.warn(`Invalid department or registration code: ${departmentId}`);
      return res.status(404).json({ message: 'Department not found or invalid registration code' });
    }

    // Validate level against faculty duration
    if (level > department.faculty.duration * 100) {
      return res.status(400).json({ 
        message: `Level cannot exceed ${department.faculty.duration * 100} for this faculty` 
      });
    }

    // Check if student already exists
    Logger.debug(`Checking if student email already exists: ${email}`);
    const existingStudent = await prisma.student.findUnique({
      where: { email }
    });

    if (existingStudent) {
      Logger.warn(`Student email already exists: ${email}`);
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    Logger.debug('Creating student in database');
    const student = await prisma.student.create({
      data: {
        name,
        email,
        password: hashedPassword,
        level,
        departmentId
      }
    });

    // Generate token
    const token = jwt.sign(
      { userId: student.id, role: 'STUDENT' },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    Logger.info(`Student registered successfully: ${student.id} (${student.email})`);
    res.status(201).json({
      message: 'Student registered successfully',
      token,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        level: student.level,
        departmentId: student.departmentId
      }
    });
  } catch (error) {
    Logger.error('Register student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all students
export const getAllStudents = async (req: Request, res: Response) => {
  Logger.info('Fetching all students');
  try {
    const students = await prisma.student.findMany({
      include: {
        department: {
          select: {
            id: true,
            name: true,
            faculty: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    // Remove password from response
    const sanitizedStudents = students.map(student => {
      const { password, ...studentData } = student;
      return studentData;
    });

    res.status(200).json({ students: sanitizedStudents });
  } catch (error) {
    Logger.error('Get all students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get students by department
export const getStudentsByDepartment = async (req: Request, res: Response) => {
  Logger.info(`Fetching students by department: ${req.params.departmentId}`);
  try {
    const { departmentId } = req.params;
    const { level } = req.query;

    // Build filter
    const where: any = { departmentId };
    
    if (level) {
      where.level = parseInt(level as string);
    }

    // Check if department exists
    Logger.debug(`Checking if department exists: ${departmentId}`);
    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    });

    if (!department) {
      Logger.warn(`Department not found: ${departmentId}`);
      return res.status(404).json({ message: 'Department not found' });
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            faculty: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    // Remove password from response
    const sanitizedStudents = students.map(student => {
      const { password, ...studentData } = student;
      return studentData;
    });

    res.status(200).json({ students: sanitizedStudents });
  } catch (error) {
    Logger.error('Get students by department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student by ID
export const getStudentById = async (req: Request, res: Response) => {
  Logger.info(`Fetching student by ID: ${req.params.id}`);
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Only allow admin or the student themselves to access this data
    if (req.user?.role !== 'ADMIN' && userId !== id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            faculty: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Remove password from response
    const { password, ...studentData } = student;

    Logger.info(`Retrieved student data for: ${student.id} (${student.email})`);
    res.status(200).json({ student: studentData });
  } catch (error) {
    Logger.error('Get student by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update student
export const updateStudent = async (req: Request, res: Response) => {
  Logger.info(`Updating student with ID: ${req.params.id}`);
  try {
    const { id } = req.params;
    const { name, email, password, level } = req.body;
    const userId = req.user?.userId;

    // Only allow admin or the student themselves to update this data
    if (req.user?.role !== 'ADMIN' && userId !== id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Validate input
    if (!name && !email && !password && !level) {
      return res.status(400).json({ message: 'At least one field to update is required' });
    }

    // Validate level if provided
    if (level && ![100, 200, 300, 400].includes(level)) {
      return res.status(400).json({ message: 'Level must be 100, 200, 300, or 400' });
    }

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id },
      include: {
        department: {
          include: {
            faculty: true
          }
        }
      }
    });

    if (!existingStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Validate level against faculty duration if changing level
    if (level && level > existingStudent.department.faculty.duration * 100) {
      return res.status(400).json({ 
        message: `Level cannot exceed ${existingStudent.department.faculty.duration * 100} for this faculty` 
      });
    }

    // Check if email is already taken by another student
    if (email && email !== existingStudent.email) {
      const emailExists = await prisma.student.findUnique({
        where: { email }
      });

      if (emailExists) {
        return res.status(400).json({ message: 'Student with this email already exists' });
      }
    }

    // Hash password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update student
    Logger.debug(`Updating student in database: ${id}`);
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        name: name || undefined,
        email: email || undefined,
        password: hashedPassword || undefined,
        level: level || undefined
      }
    });

    // Remove password from response
    const { password: _, ...studentData } = updatedStudent;

    res.status(200).json({
      message: 'Student updated successfully',
      student: studentData
    });
  } catch (error) {
    Logger.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete student
export const deleteStudent = async (req: Request, res: Response) => {
  Logger.info(`Deleting student with ID: ${req.params.id}`);
  try {
    const { id } = req.params;

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id }
    });

    if (!existingStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete student
    Logger.debug(`Deleting student from database: ${id}`);
    await prisma.student.delete({
      where: { id }
    });

    Logger.info(`Student deleted successfully: ${id} (${existingStudent.email})`);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    Logger.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student notifications
export const getStudentNotifications = async (req: Request, res: Response) => {
  Logger.info(`Fetching notifications for student ID: ${req.params.id}`);
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Only allow admin or the student themselves to access this data
    if (req.user?.role !== 'ADMIN' && userId !== id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if student exists
    Logger.debug(`Checking if student exists: ${id}`);
    const student = await prisma.student.findUnique({
      where: { id }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get notifications (global and student-specific)
    Logger.debug(`Fetching notifications for student: ${id}`);
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { studentId: id },
          { studentId: null } // Global notifications
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    Logger.info(`Retrieved ${notifications.length} notifications for student: ${id}`);
    res.status(200).json({ notifications });
  } catch (error) {
    Logger.error('Get student notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req: Request, res: Response) => {
  Logger.info(`Marking notification as read: ${req.params.notificationId}`);
  try {
    const { notificationId } = req.params;
    const userId = req.user?.userId;

    // Find the notification
    Logger.debug(`Looking up notification: ${notificationId}`);
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification) {
      Logger.warn(`Notification not found: ${notificationId}`);
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if this is a student-specific notification and belongs to the student
    Logger.debug(`Authorization check: user ${userId} for notification belonging to ${notification.studentId}`);
    if (notification.studentId && notification.studentId !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Mark as read
    Logger.debug(`Updating notification status: ${notificationId}`);
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });

    res.status(200).json({
      message: 'Notification marked as read',
      notification: updatedNotification
    });
  } catch (error) {
    Logger.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
