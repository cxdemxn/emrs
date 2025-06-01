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

/**
 * Auto-schedules exams with these rules:
 * 1) Each department-level may have up to 2 exams/day. If absolutely necessary, a third is allowed.
 * 2) Once a department-level hits 2 exams on Date D, its next weekday (D+1) is forced to be a break (no exams).
 * 3) No department-level may have 2 exams in the same time slot on the same day.
 * 4) Different department-levels may share the same (date, timeSlot).
 * 5) Return any courses that truly cannot fit (even under 3/day), so the front end can place them manually.
 */
export const autoScheduleExams = async (req: Request, res: Response) => {
  Logger.info('Starting auto-scheduling of exams');

  try {
    const { id } = req.params; // timetable ID
    const { departmentIds, levels } = req.body;

    // ─── 1) Input Validation ─────────────────────────────────────────────
    if (!Array.isArray(departmentIds) || departmentIds.length === 0) {
      res.status(400).json({ message: 'At least one department ID is required' });
    }
    if (!Array.isArray(levels) || levels.length === 0) {
      res.status(400).json({ message: 'At least one level is required' });
    }
    for (const lvl of levels) {
      if (![100, 200, 300, 400].includes(lvl)) {
        res.status(400).json({ message: 'Levels must be 100, 200, 300, or 400' });
      }
    }

    // ─── 2) Fetch Timetable & Prevent Updates if Published ───────────────
    const timetable = await prisma.timetable.findUnique({ where: { id } });
    if (!timetable) {
      res.status(404).json({ message: 'Timetable not found' });
      return
    }
    if (timetable.isPublished) {
      res.status(400).json({ message: 'Cannot update a published timetable' });
      return
    }

    // ─── 3) Fetch All Courses for Given Departments & Levels ─────────────
    Logger.debug('Fetching all courses for scheduling');
    const courses = await prisma.course.findMany({
      where: {
        departmentId: { in: departmentIds },
        level: { in: levels }
      },
      include: { department: true }
    });
    if (courses.length === 0) {
      res.status(404).json({ message: 'No courses found for the specified departments and levels' });
      return
    }

    // ─── 4) Build Chronologically Sorted Weekdays Array ─────────────────
    const availableDates = getWeekdaysBetweenDates(timetable.startDate, timetable.endDate);
    Logger.debug(`Found ${availableDates.length} weekdays for scheduling`);
    if (availableDates.length === 0) {
      res.status(400).json({ message: 'No weekdays available in the timetable date range' });
      return
    }
    availableDates.sort((a, b) => a.getTime() - b.getTime());
    const sortedDateKeys = availableDates.map((d) => d.toISOString().slice(0, 10)); // e.g. "2025-05-12"

    // ─── 5) Fetch Existing ExamSlots & Build In-Memory Maps ─────────────
    Logger.debug(`Fetching existing exam slots for timetable ID: ${id}`);
    const existingSlots = await prisma.examSlot.findMany({
      where: { timetableId: id },
      include: {
        course: { select: { departmentId: true, level: true } }
      }
    });

    // Map A: dateKey "YYYY-MM-DD" → Map<deptLevelKey, count>
    //    deptLevelKey = "<deptId>-<level>"
    const examCountsOnDate = new Map<string, Map<string, number>>();

    // Map B: "<deptId>-<level>-<YYYY-MM-DD>" → Set<TimeSlot>
    //    Tracks which timeslots are already used by that dept-level on that date.
    const usedSlotsByDeptLevelOnDate = new Map<string, Set<TimeSlot>>();

    // Populate both maps from existingSlots
    for (const slot of existingSlots) {
      const dateKey = slot.date.toISOString().slice(0, 10);
      const deptId = slot.course.departmentId;
      const lvl = slot.course.level;
      const shortDeptLvl = `${deptId}-${lvl}`;             // e.g. "42-300"
      const longDeptLvlDateKey = `${shortDeptLvl}-${dateKey}`; // e.g. "42-300-2025-05-12"

      // ─ Update examCountsOnDate
      if (!examCountsOnDate.has(dateKey)) {
        examCountsOnDate.set(dateKey, new Map<string, number>());
      }
      const dateMap = examCountsOnDate.get(dateKey)!;
      dateMap.set(shortDeptLvl, (dateMap.get(shortDeptLvl) || 0) + 1);

      // ─ Update usedSlotsByDeptLevelOnDate
      if (!usedSlotsByDeptLevelOnDate.has(longDeptLvlDateKey)) {
        usedSlotsByDeptLevelOnDate.set(longDeptLvlDateKey, new Set<TimeSlot>());
      }
      usedSlotsByDeptLevelOnDate.get(longDeptLvlDateKey)!.add(slot.timeSlot);
    }

    // ─── 6) Group Courses by "<deptId>-<level>" ─────────────────────────
    interface CourseInfo {
      id: string;
      code: string;
      title: string; // Changed from name to title to match actual course structure
      departmentId: string; // Changed from number to string to match actual type
      level: number;
      department: { id: string; name: string }; // Changed id from number to string
    }
    const coursesByDeptLevel = new Map<string, CourseInfo[]>();
    for (const c of courses as CourseInfo[]) {
      const key = `${c.departmentId}-${c.level}`;
      if (!coursesByDeptLevel.has(key)) {
        coursesByDeptLevel.set(key, []);
      }
      coursesByDeptLevel.get(key)!.push(c);
    }

    // ─── 7) Build skipSet for Forced Break-Days ───────────────────────────
    // skipSet contains strings of format "<deptLevelKey>:<dateKeyToSkip>"
    // e.g. "42-300:2025-05-13" means dept 42 lvl 300 must skip May 13.
    const skipSet = new Set<string>();

    // Pre-populate skipSet from existing counts (count ≥ 2 → skip next day)
    for (let i = 0; i < sortedDateKeys.length; i++) {
      const dateKey = sortedDateKeys[i];
      const dateMap = examCountsOnDate.get(dateKey);
      if (!dateMap) continue;

      for (const [deptLevelKey, count] of dateMap.entries()) {
        if (count >= 2 && i + 1 < sortedDateKeys.length) {
          const nextDateKey = sortedDateKeys[i + 1];
          skipSet.add(`${deptLevelKey}:${nextDateKey}`);
        }
      }
    }

    // ─── 8) Main Scheduling: Round-Robin + Break-Days + Fallback 3/day ───
    const scheduledExams: Array<{ date: Date; timeSlot: TimeSlot; courseId: string; timetableId: string }> = [];
    const unscheduled: CourseInfo[] = [];

    // All possible time slots
    const allTimeSlots: TimeSlot[] = Object.values(TimeSlot) as TimeSlot[];

    // Iterate one department-level group at a time
    for (const [deptLevelKey, courseList] of coursesByDeptLevel.entries()) {
      // deptLevelKey = "<deptId>-<level>"
      const [deptIdStr, lvlStr] = deptLevelKey.split('-');
      const deptId = parseInt(deptIdStr, 10);
      const lvl = parseInt(lvlStr, 10);

      // Shuffle this dept-level's courses so placement order is random
      const shuffledCourses = [...courseList].sort(() => Math.random() - 0.5);
      let datePointer = 0;

      // ── FIRST PASS: Place up to 2 exams/day (with forced-break logic)
      for (const course of shuffledCourses) {
        let placed = false;

        for (let tries = 0; tries < sortedDateKeys.length; tries++, datePointer++) {
          const dateKey = sortedDateKeys[datePointer % sortedDateKeys.length];
          const shortDeptLvl = `${deptId}-${lvl}`;                  // e.g. "42-300"
          const longDeptLvlDateKey = `${shortDeptLvl}-${dateKey}`;  // e.g. "42-300-2025-05-12"

          // 1) Skip forced-break days
          if (skipSet.has(`${shortDeptLvl}:${dateKey}`)) {
            skipSet.delete(`${shortDeptLvl}:${dateKey}`);
            continue;
          }

          // 2) Check how many exams this dept-level has on dateKey
          const dateMap = examCountsOnDate.get(dateKey) ?? new Map<string, number>();
          const currentCount = dateMap.get(shortDeptLvl) || 0;
          if (currentCount >= 2) {
            continue;
          }

          // 3) Check which timeslots are already used by this dept-level on dateKey
          const usedSlots = usedSlotsByDeptLevelOnDate.get(longDeptLvlDateKey) ?? new Set<TimeSlot>();

          // 4) Shuffle the four slots and pick the first free one
          const shuffledSlots = [...allTimeSlots].sort(() => Math.random() - 0.5);
          const freeSlot = shuffledSlots.find(slot => !usedSlots.has(slot));
          if (!freeSlot) {
            // No free timeslot for this dept-level on that date → skip date
            continue;
          }

          // 5a) Increment examCountsOnDate
          if (!examCountsOnDate.has(dateKey)) {
            examCountsOnDate.set(dateKey, new Map<string, number>());
          }
          const updatedCount = currentCount + 1;
          examCountsOnDate.get(dateKey)!.set(shortDeptLvl, updatedCount);

          // 5b) Mark that freeSlot is now used by this dept-level on that date
          if (!usedSlotsByDeptLevelOnDate.has(longDeptLvlDateKey)) {
            usedSlotsByDeptLevelOnDate.set(longDeptLvlDateKey, new Set<TimeSlot>());
          }
          usedSlotsByDeptLevelOnDate.get(longDeptLvlDateKey)!.add(freeSlot);

          // 5c) If updatedCount reached 2, force-break next date
          if (updatedCount >= 2) {
            const idx = sortedDateKeys.indexOf(dateKey);
            if (idx >= 0 && idx + 1 < sortedDateKeys.length) {
              const nextDateKey = sortedDateKeys[idx + 1];
              skipSet.add(`${shortDeptLvl}:${nextDateKey}`);
            }
          }

          // 5d) Actually schedule the exam
          scheduledExams.push({
            date: new Date(dateKey),
            timeSlot: freeSlot,
            courseId: course.id,
            timetableId: id
          });

          placed = true;
          break;
        }

        if (!placed) {
          // Could not place under ≤2/day → queue for fallback
          unscheduled.push(course);
        }
      }

      // ── SECOND PASS (Fallback): Allow up to 3 exams/day
      const fallbackCandidates = [...unscheduled];
      unscheduled.length = 0;

      for (const course of fallbackCandidates) {
        let placed = false;

        for (const dateKey of sortedDateKeys) {
          const shortDeptLvl = `${deptId}-${lvl}`;
          const longDeptLvlDateKey = `${shortDeptLvl}-${dateKey}`;

          // 1) Skip forced-break days
          if (skipSet.has(`${shortDeptLvl}:${dateKey}`)) {
            skipSet.delete(`${shortDeptLvl}:${dateKey}`);
            continue;
          }

          // 2) Check current per-day count
          const dateMap = examCountsOnDate.get(dateKey) ?? new Map<string, number>();
          const currentCount = dateMap.get(shortDeptLvl) || 0;
          if (currentCount >= 3) {
            continue; // cannot exceed 3 even in fallback
          }

          // 3) Check used slots for this dept-level on dateKey
          const usedSlots = usedSlotsByDeptLevelOnDate.get(longDeptLvlDateKey) ?? new Set<TimeSlot>();

          // 4) Shuffle slots and pick the first free one
          const shuffledSlots = [...allTimeSlots].sort(() => Math.random() - 0.5);
          const freeSlot = shuffledSlots.find(slot => !usedSlots.has(slot));
          if (!freeSlot) {
            continue; // all 4 slots are taken by this dept-level → skip date
          }

          // 5a) Update examCountsOnDate
          if (!examCountsOnDate.has(dateKey)) {
            examCountsOnDate.set(dateKey, new Map<string, number>());
          }
          const newCount = currentCount + 1;
          examCountsOnDate.get(dateKey)!.set(shortDeptLvl, newCount);

          // 5b) Update usedSlotsByDeptLevelOnDate
          if (!usedSlotsByDeptLevelOnDate.has(longDeptLvlDateKey)) {
            usedSlotsByDeptLevelOnDate.set(longDeptLvlDateKey, new Set<TimeSlot>());
          }
          usedSlotsByDeptLevelOnDate.get(longDeptLvlDateKey)!.add(freeSlot);

          // 5c) If newCount == 2, force-break next date
          if (newCount === 2) {
            const idx = sortedDateKeys.indexOf(dateKey);
            if (idx >= 0 && idx + 1 < sortedDateKeys.length) {
              const nextDateKey = sortedDateKeys[idx + 1];
              skipSet.add(`${shortDeptLvl}:${nextDateKey}`);
            }
          }

          // 5d) Schedule the exam
          scheduledExams.push({
            date: new Date(dateKey),
            timeSlot: freeSlot,
            courseId: course.id,
            timetableId: id
          });

          placed = true;
          break;
        }

        if (!placed) {
          Logger.warn(`Could not schedule (even as 3rd exam) course ${course.id} (${course.code})`);
          unscheduled.push(course);
        }
      }

      // End of this dept-level's two passes
    }

    // ─── 9) Persist All Scheduled Exams in a Single Transaction ─────────────
    if (scheduledExams.length > 0) {
      Logger.info(`Attempting to create ${scheduledExams.length} new exam slots`);
      const createdExamSlots = await prisma.$transaction(
        scheduledExams.map((exam) =>
          prisma.examSlot.create({
            data: {
              timetableId: exam.timetableId,
              courseId: exam.courseId,
              date: exam.date,
              timeSlot: exam.timeSlot
            },
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
        message: `Successfully scheduled ${createdExamSlots.length} exams.`,
        examSlots: createdExamSlots,
        unscheduled: unscheduled.map((c) => ({
          id: c.id,
          code: c.code,
          title: c.title, // Changed from name to title to match actual course structure
          departmentId: c.departmentId,
          level: c.level
        }))
      });
    } else {
      res.status(200).json({
        message: `No exams could be scheduled (all date/timeSlot combinations are full).`,
        examSlots: [],
        unscheduled: courses.map((c) => ({
          id: c.id,
          code: c.code,
          title: c.title, // Changed from name to title to match actual course structure
          departmentId: c.departmentId,
          level: c.level
        }))
      });
    }
  } catch (error) {
    Logger.error('Auto-schedule exams error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
