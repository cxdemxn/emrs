import React, { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { Box } from '@mui/material';
// No need to import getDepartmentLevelColor as it's not used here

// Item type for drag and drop
const ItemTypes = {
  COURSE: 'course'
};

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

interface DroppableCalendarCellProps {
  day: Date;
  timeSlot: string;
  onDrop: (courseId: string) => void;
  scheduledCourses: ScheduledCourse[];
  // These props are passed to children, not used directly in this component
  children: React.ReactNode;
}

const DroppableCalendarCell: React.FC<DroppableCalendarCellProps> = ({
  day,
  timeSlot,
  onDrop,
  scheduledCourses,
  children
}) => {
  // Find all scheduled courses for this slot
  const scheduledCoursesForSlot = React.useMemo(() => {
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

  // Set up drop target
  const [{ isOver, canDrop }, dropRef] = useDrop<{ id: string }, void, { isOver: boolean; canDrop: boolean }>({
    accept: ItemTypes.COURSE,
    drop: (item: { id: string }) => onDrop(item.id),
    canDrop: () => scheduledCoursesForSlot.length < 3, // Limit to 3 exams per slot
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  });

  // Create a div element ref
  const boxRef = useRef<HTMLDivElement>(null);
  
  // Connect the drop ref to the box ref
  useEffect(() => {
    if (boxRef.current) {
      dropRef(boxRef.current);
    }
  }, [dropRef]);
  
  return (
    <Box
      ref={boxRef}
      sx={{
        backgroundColor: isOver && canDrop 
          ? 'rgba(33, 150, 243, 0.1)' 
          : (isOver && !canDrop ? 'rgba(244, 67, 54, 0.1)' : 'transparent'),
        transition: 'all 0.2s',
        height: '100%',
        width: '100%',
        position: 'relative'
      }}
    >
      {children}
    </Box>
  );
};

export default DroppableCalendarCell;
