import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create axios instance with credentials
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token is valid
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            // Token expired
            localStorage.removeItem('token');
          } else {
            setCurrentUser(decoded);
            setIsAuthenticated(true);
            // Set authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (email, password) => {
    try {
      setError(null);
      await api.post('/auth/register', { email, password });
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user } = response.data;
      
      // Store token in localStorage (consider more secure alternatives)
      localStorage.setItem('token', accessToken);
      
      // Set user in state
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        api
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
