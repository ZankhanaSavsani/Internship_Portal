import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

// Create Auth Context
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Configure axios to always include credentials
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_BASEURL}/api/auth/logout`);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    }
  }, [navigate]);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/auth/refresh-token`);
      return response.data.success;
    } catch (err) {
      console.error("Token refresh failed:", err);
      return false;
    }
  }, []);

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/auth/me`);
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        console.error("Auth check failed:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    checkAuthStatus();

    const tokenRefreshInterval = setInterval(() => {
      refreshToken().then(success => {
        if (!success) logout();
      });
    }, 14 * 60 * 1000); // Refresh every 14 minutes

    return () => clearInterval(tokenRefreshInterval);
  }, [checkAuthStatus, logout, refreshToken]);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASEURL}/api/auth/login`,
        credentials
      );
      
      if (response.data.success) {
        await checkAuthStatus(); // Verify auth status after login
        return { success: true, data: response.data };
      }
      throw new Error(response.data.message || "Login failed");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Response interceptor for handling 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.config && error.response?.status === 401) {
          try {
            const refreshed = await refreshToken();
            if (refreshed) {
              return axios(error.config);
            }
            logout();
          } catch (err) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [logout, refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        isAdmin: user?.role === "admin",
        isGuide: user?.role === "guide",
        isStudent: user?.role === "student",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;