import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create Auth Context
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (user) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/api/auth/me", { withCredentials: true });
        if (response.data.success) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          logout();
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();

    // Auto-refresh token every 15 minutes
    const tokenRefreshInterval = setInterval(async () => {
      const refreshed = await refreshToken();
      if (!refreshed) logout();
    }, 15 * 60 * 1000);

    return () => clearInterval(tokenRefreshInterval);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/login", credentials, { withCredentials: true });
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setError(null);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await axios.post("/api/auth/refresh-token", {}, { withCredentials: true });
      return response.data.success;
    } catch (err) {
      console.error("Token refresh failed:", err);
      return false;
    }
  };

  // Setup Axios Interceptor for Automatic Token Refresh on 401 Errors
  useEffect(() => {
    const setupInterceptors = () => {
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
            const refreshed = await refreshToken();
            if (refreshed) return axios(originalRequest);
            logout();
          }
          return Promise.reject(error);
        }
      );

      return () => axios.interceptors.response.eject(interceptor);
    };

    setupInterceptors();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        refreshToken,
        isAuthenticated: !!user,
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
