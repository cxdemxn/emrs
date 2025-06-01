import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Faculty {
  id: string;
  name: string;
  duration: number;
  departments: Department[];
}

interface Department {
  id: string;
  name: string;
}

interface Timetable {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
}

const Dashboard: React.FC = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const navigate = useNavigate();
  
  // API base URL
  const API_URL = 'http://localhost:5000/api';

  // Define response types for type safety
  interface FacultiesResponse {
    faculties: Faculty[];
    message: string;
  }

  interface DepartmentsResponse {
    departments: Department[];
    message: string;
  }

  interface TimetablesResponse {
    timetables: Timetable[];
    message: string;
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch faculties with proper type annotation
        const facultiesResponse = await axios.get<FacultiesResponse>(`${API_URL}/faculties`);
        setFaculties(facultiesResponse.data.faculties);
        
        // Fetch departments with proper type annotation
        const departmentsResponse = await axios.get<DepartmentsResponse>(`${API_URL}/departments`);
        setDepartments(departmentsResponse.data.departments);
        
        // Fetch timetables with proper type annotation
        const timetablesResponse = await axios.get<TimetablesResponse>(`${API_URL}/timetables`);
        setTimetables(timetablesResponse.data.timetables);
        
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Welcome to the Exam Management and Reporting System</p>
        
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon">F</div>
            <h3 className="stat-card-title">Faculties</h3>
          </div>
          <div className="stat-value">{faculties.length}</div>
          <p>Total faculties in the system</p>
          <div className="stat-card-footer">
            <button 
              onClick={() => handleNavigate('/admin/faculties')}
              className="btn btn-outline"
            >
              Manage Faculties
            </button>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon">D</div>
            <h3 className="stat-card-title">Departments</h3>
          </div>
          <div className="stat-value">{departments.length}</div>
          <p>Total departments across all faculties</p>
          <div className="stat-card-footer">
            <button 
              onClick={() => handleNavigate('/admin/departments')}
              className="btn btn-outline"
            >
              Manage Departments
            </button>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon">T</div>
            <h3 className="stat-card-title">Timetables</h3>
          </div>
          <div className="stat-value">{timetables.length}</div>
          <p>Total exam timetables created</p>
          <div className="stat-card-footer">
            <button 
              onClick={() => handleNavigate('/admin/timetables/view')}
              className="btn btn-outline"
            >
              View Timetables
            </button>
          </div>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <h2 className="dashboard-section-title">Quick Actions</h2>
        <div className="action-buttons">
          <div className="action-card" onClick={() => handleNavigate('/admin/faculties')}>
            <div className="action-icon">F</div>
            <h3 className="action-title">Create Faculty</h3>
            <p className="action-description">Add a new faculty to the system</p>
          </div>
          
          <div className="action-card" onClick={() => handleNavigate('/admin/departments')}>
            <div className="action-icon">D</div>
            <h3 className="action-title">Create Department</h3>
            <p className="action-description">Add a new department to a faculty</p>
          </div>
          
          <div className="action-card" onClick={() => handleNavigate('/admin/courses')}>
            <div className="action-icon">C</div>
            <h3 className="action-title">Add Courses</h3>
            <p className="action-description">Add new courses to departments</p>
          </div>
          
          <div className="action-card" onClick={() => handleNavigate('/admin/timetables/create')}>
            <div className="action-icon">T</div>
            <h3 className="action-title">Create Timetable</h3>
            <p className="action-description">Create a new exam timetable</p>
          </div>
        </div>
      </div>
      
      {timetables.length > 0 && (
        <div className="recent-timetables">
          <h2 className="dashboard-section-title">Recent Timetables</h2>
          <div className="table-container">
            <table className="table data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {timetables.slice(0, 5).map((timetable) => (
                  <tr key={timetable.id}>
                    <td>{timetable.title}</td>
                    <td>{new Date(timetable.startDate).toLocaleDateString()}</td>
                    <td>{new Date(timetable.endDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status ${timetable.isPublished ? 'published' : 'draft'}`}>
                        {timetable.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleNavigate(`/admin/timetables/view/${timetable.id}`)}
                        className="btn btn-sm btn-secondary"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {timetables.length > 5 && (
            <div className="text-center mt-3">
              <button 
                onClick={() => handleNavigate('/admin/timetables/view')}
                className="btn btn-outline"
              >
                View All Timetables
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
