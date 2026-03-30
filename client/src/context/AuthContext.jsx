// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      // ✅ Updated to match backend response
      const response = await api.get('/auth/profile');
      
      if (response.data.success && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      console.log('Attempting login...', email);
      
      const response = await api.post('/auth/login', { email, password });
      
      console.log('Login response:', response.data);
      
      // ✅ Check for success field from backend
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.data.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let message = 'Login failed. Please try again.';
      
      if (error.response) {
        // ✅ Backend responded with error
        message = error.response.data?.message || `Error: ${error.response.status}`;
      } else if (error.request) {
        // ✅ No response - server down
        message = 'Cannot connect to server. Please check if backend is running on port 5000.';
      } else {
        message = error.message;
      }
      
      return { success: false, message };
    }
  };

  // ✅ UPDATED REGISTER FUNCTION
  const register = async (userData) => {
    try {
      console.log('Attempting registration...', userData.email);
      
      const response = await api.post('/auth/register', userData);
      
      console.log('Register response:', response.data);
      
      // ✅ Check for success field from backend
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.data.message || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      
      let message = 'Registration failed. Please try again.';
      
      if (error.response) {
        message = error.response.data?.message || `Error: ${error.response.status}`;
      } else if (error.request) {
        message = 'Cannot connect to server. Please check if backend is running on port 5000.';
      } else {
        message = error.message;
      }
      
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};