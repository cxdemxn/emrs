import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Faculty {
  id: string;
  name: string;
  duration: number;
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
  departmentId: string;
  department: Department;
  createdAt: string;
  updatedAt: string;
}

interface CourseFormData {
  code: string;
  title: string;
  level: number;
  departmentId: string;
}

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<CourseFormData>({
    code: '',
    title: '',
    level: 100,
    departmentId: ''
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentCourseId, setCurrentCourseId] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<number | ''>('');
  
  // API base URL
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch departments
      const departmentsResponse = await axios.get(`${API_URL}/departments`);
      const departmentsData = departmentsResponse.data as { departments: Department[] };
      setDepartments(departmentsData.departments);
      
      // Fetch courses
      const coursesResponse = await axios.get(`${API_URL}/courses`);
      const coursesData = coursesResponse.data as { courses: Course[] };
      setCourses(coursesData.courses);
      
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'level' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      if (isEditing) {
        // Update existing course
        await axios.put(`${API_URL}/courses/${currentCourseId}`, formData);
        setSuccessMessage('Course updated successfully');
      } else {
        // Create new course
        await axios.post(`${API_URL}/courses`, formData);
        setSuccessMessage('Course created successfully');
      }
      
      // Reset form
      setFormData({ code: '', title: '', level: 100, departmentId: '' });
      setIsEditing(false);
      setCurrentCourseId('');
      
      // Refresh courses list
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save course');
    }
  };

  const handleEdit = (course: Course) => {
    setFormData({
      code: course.code,
      title: course.title,
      level: course.level,
      departmentId: course.departmentId
    });
    setIsEditing(true);
    setCurrentCourseId(course.id);
    setSuccessMessage('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/courses/${id}`);
      setSuccessMessage('Course deleted successfully');
      
      // Refresh courses list
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete course');
    }
  };

  const handleCancel = () => {
    setFormData({ code: '', title: '', level: 100, departmentId: '' });
    setIsEditing(false);
    setCurrentCourseId('');
    setError('');
    setSuccessMessage('');
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'filterDepartment') {
      setFilterDepartment(value);
    } else if (name === 'filterLevel') {
      setFilterLevel(value ? parseInt(value) : '');
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filterDepartment && course.departmentId !== filterDepartment) {
      return false;
    }
    if (filterLevel && course.level !== filterLevel) {
      return false;
    }
    return true;
  });

  return (
    <div className="course-management">
      <h1>Course Management</h1>
      
      <div className="course-form-container">
        <h2>{isEditing ? 'Edit Course' : 'Create New Course'}</h2>
        
        {error && <div className="error-message"><i className="fas fa-exclamation-circle"></i>{error}</div>}
        {successMessage && <div className="success-message"><i className="fas fa-check-circle"></i>{successMessage}</div>}
        
        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-group">
            <label htmlFor="code">Course Code</label>
            <div className="input-with-icon">
              <i className="fas fa-code"></i>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="e.g., CS101"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="title">Course Title</label>
            <div className="input-with-icon">
              <i className="fas fa-book"></i>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter course title"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="level">Level</label>
            <div className="input-with-icon">
              <i className="fas fa-layer-group"></i>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                required
              >
                <option value={100}>100 Level</option>
                <option value={200}>200 Level</option>
                <option value={300}>300 Level</option>
                <option value={400}>400 Level</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="departmentId">Department</label>
            <div className="input-with-icon">
              <i className="fas fa-building"></i>
              <select
                id="departmentId"
                name="departmentId"
                value={formData.departmentId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name} ({department.faculty.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              <i className="fas fa-save"></i>
              {isEditing ? 'Update Course' : 'Create Course'}
            </button>
            
            {isEditing && (
              <button type="button" onClick={handleCancel} className="btn-secondary">
                <i className="fas fa-times"></i>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="courses-list">
        <h2>Courses</h2>
        
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="filterDepartment">Filter by Department:</label>
            <select
              id="filterDepartment"
              name="filterDepartment"
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
          
          <div className="filter-group">
            <label htmlFor="filterLevel">Filter by Level:</label>
            <select
              id="filterLevel"
              name="filterLevel"
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
        
        {loading ? (
          <div className="loading">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="no-data">No courses found. Create your first course above.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Level</th>
                <th>Department</th>
                <th>Faculty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td>{course.code}</td>
                  <td>{course.title}</td>
                  <td>{course.level}</td>
                  <td>{course.department.name}</td>
                  <td>{course.department.faculty.name}</td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => handleEdit(course)}
                      className="action-button edit"
                      title="Edit Course"
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(course.id)}
                      className="action-button delete"
                      title="Delete Course"
                    >
                      <i className="fas fa-trash-alt"></i>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
