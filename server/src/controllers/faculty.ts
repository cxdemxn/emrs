import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import Logger from '../utils/logger';

// Create a new faculty
export const createFaculty = async (req: Request, res: Response) => {
  Logger.info('Processing create faculty request');
  try {
    const { name, duration } = req.body;

    // Validate input
    if (!name || !duration) {
      return res.status(400).json({ message: 'Name and duration are required' });
    }

    // Validate duration (3 or 4 years as per requirements)
    if (duration !== 3 && duration !== 4) {
      return res.status(400).json({ message: 'Duration must be either 3 or 4 years' });
    }

    // Check if faculty already exists
    Logger.debug(`Checking if faculty name already exists: ${name}`);
    const existingFaculty = await prisma.faculty.findUnique({
      where: { name }
    });

    if (existingFaculty) {
      Logger.warn(`Faculty name already exists: ${name}`);
      return res.status(400).json({ message: 'Faculty with this name already exists' });
    }

    // Create faculty
    Logger.debug('Creating faculty in database');
    const faculty = await prisma.faculty.create({
      data: {
        name,
        duration
      }
    });

    Logger.info(`Faculty created successfully: ${faculty.id} (${faculty.name})`);
    res.status(201).json({
      message: 'Faculty created successfully',
      faculty
    });
  } catch (error) {
    Logger.error('Create faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all faculties
export const getAllFaculties = async (req: Request, res: Response) => {
  Logger.info('Fetching all faculties');
  try {
    Logger.debug('Executing faculty query');
    const faculties = await prisma.faculty.findMany({
      include: {
        departments: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    Logger.info(`Retrieved ${faculties.length} faculties`);
    res.status(200).json({ faculties });
  } catch (error) {
    Logger.error('Get all faculties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get faculty by ID
export const getFacultyById = async (req: Request, res: Response) => {
  Logger.info(`Fetching faculty by ID: ${req.params.id}`);
  try {
    const { id } = req.params;

    Logger.debug(`Looking up faculty with ID: ${id}`);
    const faculty = await prisma.faculty.findUnique({
      where: { id },
      include: {
        departments: {
          include: {
            courses: {
              select: {
                id: true,
                code: true,
                title: true,
                level: true
              }
            }
          }
        }
      }
    });

    if (!faculty) {
      Logger.warn(`Faculty not found with ID: ${id}`);
      return res.status(404).json({ message: 'Faculty not found' });
    }
    Logger.debug(`Found faculty: ${faculty.name}`);

    Logger.info(`Retrieved faculty: ${faculty.id} (${faculty.name})`);
    res.status(200).json({ faculty });
  } catch (error) {
    Logger.error('Get faculty by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update faculty
export const updateFaculty = async (req: Request, res: Response) => {
  Logger.info(`Updating faculty with ID: ${req.params.id}`);
  try {
    const { id } = req.params;
    const { name, duration } = req.body;

    // Validate input
    if (!name && !duration) {
      return res.status(400).json({ message: 'At least one field to update is required' });
    }

    // Validate duration if provided
    if (duration !== undefined && duration !== 3 && duration !== 4) {
      return res.status(400).json({ message: 'Duration must be either 3 or 4 years' });
    }

    // Check if faculty exists
    const existingFaculty = await prisma.faculty.findUnique({
      where: { id }
    });

    if (!existingFaculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Check if name is already taken by another faculty
    if (name && name !== existingFaculty.name) {
      const nameExists = await prisma.faculty.findUnique({
        where: { name }
      });

      if (nameExists) {
        return res.status(400).json({ message: 'Faculty with this name already exists' });
      }
    }

    // Update faculty
    Logger.debug(`Updating faculty in database: ${id}`);
    const updatedFaculty = await prisma.faculty.update({
      where: { id },
      data: {
        name: name || undefined,
        duration: duration || undefined
      }
    });

    Logger.info(`Faculty updated successfully: ${updatedFaculty.id} (${updatedFaculty.name})`);
    res.status(200).json({
      message: 'Faculty updated successfully',
      faculty: updatedFaculty
    });
  } catch (error) {
    Logger.error('Update faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete faculty
export const deleteFaculty = async (req: Request, res: Response) => {
  Logger.info(`Deleting faculty with ID: ${req.params.id}`);
  try {
    const { id } = req.params;

    // Check if faculty exists
    const existingFaculty = await prisma.faculty.findUnique({
      where: { id }
    });

    if (!existingFaculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Delete faculty (cascade will delete departments and courses)
    Logger.debug(`Deleting faculty from database: ${id}`);
    await prisma.faculty.delete({
      where: { id }
    });

    Logger.info(`Faculty deleted successfully: ${id} (${existingFaculty.name})`);
    res.status(200).json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    Logger.error('Delete faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
