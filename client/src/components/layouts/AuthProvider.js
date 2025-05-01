import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
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
      await axios.post(
        `${process.env.REACT_APP_BACKEND_BASEURL}/api/auth/logout`
      );
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
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASEURL}/api/auth/refresh-token`,
        { withCredentials: true }
      );
      return response.data.success;
    } catch (err) {
      if (err.response?.status === 404) {
        console.error("Refresh token endpoint not found");
      }
      return false;
    }
  }, []);

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASEURL}/api/auth/me`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        await logout();
      }
    } catch (err) {
      if (err.response?.status === 401) {
        await logout();
      }
      console.error("Auth check failed:", err);
    }
  }, [logout]);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASEURL}/api/auth/me`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          
          // Only navigate if we're not already on the correct path
          const currentPath = window.location.pathname;
          const targetPath = response.data.user.role === 'student' && 
                            (!response.data.user.studentName || !response.data.user.isOnboarded)
                            ? '/student/onboarding'
                            : `/${response.data.user.role}`;
          
          if (!currentPath.startsWith(targetPath)) {
            navigate(targetPath, { replace: true });
          }
        } else {
          await logout();
        }
      } catch (err) {
        if (err.response?.status === 401) {
          await logout();
        }
      } finally {
        setLoading(false);
      }
    };
  
    checkAuthAndRedirect();
  
    const tokenRefreshInterval = setInterval(() => {
      refreshToken().then((success) => {
        if (!success) logout();
      });
    }, 14 * 60 * 1000); // Refresh every 14 minutes
  
    return () => clearInterval(tokenRefreshInterval);
  }, [navigate, logout, refreshToken]);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASEURL}/api/auth/login`,
        credentials,
        { withCredentials: true }
      );

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        // Remove the navigate calls here - let the useEffect handle redirection
        return { success: true, user: response.data.user };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // Response interceptor for handling 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
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
