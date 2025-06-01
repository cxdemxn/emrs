import React, { useMemo } from 'react';
import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import { format } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import DroppableCalendarCell from './DroppableCalendarCell';

// Types
interface Department {
  id: string;
  name: string;
}

interface Course {
  id: string;
  code: string;
  title: string;
  department: Department;
  level: number;
}

interface ScheduledCourse {
  id: string;
  course: Course;
  day: Date;
  timeSlot: string;
}

interface CalendarCellProps {
  day: Date;
  timeSlot: string;
  scheduledCourses: ScheduledCourse[];
  onRemove?: (scheduledCourseId: string) => void;
  departmentLevelColors: Record<string, string>;
  readOnly?: boolean;
}

interface TimetableCalendarViewProps {
  scheduledCourses: ScheduledCourse[];
  onCourseDrop?: (courseId: string, day: Date, timeSlot: string) => void;
  onRemoveCourse?: (scheduledCourseId: string) => void;
  readOnly?: boolean;
  startDate?: Date;
  endDate?: Date;
}

// Time slot constants
export const TIME_SLOTS = ['SLOT_8_10', 'SLOT_10_12', 'SLOT_1_3', 'SLOT_3_5'];
export const TIME_SLOT_MAP: Record<string, string> = {
  'SLOT_8_10': '8:00 AM - 10:00 AM',
  'SLOT_10_12': '10:00 AM - 12:00 PM',
  'SLOT_1_3': '1:00 PM - 3:00 PM',
  'SLOT_3_5': '3:00 PM - 5:00 PM'
};

// Department level colors for consistent coloring
const DEPARTMENT_LEVEL_COLORS: Record<string, string> = {};

