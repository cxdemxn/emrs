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
  facultyId: string;
  faculty: Faculty;
  registrationCode: string;
  createdAt: string;
  updatedAt: string;
}

interface DepartmentFormData {
  name: string;
  facultyId: string;
}

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: '',
    facultyId: ''
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentDepartmentId, setCurrentDepartmentId] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  
  // API base URL
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch faculties
      const facultiesResponse = await axios.get(`${API_URL}/faculties`);
      const facultiesData = facultiesResponse.data as { faculties: Faculty[] };
      setFaculties(facultiesData.faculties);
      
      // Fetch departments
      const departmentsResponse = await axios.get(`${API_URL}/departments`);
      const departmentsData = departmentsResponse.data as { departments: Department[] };
      setDepartments(departmentsData.departments);
      
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
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      if (isEditing) {
        // Update existing department
        await axios.put(`${API_URL}/departments/${currentDepartmentId}`, formData);
        setSuccessMessage('Department updated successfully');
      } else {
        // Create new department
        await axios.post(`${API_URL}/departments`, formData);
        setSuccessMessage('Department created successfully');
      }
      
      // Reset form
      setFormData({ name: '', facultyId: '' });
      setIsEditing(false);
      setCurrentDepartmentId('');
      
      // Refresh departments list
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save department');
    }
  };

  const handleEdit = (department: Department) => {
    setFormData({
      name: department.name,
      facultyId: department.facultyId
    });
    setIsEditing(true);
    setCurrentDepartmentId(department.id);
    setSuccessMessage('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this department? This will also delete all associated courses.')) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/departments/${id}`);
      setSuccessMessage('Department deleted successfully');
      
      // Refresh departments list
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete department');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', facultyId: '' });
    setIsEditing(false);
    setCurrentDepartmentId('');
    setError('');
    setSuccessMessage('');
  };

  const handleShowQRCode = async (department: Department) => {
    setSelectedDepartment(department);
    setShowQRCode(true);
  };

  const getRegistrationLink = (department: Department) => {
    return `${window.location.origin}/student-register/${department.id}/${department.registrationCode}`;
  };

  const copyRegistrationLink = (department: Department) => {
    const link = getRegistrationLink(department);
    navigator.clipboard.writeText(link);
    alert('Registration link copied to clipboard!');
  };

  return (
    <div className="department-management">
      <h1>Department Management</h1>
      
      <div className="department-form-container">
        <h2>{isEditing ? 'Edit Department' : 'Create New Department'}</h2>
        
        {error && <div className="error-message"><i className="fas fa-exclamation-circle"></i>{error}</div>}
        {successMessage && <div className="success-message"><i className="fas fa-check-circle"></i>{successMessage}</div>}
        
        <form onSubmit={handleSubmit} className="department-form">
          <div className="form-group">
            <label htmlFor="name">Department Name</label>
            <div className="input-with-icon">
              <i className="fas fa-building"></i>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter department name"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="facultyId">Faculty</label>
            <div className="input-with-icon">
              <i className="fas fa-university"></i>
              <select
                id="facultyId"
                name="facultyId"
                value={formData.facultyId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Faculty</option>
                {faculties.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              <i className="fas fa-save"></i>
              {isEditing ? 'Update Department' : 'Create Department'}
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
      
      <div className="departments-list">
        <h2>Departments</h2>
        
        {loading ? (
          <div className="loading">Loading departments...</div>
        ) : departments.length === 0 ? (
          <div className="no-data">No departments found. Create your first department above.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Faculty</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.id}>
                  <td>{department.name}</td>
                  <td>{department.faculty.name}</td>
                  <td>{new Date(department.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => handleEdit(department)}
                      className="action-button edit"
                      title="Edit Department"
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(department.id)}
                      className="action-button delete"
                      title="Delete Department"
                    >
                      <i className="fas fa-trash-alt"></i>
                      Delete
                    </button>
                    <button 
                      onClick={() => handleShowQRCode(department)}
                      className="action-button link"
                      title="View Registration Link"
                    >
                      <i className="fas fa-qrcode"></i>
                      Registration Link
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {showQRCode && selectedDepartment && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Registration Link for {selectedDepartment.name}</h2>
              <button className="modal-close" onClick={() => setShowQRCode(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="qr-code-container">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getRegistrationLink(selectedDepartment))}`} 
                  alt="Registration QR Code" 
                />
              </div>
              
              <div className="registration-link">
                <p><i className="fas fa-link"></i> Registration Link:</p>
                <div className="input-with-icon link-container">
                  <input 
                    type="text" 
                    value={getRegistrationLink(selectedDepartment)} 
                    readOnly 
                  />
                  <button 
                    onClick={() => copyRegistrationLink(selectedDepartment)}
                    className="btn-primary"
                  >
                    <i className="fas fa-copy"></i> Copy
                  </button>
                </div>
              </div>
            </div>
            
            <p className="instructions">
              Share this link or QR code with students to register for this department.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
