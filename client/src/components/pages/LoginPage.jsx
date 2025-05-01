import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../layouts/AuthProvider";
import {
  Eye,
  EyeOff,
  GraduationCap,
  UserCog,
  Users,
  Loader2,
  CheckCircle,
} from "lucide-react";

const InternshipLoginForm = () => {
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTab, setSelectedTab] = useState("student");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    semester: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      if (user.role === "student" && (!user.studentName || !user.isOnboarded)) {
        navigate("/student", { replace: true });
      } else {
        const redirectPath = location.state?.from || `/${user.role}`;
        navigate(redirectPath, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location.state?.from]);

  const getUserMessage = () => {
    switch (selectedTab) {
      case "student":
        return "Access internship opportunities and track your internship";
      case "guide":
        return "Monitor and guide students through their internship journey";
      case "admin":
        return "Manage portal operations and oversee all activities";
      default:
        return "";
    }
  };

  const getUsernamePlaceholder = () => {
    switch (selectedTab) {
      case "student":
        return "Student ID";
      case "guide":
        return "Username";
      case "admin":
        return "Username";
      default:
        return "Username";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage("");

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    if (selectedTab === "student" && !formData.semester) {
      setError("Semester is required for students.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      role: selectedTab,
      password: formData.password,
    };

    if (selectedTab === "student") {
      payload.studentId = formData.username;
      payload.semester = formData.semester;
    } else {
      payload.username = formData.username;
    }

    try {
      const result = await login(payload);
      
      if (result.success) {
        setSubmitStatus("success");
        setSubmitMessage("Login successful!");
        setFormData({
          username: "",
          password: "",
          semester: "",
        });
      } else {
        setError(result.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  if (authLoading || isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 transform transition-all hover:scale-[1.01]">
        {submitStatus === "success" && (
          <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-sm text-green-700">{submitMessage}</p>
            </div>
          </div>
        )}

        <div className="flex justify-center mb-4">
          <div className="h-16 w-40 flex items-center justify-center">
            <img
              src="/images/logo.png"
              alt="Institution Logo"
              className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-gray-600">
            Welcome to your internship management system
          </p>
        </div>

        <div className="bg-gray-100 rounded-xl">
          <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setSelectedTab("student")}
              className={`flex-1 px-4 py-3 flex items-center justify-center space-x-2 transition-all duration-300 ${
                selectedTab === "student"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              } ${
                selectedTab === "student"
                  ? "border-r border-blue-500"
                  : "border-r border-gray-200"
              }`}
            >
              <GraduationCap className="h-5 w-5" />
              <span className="font-medium">Student</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("guide")}
              className={`flex-1 px-4 py-3 flex items-center justify-center space-x-2 transition-all duration-300 ${
                selectedTab === "guide"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              } ${
                selectedTab === "guide"
                  ? "border-r border-blue-500"
                  : "border-r border-gray-200"
              }`}
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Guide</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("admin")}
              className={`flex-1 px-4 py-3 flex items-center justify-center space-x-2 transition-all duration-300 ${
                selectedTab === "admin"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <UserCog className="h-5 w-5" />
              <span className="font-medium">Admin</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {selectedTab === "student" ? "Student ID" : "Username"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              name="username"
              required
              placeholder={getUsernamePlaceholder()}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200
                       focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 
                       transition-all duration-200"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {selectedTab === "student" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Semester <span className="text-red-500">*</span>
              </label>
              <select
                name="semester"
                required
                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200
                         focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 
                         transition-all duration-200"
                value={formData.semester}
                onChange={handleChange}
              >
                <option value="">Select Semester</option>
                <option value="5">Semester 5</option>
                <option value="7">Semester 7</option>
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200
                         focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 
                         transition-all duration-200 pr-11"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                   hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between pt-1">
              <a
                href="/PasswordResetPage"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Reset password
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                     font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
                     transform transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2
                     disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in to Portal</span>
            )}
          </button>
        </form>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-100 border border-red-300 rounded-lg p-2">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="text-xs text-center text-gray-500">
            {getUserMessage()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipLoginForm;