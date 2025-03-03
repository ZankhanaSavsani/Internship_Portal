import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user from localStorage (if exists)
    return JSON.parse(localStorage.getItem("user")) || null;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
        if (user) {
            setLoading(false);
            return; // Skip API call if user is already set
          }
      try {
        const response = await axios.get('/api/auth/me', { withCredentials: true });
        if (response.data.success) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user)); // Save to localStorage
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error('Auth check failed:', error.response?.data || error.message);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();

    // Auto-refresh token every 15 minutes
    const tokenRefreshInterval = setInterval(async () => {
      const refreshed = await refreshToken();
      if (!refreshed) {
        logout();
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(tokenRefreshInterval);
  }, []); //  No dependencies to avoid unnecessary re-runs

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials, { withCredentials: true });
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Persist user
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return { 
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
    } finally {
      setUser(null);
      localStorage.removeItem("user"); // Clear storage
      navigate('/login');
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('/api/auth/refresh-token', {}, { withCredentials: true });
      if (response.data.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error.response?.data || error.message);
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isGuide: user?.role === 'guide',
    isStudent: user?.role === 'student'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
