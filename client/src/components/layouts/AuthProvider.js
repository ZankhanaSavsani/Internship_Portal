import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const userCookie = Cookies.get('user');
      return userCookie ? JSON.parse(userCookie) : null;
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      return null;
    }
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const authCookie = Cookies.get('isAuthenticated');
      return authCookie === 'true';
    } catch (error) {
      console.error("Error parsing isAuthenticated cookie:", error);
      return false;
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = process.env.REACT_APP_BACKEND_BASEURL;
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      
      // Clear all cookies on client side
      document.cookie.split(";").forEach(cookie => {
        const [name] = cookie.split("=");
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      });

      // Clear JS cookies
      Cookies.remove('user');
      Cookies.remove('isAuthenticated');
      
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      
      // Force a hard redirect to login
      window.location.href = '/login';
    } catch (err) {
      console.error("Logout error:", err);
      window.location.href = '/login';
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/me", { withCredentials: true });
      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        Cookies.set('user', JSON.stringify(userData), { expires: 7 });
        Cookies.set('isAuthenticated', 'true', { expires: 7 });
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }, []);

  // Initial auth check and route protection
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const isAuth = await checkAuthStatus();
        const currentPath = window.location.pathname;
        
        if (!isAuth) {
          if (currentPath !== '/login') {
            navigate('/login', { replace: true });
          }
        } else {
          // User is authenticated, redirect based on role
          const targetPath = user?.role === "student" && !user?.isOnboarded 
            ? "/student/onboarding" 
            : `/${user?.role}`;
            
          if (currentPath === '/login' || currentPath === '/') {
            navigate(targetPath, { replace: true });
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [checkAuthStatus, navigate, user]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "/api/auth/login",
        credentials,
        { withCredentials: true }
      );

      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        Cookies.set('user', JSON.stringify(userData), { expires: 7 });
        Cookies.set('isAuthenticated', 'true', { expires: 7 });
        
        // Determine redirect path
        const redirectPath = userData.role === "student" && !userData.isOnboarded
          ? "/student/onboarding"
          : `/${userData.role}`;
          
        // Use navigate instead of window.location for smoother transition
        navigate(redirectPath, { replace: true });
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Setup Axios Interceptor for Automatic Token Refresh on 401 Errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("/api/auth/login") &&
          !originalRequest.url.includes("/api/auth/refresh-token")
        ) {
          originalRequest._retry = true;
          const isAuth = await checkAuthStatus();
          if (!isAuth) {
            logout();
          }
          return axios(originalRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [checkAuthStatus, logout]);

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