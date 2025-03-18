import React, { useState, useEffect } from "react";
import {
  UserPlus,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../layouts/AuthProvider";
import axios from "axios";

const EditGuide = () => {
  const { id } = useParams(); // Get the guide ID from the URL
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    guideName: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch guide data when the component mounts
  useEffect(() => {
    const fetchGuide = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/guide/${id}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        if (response.data.success) {
          setFormData(response.data.data); // Set form data with fetched guide data
        } else {
          setSubmitStatus("error");
          setSubmitMessage(response.data.message || "Error fetching guide data");
        }
      } catch (error) {
        console.error("Error fetching guide:", error);
        setSubmitStatus("error");
        setSubmitMessage("Error fetching guide. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuide();
  }, [id, isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setSubmitStatus("error");
      setSubmitMessage("You must be logged in to update guide data.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage("");
    
    try {
      const response = await axios.put(
        `http://localhost:5000/api/guide/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.data.success) {
        setSubmitStatus("success");
        setSubmitMessage("Guide updated successfully!");
        setFormData(response.data.data || formData);
      } else {
        setSubmitStatus("error");
        setSubmitMessage(response.data.message || "Failed to update guide.");
      }
    } catch (error) {
      console.error("Error updating guide:", error);
      setSubmitStatus("error");
      setSubmitMessage(error.response?.data?.message || "Error updating guide. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="mb-6 text-blue-600">
            <UserPlus className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            You must be logged in to access the guide management system.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md font-medium transition duration-200 transform hover:scale-105"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-8">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <Loader className="h-6 w-6 text-blue-600 animate-spin" />
            <p className="text-lg font-medium text-gray-800">
              Updating guide...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Status Messages */}
        {submitStatus === "success" && (
          <div className="mb-4 transform animate-fade-in-down">
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">
                    Success
                  </h3>
                  <p className="text-sm text-green-700">{submitMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-4 transform animate-fade-in-down">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700">{submitMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mb-8 flex items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 font-medium transition duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-white">Edit Guide</h1>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <Loader className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading guide data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter username"
                  required
                />
              </div>

              {/* Guide Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guide Name
                </label>
                <input
                  type="text"
                  name="guideName"
                  value={formData.guideName || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter email address"
                  required
                />
              </div>

              {/* Password Reset */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reset Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter new password (leave blank to keep current)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave blank to keep current password
                </p>
              </div>

              {/* Status Information */}
              {formData.createdAt && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Created At</p>
                    <p className="text-gray-600">
                      {new Date(formData.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {formData.updatedAt && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Last Updated</p>
                      <p className="text-gray-600">
                        {new Date(formData.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium shadow-md hover:shadow-lg transition duration-200 transform hover:translate-y-[-2px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditGuide;
