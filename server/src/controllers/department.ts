import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import Logger from '../utils/logger';

// Create a new department
export const createDepartment = async (req: Request, res: Response) => {
  Logger.info('Processing create department request');
  try {
    const { name, facultyId } = req.body;

    // Validate input
    if (!name || !facultyId) {
      return res.status(400).json({ message: 'Name and facultyId are required' });
    }

    // Check if faculty exists
    Logger.debug(`Checking if faculty exists: ${facultyId}`);
    const faculty = await prisma.faculty.findUnique({
      where: { id: facultyId }
    });

    if (!faculty) {
      Logger.warn(`Faculty not found for department creation: ${facultyId}`);
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Check if department already exists in this faculty
    Logger.debug(`Checking if department name already exists: ${name} in faculty: ${facultyId}`);
    const existingDepartment = await prisma.department.findFirst({
      where: {
        name,
        facultyId
      }
    });

    if (existingDepartment) {
      Logger.warn(`Department name already exists: ${name} in faculty: ${facultyId}`);
      return res.status(400).json({ message: 'Department with this name already exists in this faculty' });
    }

    // Create department
    Logger.debug('Creating department in database');
    const department = await prisma.department.create({
      data: {
        name,
        facultyId
      }
    });

    Logger.info(`Department created successfully: ${department.id} (${department.name})`);
    res.status(201).json({
      message: 'Department created successfully',
      department
    });
  } catch (error) {
    Logger.error('Create department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all departments
export const getAllDepartments = async (req: Request, res: Response) => {
  Logger.info('Fetching all departments');
  try {
    const { facultyId } = req.query;

    // Filter by faculty if facultyId is provided
    Logger.debug(`Query parameters: ${JSON.stringify(req.query)}`);
    const where = facultyId ? { facultyId: facultyId as string } : {};

    Logger.debug('Executing department query with filters');
    const departments = await prisma.department.findMany({
      where,
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
            duration: true
          }
        },
        courses: {
          select: {
            id: true,
            code: true,
            title: true,
            level: true
          }
        }
      }
    });

    Logger.info(`Retrieved ${departments.length} departments`);
    res.status(200).json({ departments });
  } catch (error) {
    Logger.error('Get all departments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get department by ID
export const getDepartmentById = async (req: Request, res: Response) => {
  Logger.info(`Fetching department by ID: ${req.params.id}`);
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
            duration: true
          }
        },
        courses: {
          select: {
            id: true,
            code: true,
            title: true,
            level: true
          }
        }
      }
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    Logger.info(`Retrieved department: ${department.id} (${department.name})`);
    res.status(200).json({ department });
  } catch (error) {
    Logger.error('Get department by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update department
export const updateDepartment = async (req: Request, res: Response) => {
  Logger.info(`Updating department with ID: ${req.params.id}`);
  try {
    const { id } = req.params;
    const { name, facultyId } = req.body;

    // Validate input
    if (!name && !facultyId) {
      return res.status(400).json({ message: 'At least one field to update is required' });
    }

    // Check if department exists
    const existingDepartment = await prisma.department.findUnique({
      where: { id }
    });

    if (!existingDepartment) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // If facultyId is changing, check if new faculty exists
    if (facultyId && facultyId !== existingDepartment.facultyId) {
      const faculty = await prisma.faculty.findUnique({
        where: { id: facultyId }
      });

      if (!faculty) {
        return res.status(404).json({ message: 'New faculty not found' });
      }
    }

    // Check if name is already taken by another department in the same faculty
    if (name && name !== existingDepartment.name) {
      const nameExists = await prisma.department.findFirst({
        where: {
          name,
          facultyId: facultyId || existingDepartment.facultyId
        }
      });

      if (nameExists) {
        return res.status(400).json({ message: 'Department with this name already exists in this faculty' });
      }
    }

    // Update department
    Logger.debug(`Updating department in database: ${id}`);
    const updatedDepartment = await prisma.department.update({
      where: { id },
      data: {
        name: name || undefined,
        facultyId: facultyId || undefined
      }
    });

    Logger.info(`Department updated successfully: ${updatedDepartment.id} (${updatedDepartment.name})`);
    res.status(200).json({
      message: 'Department updated successfully',
      department: updatedDepartment
    });
  } catch (error) {
    Logger.error('Update department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete department
export const deleteDepartment = async (req: Request, res: Response) => {
  Logger.info(`Deleting department with ID: ${req.params.id}`);
  try {
    const { id } = req.params;

    // Check if department exists
    const existingDepartment = await prisma.department.findUnique({
      where: { id }
    });

    if (!existingDepartment) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Delete department (cascade will delete courses)
    Logger.debug(`Deleting department from database: ${id}`);
    await prisma.department.delete({
      where: { id }
    });

    Logger.info(`Department deleted successfully: ${id} (${existingDepartment.name})`);
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    Logger.error('Delete department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get department registration code/QR
export const getDepartmentRegistrationCode = async (req: Request, res: Response) => {
  Logger.info(`Fetching registration code for department ID: ${req.params.id}`);
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        registrationCode: true
      }
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json({
      department: {
        id: department.id,
        name: department.name,
        registrationCode: department.registrationCode
      }
    });
  } catch (error) {
    Logger.error('Get department registration code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
