import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { useAuth } from '../../context/AuthContext';

interface Department {
  id: string;
  name: string;
  faculty: {
    id: string;
    name: string;
  };
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
}

interface Student {
  id: string;
  name: string;
  level: number;
  departmentId: string;
  department: Department;
}

// Time slot mapping for display
const timeSlotMap: Record<string, string> = {
  'SLOT_8_10': '8:00 AM - 10:00 AM',
  'SLOT_10_12': '10:00 AM - 12:00 PM',
  'SLOT_1_3': '1:00 PM - 3:00 PM',
  'SLOT_3_5': '3:00 PM - 5:00 PM'
};

const StudentTimetable: React.FC = () => {
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [viewAll, setViewAll] = useState<boolean>(false);
  const [showPrintView, setShowPrintView] = useState<boolean>(false);
  
  const { userId } = useAuth();
  
  // Ref for printing
  const printRef = useRef<HTMLDivElement>(null);
  
  // API base URL
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch student profile
      const studentResponse = await axios.get(`${API_URL}/students/${userId}`);
      setStudent((studentResponse.data as any).student);
      
      // Fetch timetable for student's department and level
      const departmentId = (studentResponse.data as any).student.departmentId;
      const level = (studentResponse.data as any).student.level;
      
      const timetableResponse = await axios.get(
        `${API_URL}/timetables/department/${departmentId}/level/${level}`
      );
      
      setTimetable((timetableResponse.data as any).timetable);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch timetable');
      setLoading(false);
    }
  };

  const fetchAllExams = async () => {
    try {
      if (!timetable) return;
      
      setLoading(true);
      
      // Fetch the complete timetable with all exams
      const response = await axios.get(`${API_URL}/timetables/${timetable.id}`);
      setTimetable((response.data as any).timetable);
      setViewAll(true);
      
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch all exams');
      setLoading(false);
    }
  };

  const fetchDepartmentExams = async () => {
    if (!student) return;
    
    try {
      setLoading(true);
      
      // Fetch timetable for student's department and level
      const departmentId = student.departmentId;
      const level = student.level;
      
      const timetableResponse = await axios.get(
        `${API_URL}/timetables/department/${departmentId}/level/${level}`
      );
      
      setTimetable((timetableResponse.data as any).timetable);
      setViewAll(false);
      
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch department exams');
      setLoading(false);
    }
  };

  // Group exam slots by date
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

  // Handle print functionality
  const handlePrint = useReactToPrint({
    documentTitle: timetable ? `${timetable.title} - Timetable` : 'Exam Timetable',
    onAfterPrint: () => setShowPrintView(false),
    contentRef: printRef
  });

  const togglePrintView = () => {
    setShowPrintView(!showPrintView);
    if (!showPrintView) {
      // Wait for the print view to render
      setTimeout(() => {
        handlePrint();
      }, 100);
    }
  };

  if (loading) {
    return <div className="loading">Loading timetable data...</div>;
  }

  return (
    <div className="student-timetable">
      <h1>Exam Timetable</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {!timetable ? (
        <div className="no-timetable">
          <h2>No Published Timetable</h2>
          <p>There is no published timetable available for your department and level at this time.</p>
          <p>Please check back later or contact your department administrator.</p>
        </div>
      ) : (
        <>
          <div className="timetable-header">
            <div className="timetable-info">
              <h2>{timetable.title}</h2>
              <div className="timetable-dates">
                {new Date(timetable.startDate).toLocaleDateString()} to {new Date(timetable.endDate).toLocaleDateString()}
              </div>
            </div>
            
            <div className="timetable-actions">
              <button 
                onClick={viewAll ? fetchDepartmentExams : fetchAllExams}
                className="btn-secondary"
              >
                {viewAll ? 'View My Exams Only' : 'View All Exams'}
              </button>
              
              <button 
                onClick={togglePrintView}
                className="btn-primary"
              >
                Print Timetable
              </button>
            </div>
          </div>
          
          {student && !viewAll && (
            <div className="timetable-subtitle">
              Showing exams for {student.department.name}, Level {student.level}
            </div>
          )}
          
          {viewAll && (
            <div className="timetable-subtitle">
              Showing all exams for all departments and levels
            </div>
          )}
          
          {timetable.examSlots.length === 0 ? (
            <div className="no-data">No exams scheduled for this timetable yet.</div>
          ) : (
            <div className="exam-schedule">
              {groupExamSlotsByDate(timetable.examSlots).map(({ date, slots }) => (
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
                        <tr 
                          key={slot.id}
                          className={
                            student && 
                            slot.course.department.id === student.departmentId && 
                            slot.course.level === student.level 
                              ? 'my-exam' 
                              : ''
                          }
                        >
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
          )}
          
          {/* Hidden print view */}
          {showPrintView && (
            <div className="print-view" ref={printRef}>
              <div className="print-header">
                <h1>{timetable.title}</h1>
                <p>
                  <strong>Exam Period:</strong> {new Date(timetable.startDate).toLocaleDateString()} to {new Date(timetable.endDate).toLocaleDateString()}
                </p>
                
                {student && !viewAll && (
                  <>
                    <p>
                      <strong>Department:</strong> {student.department.name}
                    </p>
                    <p>
                      <strong>Level:</strong> {student.level}
                    </p>
                  </>
                )}
              </div>
              
              <div className="print-content">
                {groupExamSlotsByDate(timetable.examSlots).map(({ date, slots }) => (
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
                          <tr 
                            key={slot.id}
                            className={
                              student && 
                              slot.course.department.id === student.departmentId && 
                              slot.course.level === student.level 
                                ? 'my-exam' 
                                : ''
                            }
                          >
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
        </>
      )}
    </div>
  );
};

export default StudentTimetable;
