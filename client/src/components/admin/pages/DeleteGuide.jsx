import React, { useState } from 'react';
import axios from 'axios';
import {
  UserX,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "../../layouts/AuthProvider"; // Adjust the import path if needed

const DeleteGuidePage = () => {
  const { isAuthenticated, user } = useAuth();
  // State for search parameters
  const [username, setUsername] = useState('');
  const [guideName, setGuideName] = useState('');
  
  // State for guide data
  const [guide, setGuide] = useState(null);
  
  // Consolidated state for status messages
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: null, message: '' });
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper functions to set status messages
  const setError = (message) => {
    setStatusMessage({ type: 'error', message });
  };

  const setSuccess = (message) => {
    setStatusMessage({ type: 'success', message });
  };

  const clearStatus = () => {
    setStatusMessage({ type: null, message: '' });
  };

  // Function to search for a guide
  const handleSearch = async (e) => {
    e.preventDefault();
    clearStatus();
    setGuide(null);
    setIsConfirmingDelete(false);
    
    if (!username && !guideName) {
      setError('Please provide either Username or Guide Name');
      return;
    }
    
    if (!isAuthenticated) {
      setError("You must be logged in to search for guides.");
      return;
    }

    setLoading(true);
    
    try {
      // Using GET method to fetch guide data
      const response = await axios.get('/api/guide/search', {
        params: { username, guideName },
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      });
      
      if (response.data && response.data.success === true && response.data.data) {
        setGuide(response.data.data);
      } else if (response.data && response.data.data) {
        setGuide(response.data.data);
      } else {
        throw new Error('Invalid data format returned from API');
      }
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 404) {
        setError('Guide not found with the provided search criteria');
      } else if (err.response && err.response.status === 403) {
        setError('You do not have permission to access this resource');
      } else if (err.response && err.response.status === 400) {
        setError(err.response.data.message || 'Invalid input data');
      } else {
        setError('An error occurred while fetching guide data');
        console.error(err);
      }
    }
  };

  // Function to delete guide
  const handleDelete = async () => {
    clearStatus();
    
    if (!isAuthenticated) {
      setError("You must be logged in to delete guide data.");
      return;
    }
    
    if (!guide || !guide._id) {
      setError("No guide selected for deletion.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.delete(`/api/guide/${guide._id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      });
      
      setIsSubmitting(false);
      setIsConfirmingDelete(false);
      
      if (response.data && response.data.success) {
        setSuccess(response.data.message || "Guide deleted successfully");
        // Update the guide object to reflect deletion
        setGuide({
          ...guide,
          isDeleted: true,
          deletedAt: new Date()
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setIsSubmitting(false);
      
      if (err.response && err.response.status === 403) {
        setError('You do not have permission to delete this guide');
      } else if (err.response && err.response.status === 404) {
        setError('Guide not found or already deleted');
      } else {
        setError('Failed to delete guide: ' + (err.response?.data?.message || err.message));
      }
      console.error(err);
    }
  };

  // Function to open delete confirmation dialog
  const openDeleteConfirmation = () => {
    clearStatus(); // Clear any existing status messages
    setIsConfirmingDelete(true);
  };

  // Function to cancel delete operation
  const cancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  // Handle input changes
  const handleInputChange = () => {
    // Clear status messages whenever user changes search criteria
    clearStatus();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="mb-6 text-blue-600">
            <UserX className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            You must be logged in to access the guide deletion system.
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
      <div className="mb-6 flex items-center">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Delete Guide Record</h1>
      
      {/* Search Form */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Find Guide</h2>
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="w-full md:w-1/3">
            <label className="block mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                handleInputChange();
              }}
              className="w-full p-2 border rounded"
              placeholder="Enter username"
            />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block mb-1">Guide Name</label>
            <input
              type="text"
              value={guideName}
              onChange={(e) => {
                setGuideName(e.target.value);
                handleInputChange();
              }}
              className="w-full p-2 border rounded"
              placeholder="Enter guide name"
            />
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
      
      {/* Consolidated Status Message */}
      {statusMessage.type === 'error' && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 transform animate-fade-in-down">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p>{statusMessage.message}</p>
          </div>
        </div>
      )}
      
      {statusMessage.type === 'success' && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 transform animate-fade-in-down">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p>{statusMessage.message}</p>
          </div>
        </div>
      )}
      
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <Loader className="h-6 w-6 text-blue-600 animate-spin" />
            <p className="text-lg font-medium text-gray-800">
              Processing deletion...
            </p>
          </div>
        </div>
      )}
      
      <div className="max-w-3xl mx-auto">
        {/* Guide Details and Delete Button */}
        {guide && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Guide Details</h2>
              {!guide.isDeleted && !isConfirmingDelete && (
                <button
                  onClick={openDeleteConfirmation}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={isSubmitting}
                >
                  Delete Guide
                </button>
              )}
            </div>
            
            {/* Delete Confirmation */}
            {isConfirmingDelete && (
              <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <h3 className="text-lg font-semibold text-red-700">Confirm Deletion</h3>
                </div>
                <p className="mb-4 text-gray-700">
                  Are you sure you want to delete the guide record for <span className="font-semibold">{guide.guideName}</span> (Username: {guide.username})? This action will delete the guide and cannot be undone easily.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Confirm Delete"}
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {/* Guide Info Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Username</p>
                <p className="font-medium">{guide.username || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Guide Name</p>
                <p className="font-medium">{guide.guideName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{guide.email || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{guide.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className={`font-medium ${guide.isDeleted ? 'text-red-600' : 'text-green-600'}`}>
                  {guide.isDeleted ? 'Deleted' : 'Active'}
                </p>
              </div>
              {guide.isDeleted && guide.deletedAt && (
                <div>
                  <p className="text-gray-600">Deleted At</p>
                  <p className="font-medium text-red-600">
                    {new Date(guide.deletedAt).toLocaleString()}
                  </p>
                </div>
              )}
              <div>
                <p className="text-gray-600">Created At</p>
                <p className="font-medium">
                  {guide.createdAt ? new Date(guide.createdAt).toLocaleString() : 'Not available'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Updated At</p>
                <p className="font-medium">
                  {guide.updatedAt ? new Date(guide.updatedAt).toLocaleString() : 'Not available'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteGuidePage;