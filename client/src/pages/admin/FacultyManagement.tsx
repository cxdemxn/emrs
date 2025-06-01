import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Faculty {
  id: string;
  name: string;
  duration: number;
  departments: Department[];
  createdAt: string;
  updatedAt: string;
}

interface Department {
  id: string;
  name: string;
}

interface FacultyFormData {
  name: string;
  duration: number;
}

const FacultyManagement: React.FC = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<FacultyFormData>({
    name: '',
    duration: 3
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentFacultyId, setCurrentFacultyId] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // API base URL
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/faculties`);
      const data = response.data as { faculties: Faculty[] };
      setFaculties(data.faculties);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch faculties');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'duration' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      if (isEditing) {
        // Update existing faculty
        await axios.put(`${API_URL}/faculties/${currentFacultyId}`, formData);
        setSuccessMessage('Faculty updated successfully');
      } else {
        // Create new faculty
        await axios.post(`${API_URL}/faculties`, formData);
        setSuccessMessage('Faculty created successfully');
      }
      
      // Reset form
      setFormData({ name: '', duration: 3 });
      setIsEditing(false);
      setCurrentFacultyId('');
      
      // Refresh faculties list
      fetchFaculties();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save faculty');
    }
  };

  const handleEdit = (faculty: Faculty) => {
    setFormData({
      name: faculty.name,
      duration: faculty.duration
    });
    setIsEditing(true);
    setCurrentFacultyId(faculty.id);
    setSuccessMessage('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this faculty? This will also delete all associated departments and courses.')) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/faculties/${id}`);
      setSuccessMessage('Faculty deleted successfully');
      
      // Refresh faculties list
      fetchFaculties();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete faculty');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', duration: 3 });
    setIsEditing(false);
    setCurrentFacultyId('');
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="faculty-management">
      <h1>Faculty Management</h1>
      
      <div className="faculty-form-container">
        <h2>{isEditing ? 'Edit Faculty' : 'Create New Faculty'}</h2>
        
        {error && <div className="error-message"><i className="fas fa-exclamation-circle"></i>{error}</div>}
        {successMessage && <div className="success-message"><i className="fas fa-check-circle"></i>{successMessage}</div>}
        
        <form onSubmit={handleSubmit} className="faculty-form">
          <div className="form-group">
            <label htmlFor="name">Faculty Name</label>
            <div className="input-with-icon">
              <i className="fas fa-university"></i>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter faculty name"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="duration">Duration (Years)</label>
            <div className="input-with-icon">
              <i className="fas fa-calendar-alt"></i>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
              >
                <option value={3}>3 Years</option>
                <option value={4}>4 Years</option>
              </select>
            </div>
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              <i className="fas fa-save"></i>
              {isEditing ? 'Update Faculty' : 'Create Faculty'}
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
      
      <div className="faculties-list">
        <h2>Faculties</h2>
        
        {loading ? (
          <div className="loading">Loading faculties...</div>
        ) : faculties.length === 0 ? (
          <div className="no-data">No faculties found. Create your first faculty above.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Duration</th>
                <th>Departments</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty) => (
                <tr key={faculty.id}>
                  <td>{faculty.name}</td>
                  <td>{faculty.duration} Years</td>
                  <td>{faculty.departments.length}</td>
                  <td>{new Date(faculty.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => handleEdit(faculty)}
                      className="action-button edit"
                      title="Edit Faculty"
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(faculty.id)}
                      className="action-button delete"
                      title="Delete Faculty"
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

export default FacultyManagement;