// Calendar Cell Component
const CalendarCell: React.FC<CalendarCellProps> = ({
  day,
  timeSlot,
  scheduledCourses,
  onRemove,
  departmentLevelColors,
  readOnly = false
}) => {
  // Find all scheduled courses for this slot
  const scheduledCoursesForSlot = useMemo(() => {
    if (!scheduledCourses || scheduledCourses.length === 0) {
      return [];
    }
    
    return scheduledCourses.filter(sc => {
      if (!sc || !sc.day) {
        return false;
      }
      
      // Ensure both dates are Date objects
      const scDay = sc.day instanceof Date ? sc.day : new Date(sc.day);
      const slotDay = day instanceof Date ? day : new Date(day);
      
      // Compare dates by checking year, month, and day
      const scDayString = scDay.toISOString().split('T')[0];
      const slotDayString = slotDay.toISOString().split('T')[0];
      const sameDay = scDayString === slotDayString;
      
      // Return true if both date and time slot match
      return sameDay && sc.timeSlot === timeSlot;
    });
  }, [day, timeSlot, scheduledCourses]);
  
  // Check for conflicts (more than 2 exams for the same department-level on this day)
  const { hasConflict, examCount } = useMemo(() => {
    if (scheduledCoursesForSlot.length === 0) {
      return { hasConflict: false, examCount: 0 };
    }

    // Group courses by department-level
    const deptLevelCounts: Record<string, number> = {};
    
    // Count exams per department-level on this day
    scheduledCourses.forEach(sc => {
      const scDay = sc.day instanceof Date ? sc.day : new Date(sc.day);
      const slotDay = day instanceof Date ? day : new Date(day);
      
      const sameDay = 
        scDay.getFullYear() === slotDay.getFullYear() &&
        scDay.getMonth() === slotDay.getMonth() &&
        scDay.getDate() === slotDay.getDate();
      
      if (sameDay) {
        const key = `${sc.course.department.id}-${sc.course.level}`;
        deptLevelCounts[key] = (deptLevelCounts[key] || 0) + 1;
      }
    });
    
    // Find the maximum number of exams for any department-level
    const maxExams = Object.values(deptLevelCounts).length > 0 
      ? Math.max(...Object.values(deptLevelCounts)) 
      : 0;
    
    return {
      hasConflict: maxExams > 2,
      examCount: maxExams
    };
  }, [day, scheduledCourses, scheduledCoursesForSlot]);
  
  return (
    <Box
      sx={{
        height: '100px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        p: 1,
        backgroundColor: 'white',
        transition: 'all 0.2s',
        position: 'relative',
        ...(hasConflict && {
          borderColor: 'warning.main',
          borderWidth: '2px'
        })
      }}
    >
      {scheduledCoursesForSlot.length > 0 ? (
        <Box
          sx={{
            height: '100%',
            backgroundColor: 'white',
            borderRadius: '4px',
            p: 1,
            position: 'relative',
            overflowY: 'auto',
            ...(hasConflict && {
              backgroundColor: 'rgba(255, 152, 0, 0.1)'
            }),
            ...(examCount === 2 && !hasConflict && {
              backgroundColor: 'rgba(255, 235, 59, 0.1)'
            })
          }}
        >
          {scheduledCoursesForSlot.map((sc, index) => (
            <Box 
              key={sc.id}
              sx={{
                mb: index < scheduledCoursesForSlot.length - 1 ? 1 : 0,
                borderLeft: '4px solid',
                borderLeftColor: departmentLevelColors[`dept-${sc.course.department.id}-${sc.course.level}`] || '#9e9e9e',
                pl: 1,
                borderRadius: '2px',
                position: 'relative'
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" noWrap>
                {sc.course.code}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {sc.course.title}
              </Typography>
              
              {!readOnly && onRemove && (
                <IconButton
                  size="small"
                  onClick={() => onRemove(sc.id)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    padding: '2px'
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
          
          {/* Conflict indicator - only show at the slot level if there are conflicts */}
          {hasConflict && (
            <Tooltip title={`There are ${examCount} exams for one or more department-levels on this day`}>
              <WarningIcon 
                color="warning" 
                fontSize="small" 
                sx={{ 
                  position: 'absolute',
                  bottom: 4,
                  right: 4
                }} 
              />
            </Tooltip>
          )}
        </Box>
      ) : (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '0.75rem'
          }}
        >
          No exam
        </Typography>
      )}
    </Box>
  );
};

// Generate a color based on department and level
export const getDepartmentLevelColor = (departmentId: string, level: number): string => {
  const key = `dept-${departmentId}-${level}`;
  
  if (!DEPARTMENT_LEVEL_COLORS[key]) {
    // This is a simple hash function to generate consistent colors
    const str = `${departmentId}-${level}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = hash % 360;
    DEPARTMENT_LEVEL_COLORS[key] = `hsl(${hue}, 70%, 80%)`;
  }
  
  return DEPARTMENT_LEVEL_COLORS[key];
};

// Main Calendar Component
const TimetableCalendarView: React.FC<TimetableCalendarViewProps> = ({
  scheduledCourses,
  onCourseDrop,
  onRemoveCourse,
  readOnly = false,
  startDate,
  endDate
}) => {
  // Generate weekdays for the calendar
  const weekDays = useMemo(() => {
    // If we have start and end dates, use those to determine the date range
    if (startDate && endDate) {
      const days: Date[] = [];
      const currentDate = new Date(startDate);
      
      // Add dates from start to end (weekdays only)
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        // Only add weekdays (1-5 = Monday-Friday)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          days.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
        
        // Limit to 5 days for display
        if (days.length >= 5) break;
      }
      
      return days;
    } else {
      // Fallback to current week if no dates provided
      const today = new Date();
      const days: Date[] = [];
      
      // Find the Monday of this week
      const dayOfWeek = today.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Sunday
      const monday = new Date(today);
      monday.setDate(today.getDate() - diff);
      
      // Generate 5 days (Monday to Friday)
      for (let i = 0; i < 5; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        days.push(day);
      }
      
      return days;
    }
  }, [startDate, endDate]);
  
  // Initialize department level colors
  useMemo(() => {
    scheduledCourses.forEach(sc => {
      getDepartmentLevelColor(sc.course.department.id, sc.course.level);
    });
  }, [scheduledCourses]);
  
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        height: 'calc(100vh - 200px)', 
        overflow: 'auto'
      }}
    >
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: '100px repeat(5, 1fr)',
          gap: 1,
          mb: 2
        }}
      >
        {/* Empty cell for top-left corner */}
        <Box sx={{ backgroundColor: '#f5f5f5', p: 1 }}></Box>
        
        {/* Day headers */}
        {weekDays.slice(0, 5).map((day, index) => (
          <Box 
            key={index} 
            sx={{ 
              backgroundColor: '#f5f5f5', 
              p: 1, 
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            {format(day, 'EEE')}
            <br />
            {format(day, 'MMM d')}
          </Box>
        ))}
        
        {/* Time slots and calendar cells */}
        {TIME_SLOTS.map((timeSlot, timeIndex) => (
          <React.Fragment key={timeSlot}>
            {/* Time slot label */}
            <Box 
              sx={{ 
                backgroundColor: '#f5f5f5', 
                p: 1, 
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem'
              }}
            >
              {TIME_SLOT_MAP[timeSlot]}
            </Box>
            
            {/* Calendar cells for this time slot */}
            {weekDays.slice(0, 5).map((day, dayIndex) => {
              // If not in readOnly mode and we have onCourseDrop handler, use DroppableCalendarCell
              if (!readOnly && onCourseDrop) {
                return (
                  <DroppableCalendarCell
                    key={`${dayIndex}-${timeIndex}`}
                    day={day}
                    timeSlot={timeSlot}
                    scheduledCourses={scheduledCourses}
                    onDrop={(courseId) => onCourseDrop(courseId, day, timeSlot)}
                  >
                    <CalendarCell
                      day={day}
                      timeSlot={timeSlot}
                      scheduledCourses={scheduledCourses}
                      onRemove={onRemoveCourse}
                      departmentLevelColors={DEPARTMENT_LEVEL_COLORS}
                      readOnly={readOnly}
                    />
                  </DroppableCalendarCell>
                );
              }
              
              // Otherwise use regular CalendarCell
              return (
                <CalendarCell
                  key={`${dayIndex}-${timeIndex}`}
                  day={day}
                  timeSlot={timeSlot}
                  scheduledCourses={scheduledCourses}
                  onRemove={onRemoveCourse}
                  departmentLevelColors={DEPARTMENT_LEVEL_COLORS}
                  readOnly={readOnly}
                />
              );
            })}
            
            {/* Add lunch break row after the second time slot */}
            {timeIndex === 1 && (
              <React.Fragment>
                <Box 
                  sx={{ 
                    backgroundColor: '#eeeeee', 
                    p: 1, 
                    textAlign: 'center',
                    gridColumn: '1 / 2',
                    fontSize: '0.85rem',
                    fontStyle: 'italic'
                  }}
                >
                  Lunch Break
                  <br />
                  12-1 PM
                </Box>
                
                {weekDays.slice(0, 5).map((_, dayIndex) => (
                  <Box 
                    key={`lunch-${dayIndex}`} 
                    sx={{ 
                      backgroundColor: '#eeeeee', 
                      p: 1,
                      textAlign: 'center',
                      fontStyle: 'italic',
                      color: '#666'
                    }}
                  >
                    Lunch Break
                  </Box>
                ))}
              </React.Fragment>
            )}
          </React.Fragment>
        ))}
      </Box>
    </Paper>
  );
};

export default TimetableCalendarView;
