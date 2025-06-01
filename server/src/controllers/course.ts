import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import Logger from '../utils/logger';

// Create a new course
export const createCourse = async (req: Request, res: Response) => {
  Logger.info('Creating new course');
  try {
    const { code, title, level, departmentId } = req.body;

    // Validate input
    Logger.debug('Validating course input data');
    if (!code || !title || !level || !departmentId) {
      return res.status(400).json({ message: 'Code, title, level, and departmentId are required' });
    }

    // Validate level (100, 200, 300, 400)
    if (![100, 200, 300, 400].includes(level)) {
      return res.status(400).json({ message: 'Level must be 100, 200, 300, or 400' });
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      include: { faculty: true }
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Validate level against faculty duration
    if (level > department.faculty.duration * 100) {
      return res.status(400).json({ 
        message: `Level cannot exceed ${department.faculty.duration * 100} for this faculty` 
      });
    }

    // Check if course already exists in this department
    Logger.debug(`Checking if course code already exists: ${code} in department: ${departmentId}`);
    const existingCourse = await prisma.course.findFirst({
      where: {
        code,
        departmentId
      }
    });

    if (existingCourse) {
      Logger.warn(`Course code already exists: ${code} in department: ${departmentId}`);
      return res.status(400).json({ message: 'Course with this code already exists in this department' });
    }

    // Create course
    Logger.debug('Creating course in database');
    const course = await prisma.course.create({
      data: {
        code,
        title,
        level,
        departmentId
      }
    });

    Logger.info(`Course created successfully: ${course.id} (${course.code})`);
    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    Logger.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all courses
export const getAllCourses = async (req: Request, res: Response) => {
  Logger.info('Fetching all courses');
  try {
    const { departmentId, level } = req.query;

    // Build filter based on query parameters
    Logger.debug(`Query parameters: ${JSON.stringify(req.query)}`);
    const where: any = {};
    
    if (departmentId) {
      where.departmentId = departmentId as string;
    }
    
    if (level) {
      where.level = parseInt(level as string);
    }

    const courses = await prisma.course.findMany({
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

    res.status(200).json({ courses });
  } catch (error) {
    Logger.error('Get all courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get courses by department and level
export const getCoursesByDepartmentAndLevel = async (req: Request, res: Response) => {
  Logger.info(`Fetching courses by department and level: ${req.params.departmentId}, level: ${req.params.level}`);
  try {
    const { departmentId, level } = req.params;
    
    // Validate level
    const levelInt = parseInt(level);
    if (isNaN(levelInt) || ![100, 200, 300, 400].includes(levelInt)) {
      return res.status(400).json({ message: 'Level must be 100, 200, 300, or 400' });
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const courses = await prisma.course.findMany({
      where: {
        departmentId,
        level: levelInt
      }
    });

    res.status(200).json({ courses });
  } catch (error) {
    Logger.error('Get courses by department and level error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get course by ID
export const getCourseById = async (req: Request, res: Response) => {
  Logger.info(`Fetching course by ID: ${req.params.id}`);
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
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

    if (!course) {
      Logger.warn(`Course not found with ID: ${id}`);
      return res.status(404).json({ message: 'Course not found' });
    }
    Logger.debug(`Found course: ${course.code}`);

    Logger.info(`Retrieved course: ${course.id} (${course.code})`);
    res.status(200).json({ course });
  } catch (error) {
    Logger.error('Get course by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update course
export const updateCourse = async (req: Request, res: Response) => {
  Logger.info(`Updating course with ID: ${req.params.id}`);
  try {
    const { id } = req.params;
    const { code, title, level, departmentId } = req.body;

    // Validate input
    if (!code && !title && !level && !departmentId) {
      return res.status(400).json({ message: 'At least one field to update is required' });
    }

    // Validate level if provided
    if (level && ![100, 200, 300, 400].includes(level)) {
      return res.status(400).json({ message: 'Level must be 100, 200, 300, or 400' });
    }

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // If departmentId is changing, check if new department exists
    let newDepartment;
    if (departmentId && departmentId !== existingCourse.departmentId) {
      newDepartment = await prisma.department.findUnique({
        where: { id: departmentId },
        include: { faculty: true }
      });

      if (!newDepartment) {
        return res.status(404).json({ message: 'New department not found' });
      }
    }

    // If level is changing, validate against faculty duration
    if (level || departmentId) {
      const targetDepartment = newDepartment || await prisma.department.findUnique({
        where: { id: existingCourse.departmentId },
        include: { faculty: true }
      });

      if (targetDepartment && level && level > targetDepartment.faculty.duration * 100) {
        return res.status(400).json({ 
          message: `Level cannot exceed ${targetDepartment.faculty.duration * 100} for this faculty` 
        });
      }
    }

    // Check if code is already taken by another course in the same department
    if ((code && code !== existingCourse.code) || (departmentId && departmentId !== existingCourse.departmentId)) {
      const codeExists = await prisma.course.findFirst({
        where: {
          code: code || existingCourse.code,
          departmentId: departmentId || existingCourse.departmentId,
          NOT: {
            id: existingCourse.id
          }
        }
      });

      if (codeExists) {
        return res.status(400).json({ message: 'Course with this code already exists in this department' });
      }
    }

    // Update course
    Logger.debug(`Updating course in database: ${id}`);
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        code: code || undefined,
        title: title || undefined,
        level: level || undefined,
        departmentId: departmentId || undefined
      }
    });

    Logger.info(`Course updated successfully: ${updatedCourse.id} (${updatedCourse.code})`);
    res.status(200).json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    Logger.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete course
export const deleteCourse = async (req: Request, res: Response) => {
  Logger.info(`Deleting course with ID: ${req.params.id}`);
  try {
    const { id } = req.params;

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete course
    Logger.debug(`Deleting course from database: ${id}`);
    await prisma.course.delete({
      where: { id }
    });

    Logger.info(`Course deleted successfully: ${id} (${existingCourse.code})`);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    Logger.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
