import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Login and get the user data directly from the API
      const user = await login(email, password);
      console.log(user)
      // Redirect based on the role returned from login
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-center mb-4">Login to Your Account</h2>
      
      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            <i className="fas fa-envelope form-label-icon"></i>
            Email Address
          </label>
          <i className="fas fa-envelope form-icon"></i>
          <input
            type="email"
            id="email"
            className="form-control form-control-with-icon"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            <i className="fas fa-lock form-label-icon"></i>
            Password
          </label>
          <i className="fas fa-lock form-icon"></i>
          <input
            type="password"
            id="password"
            className="form-control form-control-with-icon"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button type="submit" disabled={loading} className="btn btn-primary btn-block mb-3 btn-icon">
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <i className="fas fa-sign-in-alt"></i>
              <span>Login</span>
            </>
          )}
        </button>
      </form>
      
      <div className="text-center mt-3">
        <p className="mb-2">
          Don't have an admin account? <Link to="/register">Register</Link>
        </p>
        <p>
          Student? Use the registration link provided by your department.
        </p>
      </div>
    </div>
  );
};

export default Login;
