import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader, CheckCircle, AlertCircle, UserPlus, ArrowLeft } from "lucide-react";
import { useAuth } from "../../layouts/AuthProvider";

const GuideAllocationForm = () => {
  const { isAuthenticated, user } = useAuth();
  const [startRange, setStartRange] = useState("");
  const [endRange, setEndRange] = useState("");
  const [guideId, setGuideId] = useState("");
  const [semester, setSemester] = useState(5);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);
  const [missingStudents, setMissingStudents] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rangeError, setRangeError] = useState("");

  // Fetch all guides for the dropdown
  useEffect(() => {
    const fetchGuides = async () => {
      if (!isAuthenticated) {
        return;
      }
      
      setLoading(true);
      
      try {
        const response = await axios.get(
          "http://localhost:5000/api/guide",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        
        // Handle the response format you provided
        if (response.data && response.data.success === true && Array.isArray(response.data.data)) {
          setGuides(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setSubmitStatus("error");
          setSubmitMessage("Failed to load guides: unexpected response format.");
        }
      } catch (error) {
        console.error("Error fetching guides:", error);
        setSubmitStatus("error");
        setSubmitMessage("Failed to load guides. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [isAuthenticated, user]);

  // Validate range fields
  const validateRange = () => {
    if (!startRange || !endRange) {
      setRangeError("Both start and end range are required");
      return false;
    }

    // Check if the first 4 characters are the same
    if (startRange.substring(0, 4) !== endRange.substring(0, 4)) {
      setRangeError("Year and department must be the same in the range");
      return false;
    }

    // Check if the format is correct (like 22cs078)
    const formatRegex = /^\d{2}[a-z]{2}\d{3}$/i;
    if (!formatRegex.test(startRange) || !formatRegex.test(endRange)) {
      setRangeError("Range format should be like 22cs078");
      return false;
    }

    // Check if startRange is less than endRange
    const startNum = parseInt(startRange.substring(4), 10);
    const endNum = parseInt(endRange.substring(4), 10);
    if (startNum >= endNum) {
      setRangeError("Start range must be less than end range");
      return false;
    }

    setRangeError("");
    return true;
  };

  // Handle changes in range fields
  const handleRangeChange = (field, value) => {
    if (field === "start") {
      setStartRange(value);
    } else {
      setEndRange(value);
    }
    
    // Clear error when typing
    if (rangeError) {
      setRangeError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      console.error("Submit attempt failed: User not authenticated");
      setSubmitStatus("error");
      setSubmitMessage("You must be logged in to submit this form.");
      return;
    }

    // Validate range format
    if (!validateRange()) {
      return;
    }

    // Create the range string in the format expected by the API
    const range = `${startRange}-${endRange}`;

    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage("");
    
    try {
      const response = await axios.post(
        "http://localhost:5000/api/guide-allocation/allocate",
        {
          range,
          guideId,
          semester
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      if (response.data && response.data.success) {
        setSubmitMessage("Guide allocated successfully!");
        setSubmitStatus("success");
        setMissingStudents(response.data.missingStudents || []);
        
        // Reset form
        setStartRange("");
        setEndRange("");
        setGuideId("");
      } else {
        throw new Error(response.data?.message || "Failed to allocate guide");
      }
    } catch (error) {
      setSubmitMessage(error.response?.data?.message || "Failed to allocate guide. Please try again.");
      setSubmitStatus("error");
      console.error("Allocation error:", error);
      setMissingStudents([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-50">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center border border-blue-100">
          <div className="mb-6 text-blue-600 bg-blue-50 p-4 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
            <UserPlus className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            You must be logged in to access the guide allocation system.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 transform hover:scale-105 shadow-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Guide Allocation</h1>

      {/* Status Messages */}
      {submitStatus === "success" && (
        <div className="mb-6 transform animate-bounce-in shadow-md">
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-5">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-green-800">
                  Success!
                </h3>
                <p className="text-sm text-green-700">{submitMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {submitStatus === "error" && (
        <div className="mb-6 transform animate-shake shadow-md">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-5">
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-red-800">Oops!</h3>
                <p className="text-sm text-red-700">{submitMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="mb-8 flex items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 bg-white px-4 py-2 rounded-lg shadow-sm transition duration-200 hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>
        <h2 className="text-lg font-semibold mb-4">Allocate Guide to Students</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="w-full md:w-1/3">
              <label className="block mb-1">Student ID Range</label>
              <div className="flex space-x-2 items-center">
                <input
                  type="text"
                  value={startRange}
                  onChange={(e) => handleRangeChange("start", e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 22cs078"
                  required
                />
                <span className="text-gray-500">to</span>
                <input
                  type="text"
                  value={endRange}
                  onChange={(e) => handleRangeChange("end", e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 22cs082"
                  required
                />
              </div>
              {rangeError && (
                <p className="text-sm text-red-500 mt-1">{rangeError}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">Year and department must be the same in the range.</p>
            </div>
            
            <div className="w-full md:w-1/3">
              <label className="block mb-1">Guide</label>
              <select
                value={guideId}
                onChange={(e) => setGuideId(e.target.value)}
                className="w-full p-2 border rounded"
                required
                disabled={loading}
              >
                <option value="">Select a guide</option>
                {guides.map((guide) => (
                  <option key={guide._id} value={guide._id}>
                    {guide.guideName} ({guide.username})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-1/3">
              <label className="block mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full p-2 border rounded"
              >
                <option value={5}>5th Semester</option>
                <option value={7}>7th Semester</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading || isSubmitting}
          >
            {isSubmitting ? 'Allocating...' : 'Allocate Guide'}
          </button>
        </form>
      </div>
      
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Loader className="h-6 w-6 text-blue-600 animate-spin" />
            </div>
            <p className="text-lg font-medium text-gray-800">Adding Guide...</p>
          </div>
        </div>
      )}
      
      {/* Display missing students if any */}
      {missingStudents.length > 0 && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-lg shadow-sm">
            <h3 className="font-medium">The following students were not found in the database:</h3>
            <ul className="list-disc pl-5 mt-2">
              {missingStudents.map((id) => (
                <li key={id}>{id}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideAllocationForm;