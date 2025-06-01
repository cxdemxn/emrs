import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  Alert, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  LinearProgress, 
  Snackbar 
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Publish as PublishIcon
} from '@mui/icons-material';
import { format, addDays, isWeekend } from 'date-fns';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../styles/scheduler.css';
import { TreeView, TreeItem } from '@mui/lab';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Import the DraggableCourse and DroppableTimeSlot components
import { DraggableCourse, DroppableTimeSlot } from './components';

// API URL
const API_URL = 'http://localhost:5000/api';

// Types
interface Timetable {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  isPublished?: boolean;
  examSlots?: ExamSlot[];
}

interface Course {
  id: string;
  code: string;
  title: string; 
  department: Department;
  level: number;
}

interface Department {
  id: string;
  name: string;
  faculty: Faculty;
}

interface Faculty {
  id: string;
  name: string;
}

interface ExamSlot {
  id: string;
  date: string;
  timeSlot: string;
  course: Course;
  timetableId: string;
}

interface CourseTree {
  faculty: string;
  facultyId: string;
  departments: {
    name: string;
    departmentId: string;
    levels: {
      level: number;
      courses: Course[];
    }[];
  }[];
}

interface ScheduledCourse {
  id: string;
  course: Course;
  day: Date;
  timeSlot: string;
}

// Time slot mapping (matches backend enum)
const TIME_SLOT_MAP: Record<string, string> = {
  'SLOT_8_10': '8:00 AM - 10:00 AM',
  'SLOT_10_12': '10:00 AM - 12:00 PM',
  'SLOT_1_3': '1:00 PM - 3:00 PM',
  'SLOT_3_5': '3:00 PM - 5:00 PM'
};

// Time slots array
const TIME_SLOTS = Object.keys(TIME_SLOT_MAP);

// Interface for API responses
interface ApiResponse {
  message: string;
  [key: string]: any;
}

interface FacultiesResponse extends ApiResponse {
  faculties: Faculty[];
}

interface DepartmentsResponse extends ApiResponse {
  departments: Department[];
}

interface CoursesResponse extends ApiResponse {
  courses: Course[];
}

interface TimetableResponse extends ApiResponse {
  timetable: Timetable;
}

interface ExamSlotResponse extends ApiResponse {
  examSlot: ExamSlot;
}

interface ExamSlotsResponse extends ApiResponse {
  examSlots: ExamSlot[];
}

