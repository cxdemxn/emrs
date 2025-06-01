import React from 'react';
import { useDrop } from 'react-dnd';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';

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

interface DroppableTimeSlotProps {
  day: Date;
  timeSlot: string;
  onDrop: (courseId: string) => void;
  scheduledCourses: ScheduledCourse[];
  onRemove: (scheduledCourseId: string) => void;
  departmentLevelColors: Record<string, string>;
}

// Item type for drag and drop
const ItemTypes = {
  COURSE: 'course'
};

export const DroppableTimeSlot: React.FC<DroppableTimeSlotProps> = (props) => {
  const { day, timeSlot, onDrop, scheduledCourses, onRemove, departmentLevelColors } = props;
  
  // Find all scheduled courses for this slot
  const scheduledCoursesForSlot = React.useMemo(() => {
    return scheduledCourses.filter(sc => {
      // Ensure both dates are Date objects
      const scDay = sc.day instanceof Date ? sc.day : new Date(sc.day);
      const slotDay = day instanceof Date ? day : new Date(day);
      
      // Compare dates by checking year, month, and day
      const sameDay = 
        scDay.getFullYear() === slotDay.getFullYear() &&
        scDay.getMonth() === slotDay.getMonth() &&
        scDay.getDate() === slotDay.getDate();
      
      // Return true if both date and time slot match
      return sameDay && sc.timeSlot === timeSlot;
    });
  }, [day, timeSlot, scheduledCourses]);
  
  // Check for conflicts (more than 2 exams for the same department-level on this day)
  const { hasConflict, examCount } = React.useMemo(() => {
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

  // Set up drop target
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ItemTypes.COURSE,
    drop: (item: { id: string }) => onDrop(item.id),
    canDrop: () => scheduledCoursesForSlot.length < 3, // Limit to 3 exams per slot
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  });

  // Log for debugging
  React.useEffect(() => {
    console.log(
      `Slot ${timeSlot} on ${day.toISOString().split('T')[0]}: ` +
      `${scheduledCoursesForSlot.length} courses, ` +
      `conflict: ${hasConflict}, examCount: ${examCount}`
    );
  }, [day, timeSlot, scheduledCoursesForSlot, hasConflict, examCount]);

  return (
    <Box
      ref={dropRef}
      sx={{
        height: '100px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        p: 1,
        backgroundColor: isOver && canDrop 
          ? 'rgba(33, 150, 243, 0.1)' 
          : (isOver && !canDrop ? 'rgba(244, 67, 54, 0.1)' : 'white'),
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
          {isOver && canDrop ? 'Drop here' : 'No exam'}
        </Typography>
      )}
    </Box>
  );
};

export default DroppableTimeSlot;
