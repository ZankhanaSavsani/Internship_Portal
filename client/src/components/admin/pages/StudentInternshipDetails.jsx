import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle, Loader, Briefcase } from "lucide-react";
import { useAuth } from "../../layouts/AuthProvider";

const StudentInternshipDetails = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Search states
  const [studentId, setStudentId] = useState('');
  const [semester, setSemester] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Data states
  const [internshipData, setInternshipData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [guides, setGuides] = useState([]);
  const [selectedGuideId, setSelectedGuideId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch guides on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchGuides();
    }
  }, [isAuthenticated]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchPerformed(true);
    
    if (!studentId || !semester) {
      setError('Please provide both Student ID and Semester');
      setInternshipData(null);
      return;
    }
    
    fetchInternshipData();
  };

  const fetchInternshipData = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.get(`/api/student-internships/student/${studentId}?semester=${semester}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      });
      
      if (response.data && response.data.success === true && response.data.data) {
        setInternshipData(response.data.data);
        if (response.data.data.guide) {
          setSelectedGuideId(response.data.data.guide._id);
        }
      } else {
        throw new Error('Invalid data format returned from API');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('No internship record found for this student and semester');
      } else {
        setError('Failed to fetch internship data: ' + (err.response?.data?.message || err.message));
      }
      console.error(err);
      setInternshipData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuides = async () => {
    try {
      const response = await axios.get('/api/guides', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      });
      
      if (response.data && response.data.success === true && response.data.data) {
        setGuides(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch guides:', err);
    }
  };

  const handleChangeGuide = async () => {
    if (!selectedGuideId) {
      setError('Please select a guide');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(
        `/api/student-internships/${internshipData._id}/update-guide`, 
        { guideId: selectedGuideId },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.token}`,
          }
        }
      );
      
      if (response.data && response.data.success === true) {
        setSuccess('Guide updated successfully!');
        // Update the internship data with the new guide
        setInternshipData(response.data.data);
      } else {
        throw new Error('Invalid data format returned from API');
      }
    } catch (err) {
      setError('Failed to update guide: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="mb-6 text-blue-600">
            <Briefcase className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            You must be logged in to access the internship details.
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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Student Internship Details</h1>
      
      {/* Search Form */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Find Student Internship</h2>
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="w-full md:w-1/3">
            <label className="block mb-1">Student ID</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter student ID"
            />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block mb-1">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Semester</option>
              <option value="5">5</option>
              <option value="7">7</option>
            </select>
          </div>
          <div className="w-full md:w-1/3 flex items-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Message */}
      {success && (
        <div className="mb-4">
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center p-6">
          <Loader className="h-6 w-6 text-blue-600 animate-spin" />
          <span className="ml-2">Loading internship data...</span>
        </div>
      )}
      
      {/* Internship Details */}
      {!loading && searchPerformed && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-bold mb-4">Internship Details</h2>
          
          {internshipData ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600">Semester</p>
                  <p className="font-medium">{internshipData.semester}</p>
                </div>
                <div>
                  <p className="text-gray-600">Current Guide</p>
                  <p className="font-medium">
                    {internshipData.guide ? `${internshipData.guide.name} (${internshipData.guide.email})` : 'No guide assigned'}
                  </p>
                </div>
                
                <div className="col-span-2">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Update Guide</h3>
                    <div className="flex flex-col md:flex-row md:items-end gap-4">
                      <div className="flex-grow">
                        <label className="block mb-1">Select New Guide</label>
                        <select
                          value={selectedGuideId}
                          onChange={(e) => setSelectedGuideId(e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select a Guide</option>
                          {guides.map(guide => (
                            <option key={guide._id} value={guide._id}>
                              {guide.name} ({guide.email})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <button
                          onClick={handleChangeGuide}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                          {isSubmitting ? 'Updating...' : 'Update Guide'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Weekly Reports</h3>
                {internshipData.weeklyReports && internshipData.weeklyReports.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {internshipData.weeklyReports.map((report, index) => (
                      <li key={report._id || index} className="mb-1">
                        Report {index + 1}: {report._id}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No weekly reports submitted yet.</p>
                )}
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Company Approval Details</h3>
                {internshipData.companyApprovalDetails && internshipData.companyApprovalDetails.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {internshipData.companyApprovalDetails.map((detail, index) => (
                      <li key={detail._id || index} className="mb-1">
                        Approval {index + 1}: {detail._id}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No company approvals submitted yet.</p>
                )}
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Summer Internship Status</h3>
                {internshipData.summerInternshipStatus && internshipData.summerInternshipStatus.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {internshipData.summerInternshipStatus.map((status, index) => (
                      <li key={status._id || index} className="mb-1">
                        Status {index + 1}: {status._id}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No summer internship status submitted yet.</p>
                )}
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Summer Internship Completion</h3>
                {internshipData.summerInternshipCompletionStatus && internshipData.summerInternshipCompletionStatus.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {internshipData.summerInternshipCompletionStatus.map((status, index) => (
                      <li key={status._id || index} className="mb-1">
                        Completion {index + 1}: {status._id}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No completion status submitted yet.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              {!error && searchPerformed && <p>No internship data available for this student and semester.</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentInternshipDetails;