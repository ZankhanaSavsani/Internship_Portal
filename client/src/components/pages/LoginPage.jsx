import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../layouts/AuthProvider";
import {
  Eye,
  EyeOff,
  Briefcase,
  GraduationCap,
  UserCog,
  Users,
} from "lucide-react";

const InternshipLoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTab, setSelectedTab] = useState("student");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

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
        return "studentId";
      case "guide":
        return "username";
      case "admin":
        return "username";
      default:
        return "username";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("All fields are required.");
      return;
    }

    // Prepare the payload based on the selected tab
    const payload = {
      role: selectedTab,
      password: formData.password,
    };

    // Add username or studentId based on the selected role
    if (selectedTab === "student") {
      payload.studentId = formData.username;
    } else {
      payload.username = formData.username;
    }

    try {
      const result = await login(payload);

      if (result.success) {
        // The navigation will be handled by the protected routes
        // But you can force a redirect if needed:
        navigate(`/${result.data.user.role}`);
        console.log("Login successful");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      alert(error.message || "Login failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 transform transition-all hover:scale-[1.01]">
        {/* Logo/Brand Area */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Internship Portal
          </h1>
          <p className="text-gray-600">
            Welcome to your internship management system
            <span className="text-blue-600 block mt-1">
              Connect. Learn. Grow.
            </span>
          </p>
        </div>

        {/* User Type Selector */}
        <div className="bg-gray-50 rounded-xl p-1.5">
          <div className="flex rounded-lg bg-white shadow-sm p-1">
            <button
              type="button"
              onClick={() => setSelectedTab("student")}
              className={`flex-1 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                selectedTab === "student"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("guide")}
              className={`flex-1 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                selectedTab === "guide"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Users className="h-4 w-4" />
              Guide
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("admin")}
              className={`flex-1 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                selectedTab === "admin"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <UserCog className="h-4 w-4" />
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
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
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                     font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
                     transform transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>Sign in to Portal</span>
          </button>
        </form>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-100 border border-red-300 rounded-lg p-2">
            {error}
          </div>
        )}

        {/* Footer */}
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
