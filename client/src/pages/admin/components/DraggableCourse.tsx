import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Box, Typography, Paper } from '@mui/material';

// Interface for Course matching the one in TimetableScheduler.tsx
interface Course {
  id: string;
  code: string;
  title: string; // Using title instead of name
  department: {
    id: string;
    name: string;
  };
  level: number;
}

interface DraggableCourseProps {
  course: Course;
  departmentId: string;
  level: number;
}

// Item type for drag and drop
const ItemTypes = {
  COURSE: 'course'
};

export const DraggableCourse: React.FC<DraggableCourseProps> = ({ 
  course, 
  departmentId,
  level 
}) => {
  // Create a regular ref that we'll pass to the drag hook
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Use the drag hook with proper typing
  const [{ isDragging }, connectDrag] = useDrag(() => ({
    type: ItemTypes.COURSE,
    item: { id: course.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  // Generate a color based on department and level
  const getDepartmentLevelColor = () => {
    // This is a simple hash function to generate consistent colors
    const str = `${departmentId}-${level}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };

  // Connect the drag ref to our element ref
  connectDrag(elementRef);
  
  return (
    <div ref={elementRef}>
      <Paper
        elevation={2}
        sx={{
        p: 1.5,
        mb: 1,
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        borderLeft: '4px solid',
        borderLeftColor: getDepartmentLevelColor(),
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        {course.code}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {course.title}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mt: 1, 
        pt: 1, 
        borderTop: '1px dashed #eee',
        fontSize: '0.75rem',
        color: 'text.secondary'
      }}>
        <span>Level {level}</span>
      </Box>
      </Paper>
    </div>
  );
};

export default DraggableCourse;
