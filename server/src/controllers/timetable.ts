import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { PrismaClient, TimeSlot } from '../../generated/prisma';
import Logger from '../utils/logger';

// Helper function to check if a date is a weekday (not Saturday or Sunday)
const isWeekday = (date: Date): boolean => {
  const day = date.getDay();
  return day !== 0 && day !== 6; // 0 is Sunday, 6 is Saturday
};

// Helper function to get all weekdays between two dates
const getWeekdaysBetweenDates = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (isWeekday(currentDate)) {
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// Helper function to count exams for a department-level on a specific date
const countExamsForDepartmentLevelOnDate = async (
  departmentId: string,
  level: number,
  date: Date,
  timetableId: string
): Promise<number> => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const examCount = await prisma.examSlot.count({
    where: {
      timetableId,
      date: {
        gte: startOfDay,
        lte: endOfDay
      },
      course: {
        departmentId,
        level
      }
    }
  });

  return examCount;
};

// Create a new timetable
export const createTimetable = async (req: Request, res: Response) => {
  Logger.info('Creating new timetable');
  try {
    const { title, startDate, endDate } = req.body;

    // Validate input
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: 'Title, start date, and end date are required' });
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    // Validate dates
    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (parsedStartDate >= parsedEndDate) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    // Create timetable
    Logger.debug('Creating timetable with data:', { title, startDate: parsedStartDate, endDate: parsedEndDate });
    const timetable = await prisma.timetable.create({
      data: {
        title,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        isPublished: false
      }
    });

    Logger.info(`Timetable created successfully with ID: ${timetable.id}`);
    res.status(201).json({
      message: 'Timetable created successfully',
      timetable
    });
  } catch (error) {
    Logger.error('Create timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all timetables
export const getAllTimetables = async (req: Request, res: Response) => {
  Logger.info('Fetching all timetables');
  try {
    const timetables = await prisma.timetable.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({ timetables });
  } catch (error) {
    Logger.error('Get all timetables error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get timetable by ID
export const getTimetableById = async (req: Request, res: Response) => {
  Logger.info(`Fetching timetable by ID: ${req.params.id}`);
  try {
    const { id } = req.params;

    const timetable = await prisma.timetable.findUnique({
      where: { id },
      include: {
        examSlots: {
          include: {
            course: {
              include: {
                department: true
              }
            }
          },
          orderBy: {
            date: 'asc'
          }
        }
      }
    });

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.status(200).json({ timetable });
  } catch (error) {
    Logger.error('Get timetable by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get timetable by department and level
export const getTimetableByDepartmentAndLevel = async (req: Request, res: Response) => {
  Logger.info(`Fetching timetable by department: ${req.params.departmentId} and level: ${req.query.level}`);
  try {
    const { departmentId, level } = req.params;
    
    // Validate level
    const levelInt = parseInt(level);
    if (isNaN(levelInt) || ![100, 200, 300, 400].includes(levelInt)) {
      return res.status(400).json({ message: 'Level must be 100, 200, 300, or 400' });
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

    Logger.debug(`Department found: ${department.name}`);

    // Get the latest published timetable
    Logger.debug(`Fetching timetable with ID: ${req.params.id}`);
    const timetable = await prisma.timetable.findFirst({
      where: {
        isPublished: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        examSlots: {
          where: {
            course: {
              departmentId,
              level: levelInt
            }
          },
          include: {
            course: true
          },
          orderBy: {
            date: 'asc'
          }
        }
      }
    });

    if (!timetable) {
      Logger.warn('No published timetable found');
      return res.status(404).json({ message: 'No published timetable found' });
    }

    res.status(200).json({ timetable });
  } catch (error) {
    Logger.error('Get timetable by department and level error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update timetable
export const updateTimetable = async (req: Request, res: Response) => {
  Logger.info(`Updating timetable with ID: ${req.params.id}`);
  try {
    const { id } = req.params;
    const { title, startDate, endDate } = req.body;

    // Validate input
    if (!title && !startDate && !endDate) {
      return res.status(400).json({ message: 'At least one field to update is required' });
    }

    // Check if timetable exists
    const existingTimetable = await prisma.timetable.findUnique({
      where: { id }
    });

    if (!existingTimetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    // If timetable is published, prevent updates
    if (existingTimetable.isPublished) {
      Logger.warn(`Attempt to update published timetable: ${id}`);
      return res.status(400).json({ message: 'Cannot update a published timetable' });
    }

    let parsedStartDate;
    let parsedEndDate;

    if (startDate) {
      parsedStartDate = new Date(startDate);
      if (isNaN(parsedStartDate.getTime())) {
        return res.status(400).json({ message: 'Invalid start date format' });
      }
    }

    if (endDate) {
      parsedEndDate = new Date(endDate);
      if (isNaN(parsedEndDate.getTime())) {
        return res.status(400).json({ message: 'Invalid end date format' });
      }
    }

    // Validate date range if both dates are provided
    if (parsedStartDate && parsedEndDate && parsedStartDate >= parsedEndDate) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    // Update timetable
    Logger.debug(`Updating timetable in database: ${id}`);
    const updatedTimetable = await prisma.timetable.update({
      where: { id },
      data: {
        title: title || undefined,
        startDate: parsedStartDate || undefined,
        endDate: parsedEndDate || undefined
      }
    });

    Logger.info(`Timetable updated successfully: ${updatedTimetable.id}`);
    Logger.info(`Timetable updated successfully: ${updatedTimetable.id}`);
    res.status(200).json({
      message: 'Timetable updated successfully',
      timetable: updatedTimetable
    });
  } catch (error) {
    Logger.error('Update timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete timetable
export const deleteTimetable = async (req: Request, res: Response) => {
  Logger.info(`Deleting timetable with ID: ${req.params.id}`);
  try {
    const { id } = req.params;

    // Check if timetable exists
    Logger.debug(`Checking if timetable exists: ${id}`);
    const existingTimetable = await prisma.timetable.findUnique({
      where: { id }
    });

    if (!existingTimetable) {
      Logger.warn(`Timetable not found for deletion: ${id}`);
      return res.status(404).json({ message: 'Timetable not found' });
    }

    // Delete timetable (cascade will delete exam slots)
    Logger.debug(`Deleting timetable and associated exam slots: ${id}`);
    await prisma.timetable.delete({
      where: { id }
    });

    Logger.info(`Timetable deleted successfully: ${id}`);
    res.status(200).json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    Logger.error('Delete timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Publish timetable
export const publishTimetable = async (req: Request, res: Response) => {
  Logger.info(`Publishing timetable with ID: ${req.params.id}`);
  try {
    const { id } = req.params;

    // Check if timetable exists
    const existingTimetable = await prisma.timetable.findUnique({
      where: { id },
      include: {
        examSlots: true
      }
    });

    if (!existingTimetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    // Check if timetable has any exam slots
    if (existingTimetable.examSlots.length === 0) {
      return res.status(400).json({ message: 'Cannot publish an empty timetable' });
    }

    // Update timetable to published
    Logger.debug(`Setting timetable as published: ${id}`);
    const updatedTimetable = await prisma.timetable.update({
      where: { id },
      data: {
        isPublished: true
      }
    });

    // Create notifications for all students
    Logger.debug('Fetching all students for notifications');
    const students = await prisma.student.findMany();

    Logger.info(`Creating notifications for ${students.length} students`);
    await prisma.$transaction(
      students.map(student => 
        prisma.notification.create({
          data: {
            studentId: student.id,
            message: `A new exam timetable "${updatedTimetable.title}" has been published.`
          }
        })
      )
    );

    Logger.info(`Timetable published successfully: ${updatedTimetable.id}`);
    Logger.info(`Timetable published successfully: ${updatedTimetable.id}`);
    res.status(200).json({
      message: 'Timetable published successfully',
      timetable: updatedTimetable
    });
  } catch (error) {
    Logger.error('Publish timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add exam slot to timetable
export const addExamSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, timeSlot, courseId } = req.body;

    // Validate input
    if (!date || !timeSlot || !courseId) {
      return res.status(400).json({ message: 'Date, time slot, and course ID are required' });
    }

    // Check if timetable exists
    const timetable = await prisma.timetable.findUnique({
      where: { id }
    });

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    // If timetable is published, prevent updates
    if (timetable.isPublished) {
      return res.status(400).json({ message: 'Cannot update a published timetable' });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        department: true
      }
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const parsedDate = new Date(date);
    
    // Validate date
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Check if date is within timetable range
    if (parsedDate < timetable.startDate || parsedDate > timetable.endDate) {
      return res.status(400).json({ message: 'Date must be within timetable start and end dates' });
    }

    // Check if date is a weekday
    if (!isWeekday(parsedDate)) {
      return res.status(400).json({ message: 'Exams can only be scheduled on weekdays' });
    }

    // Validate time slot
    if (!Object.values(TimeSlot).includes(timeSlot as TimeSlot)) {
      return res.status(400).json({ message: 'Invalid time slot' });
    }

    // Check if slot is already taken
    const existingSlot = await prisma.examSlot.findFirst({
      where: {
        timetableId: id,
        date: parsedDate,
        timeSlot: timeSlot as TimeSlot
      }
    });

    if (existingSlot) {
      return res.status(400).json({ message: 'This time slot is already taken' });
    }

    // Count exams for this department-level on this date
    const examCount = await countExamsForDepartmentLevelOnDate(
      course.departmentId,
      course.level,
      parsedDate,
      id
    );

    // Check if adding this exam would exceed the limit (max 3 exams per day per department-level)
    if (examCount >= 3) {
      return res.status(400).json({ 
        message: 'Maximum number of exams (3) for this department-level on this date has been reached' 
      });
    }

    // Create exam slot
    Logger.debug(`Creating exam slot for course: ${courseId}`);
    const examSlot = await prisma.examSlot.create({
      data: {
        date: parsedDate,
        timeSlot: timeSlot as TimeSlot,
        courseId,
        timetableId: id
      },
      include: {
        course: {
          include: {
            department: true
          }
        }
      }
    });

    Logger.info(`Exam slot added successfully: ${examSlot.id}`);
    res.status(201).json({
      message: 'Exam slot added successfully',
      examSlot
    });
  } catch (error) {
    Logger.error('Add exam slot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove exam slot from timetable
export const removeExamSlot = async (req: Request, res: Response) => {
  Logger.info(`Removing exam slot with ID: ${req.params.examSlotId}`);
  try {
    const { id, slotId } = req.params;

    // Check if timetable exists
    const timetable = await prisma.timetable.findUnique({
      where: { id }
    });

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    // If timetable is published, prevent updates
    if (timetable.isPublished) {
      return res.status(400).json({ message: 'Cannot update a published timetable' });
    }

    // Check if exam slot exists
    Logger.debug(`Checking if exam slot exists: ${slotId}`);
    const examSlot = await prisma.examSlot.findUnique({
      where: {
        id: slotId,
        timetableId: id
      }
    });

    if (!examSlot) {
      Logger.warn(`Exam slot not found: ${slotId}`);
      return res.status(404).json({ message: 'Exam slot not found' });
    }

    // Delete exam slot
    Logger.debug(`Deleting exam slot: ${slotId}`);
    await prisma.examSlot.delete({
      where: { id: slotId }
    });

    Logger.info(`Exam slot removed successfully: ${slotId}`);
    res.status(200).json({ message: 'Exam slot removed successfully' });
  } catch (error) {
    Logger.error('Remove exam slot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Auto-schedule exams
export const autoScheduleExams = async (req: Request, res: Response) => {
  Logger.info('Starting auto-scheduling of exams');
  try {
    const { id } = req.params;
    const { departmentIds, levels } = req.body;

    // Validate input
    if (!departmentIds || !Array.isArray(departmentIds) || departmentIds.length === 0) {
      return res.status(400).json({ message: 'At least one department ID is required' });
    }

    if (!levels || !Array.isArray(levels) || levels.length === 0) {
      return res.status(400).json({ message: 'At least one level is required' });
    }

    // Validate levels
    for (const level of levels) {
      if (![100, 200, 300, 400].includes(level)) {
        return res.status(400).json({ message: 'Levels must be 100, 200, 300, or 400' });
      }
    }

    // Check if timetable exists
    const timetable = await prisma.timetable.findUnique({
      where: { id }
    });

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    // If timetable is published, prevent updates
    if (timetable.isPublished) {
      return res.status(400).json({ message: 'Cannot update a published timetable' });
    }

    // Get all courses for the specified departments and levels
    Logger.debug('Fetching all courses for scheduling');
    const courses = await prisma.course.findMany({
      where: {
        departmentId: {
          in: departmentIds
        },
        level: {
          in: levels
        }
      },
      include: {
        department: true
      }
    });

    if (courses.length === 0) {
      return res.status(404).json({ message: 'No courses found for the specified departments and levels' });
    }

    // Get all weekdays between start and end date
    const availableDates = getWeekdaysBetweenDates(timetable.startDate, timetable.endDate);
    Logger.debug(`Found ${availableDates.length} weekdays for scheduling`);

    if (availableDates.length === 0) {
      return res.status(400).json({ message: 'No weekdays available in the timetable date range' });
    }

    // Get existing exam slots
    Logger.debug(`Fetching existing exam slots for timetable: ${id}`);
    const existingSlots = await prisma.examSlot.findMany({
      where: {
        timetableId: id
      }
    });

    // Create a map of taken slots
    const takenSlots = new Map<string, Set<TimeSlot>>();
    for (const slot of existingSlots) {
      const dateKey = slot.date.toISOString().split('T')[0];
      if (!takenSlots.has(dateKey)) {
        takenSlots.set(dateKey, new Set<TimeSlot>());
      }
      takenSlots.get(dateKey)!.add(slot.timeSlot);
    }

    // Create a map to track exams per department-level per day
    const examsPerDepartmentLevelPerDay = new Map<string, Map<string, number>>();

    // Group courses by department and level
    const coursesByDepartmentLevel = new Map<string, Array<typeof courses[0]>>();
    for (const course of courses) {
      const key = `${course.departmentId}-${course.level}`;
      if (!coursesByDepartmentLevel.has(key)) {
        coursesByDepartmentLevel.set(key, []);
      }
      coursesByDepartmentLevel.get(key)!.push(course);
    }

    // Schedule exams
    const scheduledExams = [];
    const timeSlots = Object.values(TimeSlot);

    // Process each department-level group
    for (const [key, departmentLevelCourses] of coursesByDepartmentLevel.entries()) {
      // Shuffle dates to distribute exams evenly
      const shuffledDates = [...availableDates].sort(() => Math.random() - 0.5);
      
      for (const course of departmentLevelCourses) {
        let scheduled = false;
        
        // Try to find a suitable date and time slot
        for (const date of shuffledDates) {
          const dateKey = date.toISOString().split('T')[0];
          const departmentLevelDateKey = `${key}-${dateKey}`;
          
          // Initialize exam count for this department-level-date if not exists
          if (!examsPerDepartmentLevelPerDay.has(departmentLevelDateKey)) {
            examsPerDepartmentLevelPerDay.set(departmentLevelDateKey, new Map<string, number>());
          }
          
          const examCount = await countExamsForDepartmentLevelOnDate(
            course.departmentId,
            course.level,
            date,
            id
          );
          
          // Skip if already at max exams per day (2 preferred, 3 max)
          if (examCount >= 2) {
            continue;
          }
          
          // Try each time slot
          for (const slot of timeSlots) {
            // Skip if slot is already taken
            if (takenSlots.has(dateKey) && takenSlots.get(dateKey)!.has(slot)) {
              continue;
            }
            
            // Schedule the exam
            scheduledExams.push({
              date,
              timeSlot: slot,
              courseId: course.id,
              timetableId: id
            });
            
            // Mark slot as taken
            if (!takenSlots.has(dateKey)) {
              takenSlots.set(dateKey, new Set<TimeSlot>());
            }
            takenSlots.get(dateKey)!.add(slot);
            
            // Increment exam count
            examsPerDepartmentLevelPerDay.get(departmentLevelDateKey)!.set(course.id, 1);
            
            scheduled = true;
            break;
          }
          
          if (scheduled) {
            break;
          }
        }
        
        // If still not scheduled, try again with max 3 exams per day
        if (!scheduled) {
          for (const date of shuffledDates) {
            const dateKey = date.toISOString().split('T')[0];
            const departmentLevelDateKey = `${key}-${dateKey}`;
            
            const examCount = await countExamsForDepartmentLevelOnDate(
              course.departmentId,
              course.level,
              date,
              id
            );
            
            // Skip if already at absolute max exams per day
            if (examCount >= 3) {
              continue;
            }
            
            // Try each time slot
            for (const slot of timeSlots) {
              // Skip if slot is already taken
              if (takenSlots.has(dateKey) && takenSlots.get(dateKey)!.has(slot)) {
                continue;
              }
              
              // Schedule the exam
              scheduledExams.push({
                date,
                timeSlot: slot,
                courseId: course.id,
                timetableId: id
              });
              
              // Mark slot as taken
              if (!takenSlots.has(dateKey)) {
                takenSlots.set(dateKey, new Set<TimeSlot>());
              }
              takenSlots.get(dateKey)!.add(slot);
              
              // Increment exam count
              examsPerDepartmentLevelPerDay.get(departmentLevelDateKey)!.set(course.id, 1);
              
              scheduled = true;
              break;
            }
            
            if (scheduled) {
              break;
            }
          }
        }
      }
    }

    // Create exam slots in database
    Logger.info(`Attempting to schedule ${scheduledExams.length} exams`);
    const createdExamSlots = await prisma.$transaction(
      scheduledExams.map(exam => 
        prisma.examSlot.create({
          data: exam,
          include: {
            course: {
              include: {
                department: true
              }
            }
          }
        })
      )
    );

    Logger.info(`Successfully scheduled ${createdExamSlots.length} exams`);
    res.status(200).json({
      message: `Successfully scheduled ${createdExamSlots.length} exams`,
      examSlots: createdExamSlots
    });
  } catch (error) {
    Logger.error('Auto-schedule exams error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
