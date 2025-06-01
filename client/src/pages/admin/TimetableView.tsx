import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { Box, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// Import the reusable TimetableCalendarView component
import TimetableCalendarView from '../../components/TimetableCalendarView';

interface Faculty {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  faculty: Faculty;
}

interface Course {
  id: string;
  code: string;
  title: string;
  level: number;
  department: Department;
}

interface ExamSlot {
  id: string;
  date: string;
  timeSlot: string;
  course: Course;
}

interface Timetable {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  examSlots: ExamSlot[];
  createdAt: string;
}

// Time slot mapping for display
const timeSlotMap: Record<string, string> = {
  'SLOT_8_10': '8:00 AM - 10:00 AM',
  'SLOT_10_12': '10:00 AM - 12:00 PM',
  'SLOT_1_3': '1:00 PM - 3:00 PM',
  'SLOT_3_5': '3:00 PM - 5:00 PM'
};

const TimetableView: React.FC = () => {
  const navigate = useNavigate();
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<number | ''>('');
  const [showPrintView, setShowPrintView] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  
  // Ref for printing
  const printRef = useRef<HTMLDivElement>(null);
  
  // API base URL
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch timetables
      const timetablesResponse = await axios.get(`${API_URL}/timetables`);
      setTimetables((timetablesResponse.data as any).timetables);
      
      // Fetch departments
      const departmentsResponse = await axios.get(`${API_URL}/departments`);
      setDepartments((departmentsResponse.data as any).departments);
      
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      setLoading(false);
    }
  };

  const handleTimetableSelect = async (timetableId: string) => {
    try {
      setLoading(true);
      
      // Fetch timetable details
      const response = await axios.get(`${API_URL}/timetables/${timetableId}`);
      setSelectedTimetable((response.data as any).timetable);
      
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch timetable details');
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'filterDepartment') {
      setFilterDepartment(value);
    } else if (name === 'filterLevel') {
      setFilterLevel(value ? parseInt(value) : '');
    }
  };

  const handlePublishTimetable = async (timetableId: string) => {
    if (!window.confirm('Are you sure you want to publish this timetable? Once published, it cannot be modified.')) {
      return;
    }
    
    try {
      await axios.put(`${API_URL}/timetables/${timetableId}/publish`);
      
      // Refresh timetable data
      fetchData();
      
      if (selectedTimetable && selectedTimetable.id === timetableId) {
        handleTimetableSelect(timetableId);
      }
      
      setSuccessMessage('Timetable published successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to publish timetable');
    }
  };

  // Handle timetable editing - navigate to scheduler with timetable ID
  const handleEditTimetable = (timetableId: string) => {
    // Navigate to the scheduler page with the timetable ID as a URL parameter
    navigate(`/admin/timetables/scheduler?timetableId=${timetableId}`);
  };

  const handleDeleteTimetable = async (timetableId: string) => {
    if (!window.confirm('Are you sure you want to delete this timetable? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/timetables/${timetableId}`);
      
      // Refresh timetable data
      fetchData();
      
      if (selectedTimetable && selectedTimetable.id === timetableId) {
        setSelectedTimetable(null);
      }
      
      setSuccessMessage('Timetable deleted successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete timetable');
    }
  };

  // Group exam slots by date
  // Helper function to convert API exam slots to the format expected by TimetableCalendarView
  const convertToScheduledCourses = (examSlots: ExamSlot[]) => {
    return examSlots.map(slot => ({
      id: slot.id,
      course: slot.course,
      day: new Date(slot.date),
      timeSlot: slot.timeSlot
    }));
  };
  
  const groupExamSlotsByDate = (examSlots: ExamSlot[]) => {
    const groupedSlots: Record<string, ExamSlot[]> = {};
    
    examSlots.forEach(slot => {
      const dateKey = new Date(slot.date).toDateString();
      if (!groupedSlots[dateKey]) {
        groupedSlots[dateKey] = [];
      }
      groupedSlots[dateKey].push(slot);
    });
    
    // Sort by date
    return Object.entries(groupedSlots)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .map(([date, slots]) => ({
        date,
        slots: slots.sort((a, b) => {
          // Sort by time slot
          const timeSlotOrder = ['SLOT_8_10', 'SLOT_10_12', 'SLOT_1_3', 'SLOT_3_5'];
          return timeSlotOrder.indexOf(a.timeSlot) - timeSlotOrder.indexOf(b.timeSlot);
        })
      }));
  };

  // Filter exam slots by department and level
  const filterExamSlots = (examSlots: ExamSlot[]) => {
    return examSlots.filter(slot => {
      if (filterDepartment && slot.course.department.id !== filterDepartment) {
        return false;
      }
      if (filterLevel && slot.course.level !== filterLevel) {
        return false;
      }
      return true;
    });
  };

  // Handle print functionality
  const handlePrint = useReactToPrint({
    documentTitle: selectedTimetable ? `${selectedTimetable.title} - Timetable` : 'Exam Timetable',
    onAfterPrint: () => setShowPrintView(false),
    // Use a function that returns the current ref value
    contentRef: printRef
  });

  // Handle tab change between list and calendar views
  const handleViewModeChange = (_event: React.SyntheticEvent, newValue: 'list' | 'calendar') => {
    console.log('Changing view mode to:', newValue);
    setViewMode(newValue);
  };
  
  const togglePrintView = () => {
    setShowPrintView(!showPrintView);
    if (!showPrintView) {
      // Wait for the print view to render
      setTimeout(() => {
        handlePrint();
      }, 100);
    }
  };

  return (
    <div className="timetable-view">
      <h1>Timetable View</h1>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="timetable-list">
        <h2>Available Timetables</h2>
        
        {loading && !selectedTimetable ? (
          <div className="loading">Loading timetables...</div>
        ) : timetables.length === 0 ? (
          <div className="no-data">No timetables found. Create a new timetable first.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {timetables.map((timetable) => (
                <tr key={timetable.id}>
                  <td>{timetable.title}</td>
                  <td>{new Date(timetable.startDate).toLocaleDateString()}</td>
                  <td>{new Date(timetable.endDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status ${timetable.isPublished ? 'published' : 'draft'}`}>
                      {timetable.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{new Date(timetable.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="actions-cell">
                      <button 
                        onClick={() => handleTimetableSelect(timetable.id)}
                        className="action-button view"
                        title="View details"
                      >
                        <i className="fas fa-eye"></i>
                        View
                      </button>
                      
                      {!timetable.isPublished && (
                        <button 
                          onClick={() => handlePublishTimetable(timetable.id)}
                          className="action-button publish"
                          title="Publish timetable"
                        >
                          <i className="fas fa-check-circle"></i>
                          Publish
                        </button>
                      )}
                      
                      {!timetable.isPublished && (
                        <button 
                          onClick={() => handleEditTimetable(timetable.id)}
                          className="action-button edit"
                          title="Edit timetable"
                        >
                          <i className="fas fa-edit"></i>
                          Edit
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleDeleteTimetable(timetable.id)}
                        className="action-button delete"
                        title="Delete timetable"
                      >
                        <i className="fas fa-trash-alt"></i>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {selectedTimetable && (
        <div className="timetable-details">
          <div className="timetable-header">
            <h2>{selectedTimetable.title}</h2>
            <div className="timetable-dates">
              {new Date(selectedTimetable.startDate).toLocaleDateString()} to {new Date(selectedTimetable.endDate).toLocaleDateString()}
            </div>
            
            <div className="timetable-status">
              Status: 
              <span className={`status ${selectedTimetable.isPublished ? 'published' : 'draft'}`}>
                {selectedTimetable.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            
            <div className="timetable-actions">
              <button 
                onClick={togglePrintView}
                className="btn btn-secondary btn-icon"
              >
                <i className="fas fa-print"></i>
                <span>Print Timetable</span>
              </button>
              
              {!selectedTimetable.isPublished && (
                <button 
                  onClick={() => handlePublishTimetable(selectedTimetable.id)}
                  className="btn btn-primary btn-icon"
                >
                  <i className="fas fa-check-circle"></i>
                  <span>Publish Timetable</span>
                </button>
              )}
            </div>
          </div>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={viewMode} 
              onChange={handleViewModeChange}
              aria-label="timetable view mode"
            >
              <Tab value="list" label="List View" />
              <Tab value="calendar" label="Calendar View" />
            </Tabs>
          </Box>
          
          <div className="timetable-filters">
            <div className="form-group">
              <label htmlFor="filterDepartment" className="form-label">
                <i className="fas fa-building form-label-icon"></i>
                Filter by Department
              </label>
              <div className="form-control-icon">
                <select
                  id="filterDepartment"
                  name="filterDepartment"
                  className="form-select form-control-with-icon"
                  value={filterDepartment}
                  onChange={handleFilterChange}
                >
                  <option value="">All Departments</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name} - {department.faculty.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="filterLevel" className="form-label">
                <i className="fas fa-layer-group form-label-icon"></i>
                Filter by Level
              </label>
              <div className="form-control-icon">
                <select
                  id="filterLevel"
                  name="filterLevel"
                  className="form-select form-control-with-icon"
                  value={filterLevel}
                  onChange={handleFilterChange}
                >
                  <option value="">All Levels</option>
                  <option value={100}>100 Level</option>
                  <option value={200}>200 Level</option>
                  <option value={300}>300 Level</option>
                  <option value={400}>400 Level</option>
                </select>
              </div>
            </div>
            
            <div className="form-group" style={{ alignSelf: 'flex-end' }}>
              <button className="btn btn-secondary btn-icon">
                <i className="fas fa-filter"></i>
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="loading">Loading timetable details...</div>
          ) : selectedTimetable.examSlots.length === 0 ? (
            <div className="no-data">No exams scheduled for this timetable yet.</div>
          ) : filterExamSlots(selectedTimetable.examSlots).length === 0 ? (
            <div className="no-data">No exams match the selected filters.</div>
          ) : (
            viewMode === 'list' ? (
              <div className="exam-schedule">
                {groupExamSlotsByDate(filterExamSlots(selectedTimetable.examSlots)).map(({ date, slots }) => (
                  <div key={date} className="exam-day">
                    <div className="day-header">
                      <h3>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                    </div>
                    
                    <table className="exam-table">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Course Code</th>
                          <th>Course Title</th>
                          <th>Department</th>
                          <th>Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {slots.map(slot => (
                          <tr key={slot.id}>
                            <td>{timeSlotMap[slot.timeSlot]}</td>
                            <td>{slot.course.code}</td>
                            <td>{slot.course.title}</td>
                            <td>{slot.course.department.name}</td>
                            <td>{slot.course.level}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ) : (
              <Box sx={{ height: 'calc(100vh - 350px)', width: '100%' }}>
                <TimetableCalendarView
                  scheduledCourses={convertToScheduledCourses(filterExamSlots(selectedTimetable.examSlots))}
                  readOnly={true}
                  startDate={selectedTimetable.startDate ? new Date(selectedTimetable.startDate) : undefined}
                  endDate={selectedTimetable.endDate ? new Date(selectedTimetable.endDate) : undefined}
                />
              </Box>
            )
          )}
        </div>
      )}
      
      {/* Hidden print view */}
      {showPrintView && selectedTimetable && (
        <div className="print-view" ref={printRef}>
          <div className="print-header">
            <h1>{selectedTimetable.title}</h1>
            <p>
              <strong>Exam Period:</strong> {new Date(selectedTimetable.startDate).toLocaleDateString()} to {new Date(selectedTimetable.endDate).toLocaleDateString()}
            </p>
            {filterDepartment && (
              <p>
                <strong>Department:</strong> {departments.find(d => d.id === filterDepartment)?.name}
              </p>
            )}
            {filterLevel && (
              <p>
                <strong>Level:</strong> {filterLevel}
              </p>
            )}
          </div>
          
          <div className="print-content">
            {groupExamSlotsByDate(filterExamSlots(selectedTimetable.examSlots)).map(({ date, slots }) => (
              <div key={date} className="print-day">
                <h2>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                
                <table className="print-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Course Code</th>
                      <th>Course Title</th>
                      <th>Department</th>
                      <th>Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map(slot => (
                      <tr key={slot.id}>
                        <td>{timeSlotMap[slot.timeSlot]}</td>
                        <td>{slot.course.code}</td>
                        <td>{slot.course.title}</td>
                        <td>{slot.course.department.name}</td>
                        <td>{slot.course.level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableView;
