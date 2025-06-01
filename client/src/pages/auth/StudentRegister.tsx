import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

interface Department {
  id: string;
  name: string;
  faculty: {
    id: string;
    name: string;
    duration: number;
  };
}

const StudentRegister: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [level, setLevel] = useState<number>(100);
  const [department, setDepartment] = useState<Department | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingCode, setValidatingCode] = useState(true);
  
  const navigate = useNavigate();
  const { departmentId, registrationCode } = useParams<{ departmentId: string; registrationCode: string }>();
  
  // API base URL
  const API_URL = 'http://localhost:5000/api';
  
  useEffect(() => {
    // Validate registration code and fetch department details
    const validateCode = async () => {
      try {
        if (!departmentId || !registrationCode) {
          setError('Invalid registration link');
          setValidatingCode(false);
          return;
        }
        
        const response = await axios.get(`${API_URL}/departments/${departmentId}`);
        const departmentData = response.data.department;
        
        if (departmentData.registrationCode !== registrationCode) {
          setError('Invalid registration code');
          setValidatingCode(false);
          return;
        }
        
        setDepartment(departmentData);
        setValidatingCode(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to validate registration code');
        setValidatingCode(false);
      }
    };
    
    validateCode();
  }, [departmentId, registrationCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate level against faculty duration
    if (department && level > department.faculty.duration * 100) {
      setError(`Level cannot exceed ${department.faculty.duration * 100} for this faculty`);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/students/register`, {
        name,
        email,
        password,
        level,
        departmentId,
        registrationCode
      });
      
      const { token } = response.data;
      
      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', 'STUDENT');
      localStorage.setItem('userId', response.data.student.id);
      localStorage.setItem('userName', response.data.student.name);
      
      navigate('/student');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (validatingCode) {
    return <div className="loading">Validating registration code...</div>;
  }

  if (error && !department) {
    return (
      <div className="error-container">
        <h2>Registration Error</h2>
        <div className="error-message">{error}</div>
        <Link to="/login" className="btn-link">Back to Login</Link>
      </div>
    );
  }

  return (
    <div className="student-register-container">
      <h2>Student Registration</h2>
      
      {department && (
        <div className="department-info">
          <p>Registering for: <strong>{department.name}</strong></p>
          <p>Faculty: <strong>{department.faculty.name}</strong></p>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="level">Level</label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(parseInt(e.target.value))}
            required
          >
            <option value={100}>100 Level</option>
            <option value={200}>200 Level</option>
            <option value={300}>300 Level</option>
            {department && department.faculty.duration === 4 && (
              <option value={400}>400 Level</option>
            )}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <div className="auth-links">
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentRegister;
