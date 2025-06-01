import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface Department {
  id: string;
  name: string;
  faculty: {
    id: string;
    name: string;
  };
}

interface Student {
  id: string;
  name: string;
  email: string;
  level: number;
  department: Department;
}

const StudentDashboard: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const { userId } = useAuth();
  const navigate = useNavigate();
  
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
      
      // Fetch notifications
      const notificationsResponse = await axios.get(`${API_URL}/students/${userId}/notifications`);
      setNotifications((notificationsResponse.data as any).notifications);
      
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await axios.put(`${API_URL}/students/notifications/${notificationId}/read`);
      
      // Update notifications list
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark notification as read');
    }
  };

  const handleViewTimetable = () => {
    navigate('/student/timetable');
  };

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {student && (
        <div className="student-profile">
          <h2>Welcome, {student.name}</h2>
          
          <div className="profile-details">
            <div className="detail-item">
              <span className="label">Department:</span>
              <span className="value">{student.department.name}</span>
            </div>
            
            <div className="detail-item">
              <span className="label">Faculty:</span>
              <span className="value">{student.department.faculty.name}</span>
            </div>
            
            <div className="detail-item">
              <span className="label">Level:</span>
              <span className="value">{student.level}</span>
            </div>
            
            <div className="detail-item">
              <span className="label">Email:</span>
              <span className="value">{student.email}</span>
            </div>
          </div>
          
          <button 
            onClick={handleViewTimetable}
            className="btn-primary view-timetable-btn"
          >
            View Exam Timetable
          </button>
        </div>
      )}
      
      <div className="notifications-panel">
        <h2>Notifications</h2>
        
        {notifications.length === 0 ? (
          <div className="no-data">No notifications available.</div>
        ) : (
          <div className="notifications-list">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
              >
                <div className="notification-content">
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-date">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
                
                {!notification.isRead && (
                  <button 
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="mark-read-btn"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