const TimetableScheduler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const timetable = location.state?.timetable as Timetable;
  
  // State for data
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [scheduledCourses, setScheduledCourses] = useState<ScheduledCourse[]>([]);
  const [, setLoading] = useState<boolean>(false);
  const [, setError] = useState<string | null>(null);
  
  // State for UI
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [isAutoScheduling, setIsAutoScheduling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [, setIsPublishing] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [hasConflicts, setHasConflicts] = useState(false);
  const [courseTree, setCourseTree] = useState<CourseTree[]>([]);
  
  // Department level colors for visual distinction
  const DEPARTMENT_LEVEL_COLORS: Record<string, string> = {
    'dept-1-100': '#2196f3', // CS Level 100
    'dept-1-200': '#0288d1', // CS Level 200
    'dept-2-100': '#4caf50', // Math Level 100
    'dept-2-300': '#2e7d32', // Math Level 300
    'dept-3-100': '#ff9800', // Nursing Level 100
    'dept-4-100': '#f44336'  // English Level 100
  };
  
  // Initialize weekdays from timetable date range and fetch data
  useEffect(() => {
    if (timetable) {
      generateWeekDays(new Date(timetable.startDate), new Date(timetable.endDate));
      fetchData();
    } else {
      // If no timetable data, redirect back to form
      navigate('/admin/timetables/create');
    }
  }, [timetable, navigate]);
  
  // Fetch all necessary data
  const fetchData = async () => {
    try {
      // Fetch faculties
      const facultiesResponse = await axios.get<FacultiesResponse>(`${API_URL}/faculties`);
      const fetchedFaculties = facultiesResponse.data.faculties;
      setFaculties(fetchedFaculties);
      
      // Fetch departments
      const departmentsResponse = await axios.get<DepartmentsResponse>(`${API_URL}/departments`);
      const fetchedDepartments = departmentsResponse.data.departments;
      setDepartments(fetchedDepartments);
      
      // Fetch courses
      const coursesResponse = await axios.get<CoursesResponse>(`${API_URL}/courses`);
      const fetchedCourses = coursesResponse.data.courses;
      setCourses(fetchedCourses);
      
      // Fetch timetable with exam slots
      if (timetable) {
        const timetableResponse = await axios.get<TimetableResponse>(`${API_URL}/timetables/${timetable.id}?includeExamSlots=true`);
        const fetchedTimetable = timetableResponse.data.timetable;
        
        // Convert exam slots to scheduled courses
        if (fetchedTimetable.examSlots && fetchedTimetable.examSlots.length > 0) {
          const scheduledCoursesFromSlots = fetchedTimetable.examSlots.map(slot => ({
            id: slot.id,
            course: slot.course,
            day: new Date(slot.date),
            timeSlot: slot.timeSlot
          }));
          
          setScheduledCourses(scheduledCoursesFromSlots);
        }
      }
      
      // Build the course tree after all data is fetched
      const tree = buildCourseTree();
      setCourseTree(tree);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load timetable data. Please try again.');
      setLoading(false);
      setSnackbarMessage('Failed to load timetable data');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  // Generate weekdays (excluding weekends) for the timetable date range
  const generateWeekDays = (startDate: Date, endDate: Date) => {
    const days: Date[] = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (!isWeekend(currentDate)) {
        days.push(new Date(currentDate));
      }
      currentDate = addDays(currentDate, 1);
    }
    
    setWeekDays(days);
  };
  
  // Build hierarchical course tree for the course selection panel
  const buildCourseTree = (): CourseTree[] => {
    if (!courses.length || !departments.length || !faculties.length) return [];
    
    const tree: CourseTree[] = [];
    
    // Group by faculty
    faculties.forEach(faculty => {
      const facultyDepartments = departments.filter(d => d.faculty.id === faculty.id);
      
      if (facultyDepartments.length > 0) {
        const facultyNode: CourseTree = {
          faculty: faculty.name,
          facultyId: faculty.id,
          departments: []
        };
        
        // Group by department
        facultyDepartments.forEach(dept => {
          const deptCourses = courses.filter(c => c.department.id === dept.id);
          
          if (deptCourses.length > 0) {
            // Find all levels in this department
            const levels = [...new Set(deptCourses.map(c => c.level))];
            
            const deptNode = {
              name: dept.name,
              departmentId: dept.id,
              levels: levels.map(level => ({
                level,
                courses: deptCourses.filter(c => c.level === level)
              }))
            };
            
            facultyNode.departments.push(deptNode);
          }
        });
        
        tree.push(facultyNode);
      }
    });
    
    return tree;
  };
  
  // Check if a course is already scheduled
  const isCourseScheduled = (courseId: string): boolean => {
    return scheduledCourses.some(sc => sc.course.id === courseId);
  };
  
  // Count exams for a department-level on a specific day
  const countExamsForDepartmentLevelOnDay = (departmentId: string, level: number, day: Date): number => {
    return scheduledCourses.filter(sc => 
      sc.course.department.id === departmentId && 
      sc.course.level === level && 
      sc.day.toDateString() === day.toDateString()
    ).length;
  };
  
  // Update conflict status
  const updateConflictStatus = () => {
    // Check if any department-level has more than 2 exams on any day
    let hasAnyConflicts = false;
    
    weekDays.forEach(day => {
      departments.forEach(dept => {
        // Get all levels for this department from courses
        const levels = [...new Set(courses
          .filter(c => c.department.id === dept.id)
          .map(c => c.level))];
        
        levels.forEach(level => {
          const examCount = countExamsForDepartmentLevelOnDay(dept.id, level, day);
          if (examCount > 2) {
            hasAnyConflicts = true;
          }
        });
      });
    });
    
    setHasConflicts(hasAnyConflicts);
  };
  
  // Update course tree when scheduled courses change
  useEffect(() => {
    if (courses.length && departments.length && faculties.length) {
      const tree = buildCourseTree();
      setCourseTree(tree);
    }
  }, [scheduledCourses, courses, departments, faculties]);
  
  // Check for conflicts when scheduling a course
  const checkForConflicts = (course: Course, day: Date, timeSlot: string): 'none' | 'warning' | 'error' => {
    // Count exams for this department-level on this day
    const examCount = countExamsForDepartmentLevelOnDay(course.department.id, course.level, day);
    
    // Check if there's already a course scheduled in this time slot on this day
    const timeSlotConflict = scheduledCourses.some(sc => 
      sc.day.toDateString() === day.toDateString() && 
      sc.timeSlot === timeSlot
    );
    
    if (timeSlotConflict) {
      return 'error'; // Cannot schedule two exams in the same time slot
    }
    
    if (examCount >= 3) {
      return 'error'; // Max 3 exams per department-level per day
    }
    
    if (examCount === 2) {
      return 'warning'; // Warning at 3 exams
    }
    
    return 'none';
  };
  
  // Handle auto-scheduling via API
  const handleAutoSchedule = async () => {
    setIsAutoScheduling(true);
    
    try {
      // Get all department IDs and levels for auto-scheduling
      const departmentIds = departments.map(dept => dept.id);
      
      // Get unique levels from courses
      const levels = [...new Set(courses.map(course => course.level))];
      
      // Call auto-schedule API endpoint with required data
      const response = await axios.post<ExamSlotsResponse>(
        `${API_URL}/timetables/${timetable.id}/auto-schedule`,
        { departmentIds, levels }
      );
      
      // Convert returned exam slots to scheduled courses
      if (response.data.examSlots && response.data.examSlots.length > 0) {
        console.log('Auto-scheduled exam slots:', response.data.examSlots);
        
        // Process the auto-scheduled courses
        const autoScheduledCourses = response.data.examSlots.map(slot => {
          // Create a proper date object from the server response
          const dateObj = new Date(slot.date);
          console.log(`Original date from server: ${slot.date}, converted to: ${dateObj.toISOString()}`);
          
          return {
            id: slot.id,
            course: slot.course,
            day: dateObj,
            timeSlot: slot.timeSlot
          };
        });
        
        console.log('Processed auto-scheduled courses:', autoScheduledCourses);
        console.log('Current weekDays:', weekDays.map(d => d.toISOString()));
        
        // Update the scheduled courses state
        setScheduledCourses(autoScheduledCourses);
        updateConflictStatus();
        
        setSnackbarMessage('Auto-scheduling completed successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('No courses could be auto-scheduled');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Auto-scheduling error:', error);
      setSnackbarMessage('Failed to auto-schedule exams');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsAutoScheduling(false);
    }
  };
  
  // Handle course drop (drag and drop scheduling)
  const handleCourseDrop = async (courseId: string, day: Date, timeSlot: string) => {
    // Find the course object
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    // Check for conflicts before scheduling
    const conflictStatus = checkForConflicts(course, day, timeSlot);
    
    if (conflictStatus === 'error') {
      setSnackbarMessage('Cannot schedule: Maximum 3 exams per department-level per day reached');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    try {
      // Call API to add exam slot
      const response = await axios.post<ExamSlotResponse>(
        `${API_URL}/timetables/${timetable.id}/exam-slots`,
        {
          courseId,
          date: format(day, 'yyyy-MM-dd'),
          timeSlot
        }
      );
      
      // Create new scheduled course from response
      const newScheduledCourse: ScheduledCourse = {
        id: response.data.examSlot.id,
        course,
        day,
        timeSlot
      };
      
      // Update scheduled courses state
      setScheduledCourses([...scheduledCourses, newScheduledCourse]);
      
      // Update conflict status
      updateConflictStatus();
      
      if (conflictStatus === 'warning') {
        setSnackbarMessage('Course scheduled with warning: 3 exams on same day for this department-level');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Course scheduled successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error scheduling course:', error);
      setSnackbarMessage('Failed to schedule course');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
};

// Remove a scheduled course
const handleRemoveCourse = async (scheduledCourseId: string) => {
  try {
    // Call API to remove exam slot
    await axios.delete(`${API_URL}/timetables/${timetable.id}/exam-slots/${scheduledCourseId}`);
    
    // Update state by filtering out the removed course
    setScheduledCourses(scheduledCourses.filter(sc => sc.id !== scheduledCourseId));
    
    // Update conflict status
    updateConflictStatus();
    
    setSnackbarMessage('Course removed from schedule');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  } catch (error) {
    console.error('Error removing course:', error);
    setSnackbarMessage('Failed to remove course from schedule');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  }
};

// Save draft timetable
const handleSaveDraft = async () => {
  setIsSaving(true);
  
  try {
    // Call API to save draft
    await axios.put<TimetableResponse>(
      `${API_URL}/timetables/${timetable.id}`,
      {
        ...timetable,
        isPublished: false
      }
    );
    
    setSnackbarMessage('Timetable draft saved successfully');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  } catch (error) {
    console.error('Error saving draft:', error);
    setSnackbarMessage('Failed to save timetable draft');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  } finally {
    setIsSaving(false);
  }
};

// Open publish confirmation dialog
const handlePublish = () => {
  if (hasConflicts) {
    setSnackbarMessage('Cannot publish timetable with conflicts. Please resolve conflicts first.');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
    return;
  }
  
  setPublishDialogOpen(true);
};

// Confirm and publish timetable
const confirmPublish = async () => {
  setPublishDialogOpen(false);
  setIsPublishing(true);
  
  try {
    // Call API to publish timetable
    await axios.put<TimetableResponse>(
      `${API_URL}/timetables/${timetable.id}/publish`,
      {}
    );
    
    // Update local state
    // Create a published version of the timetable
    // (Not storing in a variable since we're using the response directly)
    
    setSnackbarMessage('Timetable published successfully');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    
    // Navigate back to timetables list after successful publish
    setTimeout(() => {
      navigate('/admin/timetables', { replace: true });
    }, 2000);
  } catch (error) {
    console.error('Error publishing timetable:', error);
    setSnackbarMessage('Failed to publish timetable');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  } finally {
    setIsPublishing(false);
  }
};

// Close snackbar
const handleCloseSnackbar = () => {
  setSnackbarOpen(false);
};

// If no timetable data, show loading or redirect
if (!timetable) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">No timetable data found. Please create a timetable first.</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/admin/timetables/create')}
          sx={{ mt: 2 }}
        >
          Create Timetable
        </Button>
      </Box>
    );
  }
  
  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ p: 2 }}>
        {/* Header Section */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2,
            pb: 2,
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {timetable.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {format(new Date(timetable.startDate), 'MMM d, yyyy')} - {format(new Date(timetable.endDate), 'MMM d, yyyy')}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={handleAutoSchedule}
              disabled={isAutoScheduling}
            >
              {isAutoScheduling ? 'Auto-Scheduling...' : 'Auto-Schedule'}
            </Button>
            
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<SaveIcon />}
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<PublishIcon />}
              onClick={handlePublish}
              disabled={hasConflicts}
            >
              Publish
            </Button>
          </Box>
        </Box>
        
        {/* Auto-scheduling progress indicator */}
        {isAutoScheduling && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress />
          </Box>
        )}
        
        {/* Main Content */}
        <Grid container spacing={2}>
          {/* Left Column: Unscheduled Courses */}
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4', lg: 'span 3' } }}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                height: 'calc(100vh - 200px)', 
                overflow: 'auto'
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Unscheduled Courses
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
              >
                {courseTree.map((faculty: CourseTree, facultyIndex: number) => (
                  <TreeItem 
                    key={`faculty-${facultyIndex}`} 
                    nodeId={`faculty-${facultyIndex}`} 
                    label={faculty.faculty}
                  >
                    {faculty.departments.map((department: any, deptIndex: number) => (
                      <TreeItem 
                        key={`dept-${facultyIndex}-${deptIndex}`} 
                        nodeId={`dept-${facultyIndex}-${deptIndex}`} 
                        label={department.name}
                      >
                        {department.levels.map((level: any, levelIndex: number) => (
                          <TreeItem 
                            key={`level-${facultyIndex}-${deptIndex}-${levelIndex}`} 
                            nodeId={`level-${facultyIndex}-${deptIndex}-${levelIndex}`} 
                            label={`Level ${level.level}`}
                          >
                            {level.courses
                              .filter((course: Course) => !isCourseScheduled(course.id))
                              .map((course: Course) => (
                                <Box key={course.id} sx={{ p: 1 }}>
                                  <DraggableCourse 
                                    course={{
                                      ...course,
                                      title: course.title || course.code, // Ensure title exists
                                      department: {
                                        id: course.department.id,
                                        name: course.department.name
                                      }
                                    }} 
                                    departmentId={department.name}
                                    level={level.level}
                                  />
                                </Box>
                              ))}
                          </TreeItem>
                        ))}
                      </TreeItem>
                    ))}
                  </TreeItem>
                ))}
              </TreeView>
            </Paper>
          </Grid>
          
          {/* Right Column: Calendar Grid */}
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 8', lg: 'span 9' } }}>
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
                      {timeSlot}
                    </Box>
                    
                    {/* Calendar cells for this time slot */}
                    {weekDays.slice(0, 5).map((day, dayIndex) => (
                      <DroppableTimeSlot
                        key={`${dayIndex}-${timeIndex}`}
                        day={day}
                        timeSlot={timeSlot}
                        onDrop={(courseId) => handleCourseDrop(courseId, day, timeSlot)}
                        scheduledCourses={scheduledCourses}
                        onRemove={handleRemoveCourse}
                        departmentLevelColors={DEPARTMENT_LEVEL_COLORS}
                      />
                    ))}
                    
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
          </Grid>
        </Grid>
        
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity} 
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        
        {/* Publish confirmation dialog */}
        <Dialog
          open={publishDialogOpen}
          onClose={() => setPublishDialogOpen(false)}
        >
          <DialogTitle>Publish Timetable</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to publish this timetable? Once published, it will be visible to all students.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPublishDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmPublish} color="primary" variant="contained">
              Publish
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DndProvider>
  );
};

export default TimetableScheduler;
