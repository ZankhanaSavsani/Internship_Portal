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
    axios.defaults.baseURL =
      process.env.REACT_APP_BACKEND_BASEURL ||
      "https://internship-portal-backend-4zb5.onrender.com";
  }, []);

  // Enhanced logout function
  const logout = useCallback(async () => {
    try {
      // Extract domain from backend URL (handles both https:// and ports)
      const backendUrl = new URL(process.env.REACT_APP_BACKEND_BASEURL);
      const domainParts = backendUrl.hostname.split('.');
      const rootDomain = domainParts.slice(-2).join('.'); // Gets 'onrender.com' from 'xyz.onrender.com'
      
      // Cookie clearing utility
      const clearCookie = (name) => {
        // Clear with root domain (for subdomains)
        document.cookie = `${name}=; path=/; domain=.${rootDomain}; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure`;
        // Clear with exact hostname
        document.cookie = `${name}=; path=/; domain=${backendUrl.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure`;
        // Clear without domain (for localhost)
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      };
  
      // Clear all auth cookies
      [
        'accessToken',
        'refreshToken',
        'userId',
        'user',
        'isAuthenticated',
        'studentId',
        'studentName'
      ].forEach(clearCookie);
  
      // API logout call
      await axios.post("/api/auth/logout", {}, { 
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
  
      // Clear client storage
      localStorage.clear();
      sessionStorage.clear();
  
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
  
      // Force reload with cache busting
      window.location.assign(`/login?t=${Date.now()}`);
  
    } catch (err) {
      console.error("Logout error:", {
        message: err.message,
        cookies: document.cookie,
        backendUrl: process.env.REACT_APP_BACKEND_BASEURL
      });
      
      // Fallback hard reset
      window.location.href = `/login?error=logout_failed&t=${Date.now()}`;
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
    let responseInterceptor;

    const checkAuthAndRedirect = async () => {
      try {
        // Check if we're already on the login page
        if (window.location.pathname === '/login') {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASEURL}/api/auth/me`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);

          // Only navigate if we're not already on the correct path
          const currentPath = window.location.pathname;
          const targetPath =
            response.data.user.role === "student" &&
            (!response.data.user.studentName || !response.data.user.isOnboarded)
              ? "/student/onboarding"
              : `/${response.data.user.role}`;

          if (!currentPath.startsWith(targetPath)) {
            navigate(targetPath, { replace: true });
          }
        } else {
          // If not authenticated, clear state and redirect to login
          setUser(null);
          setIsAuthenticated(false);
          setError(null);
          navigate('/login', { replace: true });
        }
      } catch (err) {
        if (err.response?.status === 401) {
          // If unauthorized, clear state and redirect to login
          setUser(null);
          setIsAuthenticated(false);
          setError(null);
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    // Add response interceptor for handling 401 errors
    responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.config && error.response?.status === 401) {
          try {
            const refreshed = await refreshToken();
            if (refreshed) {
              return axios(error.config);
            }
            // If refresh fails, clear state and redirect to login
            setUser(null);
            setIsAuthenticated(false);
            setError(null);
            navigate('/login', { replace: true });
          } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
            setError(null);
            navigate('/login', { replace: true });
          }
        }
        return Promise.reject(error);
      }
    );

    // Only check auth if not on login page
    if (window.location.pathname !== '/login') {
      checkAuthAndRedirect();
    } else {
      setLoading(false);
    }

    const tokenRefreshInterval = setInterval(() => {
      if (window.location.pathname !== '/login') {
        refreshToken().then((success) => {
          if (!success) {
            setUser(null);
            setIsAuthenticated(false);
            setError(null);
            navigate('/login', { replace: true });
          }
        });
      }
    }, 14 * 60 * 1000);

    // Sync logout across tabs
    const syncLogout = (event) => {
      if (event.key === "logout") {
        setUser(null);
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("storage", syncLogout);

    return () => {
      clearInterval(tokenRefreshInterval);
      window.removeEventListener("storage", syncLogout);
      if (responseInterceptor) {
        axios.interceptors.response.eject(responseInterceptor);
      }
    };
  }, [navigate, logout, refreshToken]);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASEURL}/api/auth/login`,
        credentials,
        { withCredentials: true }
      );

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        localStorage.setItem("logout", Date.now().toString());
        // Force a hard refresh to ensure all cookies are properly set
        window.location.href = `/${response.data.user.role}`;
        return { success: true };
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        checkAuthStatus,
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
