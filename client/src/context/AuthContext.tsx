import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string;
  userId: string;
  userName: string;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
}

const defaultContext: AuthContextType = {
  isAuthenticated: false,
  userRole: '',
  userId: '',
  userName: '',
  login: async () => ({ id: '', name: '', email: '', role: '' }),
  register: async () => ({ id: '', name: '', email: '', role: '' }),
  logout: () => {},
  loading: true
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // API base URL
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role || '');
      setUserId(id || '');
      setUserName(name || '');
      
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, { email, password });
      
      // Validate response structure
      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error('Invalid response from server');
      }
      
      const { token, user } = response.data;
      
      // Validate user object
      if (!user.id || !user.role || !user.name) {
        throw new Error('Invalid user data received');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name);
      
      setIsAuthenticated(true);
      setUserRole(user.role);
      setUserId(user.id);
      setUserName(user.name);
      
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide more specific error messages
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          throw new Error('Invalid email or password');
        } else if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please check your connection.');
      }
      
      // For other errors, just rethrow
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/auth/register`, { name, email, password, role: 'ADMIN' });
      
      // Validate response structure
      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error('Invalid response from server');
      }
      
      const { token, user } = response.data;
      
      // Validate user object
      if (!user.id || !user.role || !user.name) {
        throw new Error('Invalid user data received');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name);
      
      setIsAuthenticated(true);
      setUserRole(user.role);
      setUserId(user.id);
      setUserName(user.name);
      
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return user;
    } catch (error: any) {
      console.error('Register error:', error);
      
      // Provide more specific error messages
      if (error.response) {
        if (error.response.status === 400) {
          throw new Error(error.response.data?.message || 'Registration failed. Email may already be in use.');
        } else if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      }
      
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    
    setIsAuthenticated(false);
    setUserRole('');
    setUserId('');
    setUserName('');
    
    // Remove axios default headers
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userRole, 
      userId, 
      userName, 
      login, 
      register, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => React.useContext(AuthContext);
