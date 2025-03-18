import React, { useState, useEffect } from "react";
import {
  UserX,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "../../layouts/AuthProvider";

const DeleteAdmin = () => {
  const { isAuthenticated, user } = useAuth();
  
  // State for search parameters
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for admin data
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  
  // UI state
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

  // Fetch all admins when the component mounts
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchAdmins = async () => {
      setLoading(true);
      clearStatus();
      
      try {
        const response = await fetch("/api/admin", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        
        if (response.ok) {
          setAdmins(data.data);
        } else {
          setError("Error fetching admins: " + (data.message || "Please try again."));
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
        setError("Error fetching admins. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdmins();
  }, [isAuthenticated, user]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    clearStatus();
  };

  // Filter admins based on search query
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.adminName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (admin.email && admin.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Function to open delete confirmation
  const openDeleteConfirmation = (admin) => {
    setSelectedAdmin(admin);
    setIsConfirmingDelete(true);
    clearStatus();
  };

  // Function to cancel delete operation
  const cancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  // Function to handle deletion
  const handleDelete = async () => {
    if (!selectedAdmin || !selectedAdmin._id) {
      setError("No admin selected for deletion.");
      return;
    }

    setIsSubmitting(true);
    clearStatus();
    
    try {
      const response = await fetch(
        `/api/admin/${selectedAdmin._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess("Admin deleted successfully!");
        
        // Mark the admin as deleted in the UI
        const updatedAdmins = admins.map(admin => 
          admin._id === selectedAdmin._id 
            ? { ...admin, isDeleted: true, deletedAt: new Date() } 
            : admin
        );
        
        setAdmins(updatedAdmins);
        
        // Keep the selected admin but mark it as deleted for display
        setSelectedAdmin({
          ...selectedAdmin,
          isDeleted: true,
          deletedAt: new Date()
        });
      } else {
        setError("Error deleting admin: " + (data.message || "Please try again."));
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      setError("Error deleting admin. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
      setIsConfirmingDelete(false);
    }
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
            You must be logged in to access the admin deletion system.
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
      <div className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Delete Admin</h1>
      </div>
      
      {/* Search Form */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Find Admin</h2>
        <div className="flex flex-wrap gap-4">
          <div className="w-full">
            <label className="block mb-1">Search by Name, Username, or Email</label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full p-2 border rounded"
              placeholder="Enter search term..."
            />
          </div>
        </div>
      </div>
      
      {/* Status Messages */}
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
      
      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading admins...</span>
        </div>
      )}
      
      {/* Loading Overlay for Delete Operation */}
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
        {/* Admin List */}
        {!loading && filteredAdmins.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500">No admins found</p>
          </div>
        )}
        
        {/* Selected Admin Details */}
        {selectedAdmin && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Admin Details</h2>
              {!selectedAdmin.isDeleted && !isConfirmingDelete && (
                <button
                  onClick={() => openDeleteConfirmation(selectedAdmin)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={isSubmitting}
                >
                  Delete Admin
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
                  Are you sure you want to delete the admin account for <span className="font-semibold">{selectedAdmin.adminName}</span> (Username: {selectedAdmin.username})? This action cannot be undone easily.
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
            
            {/* Admin Info Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Admin Name</p>
                <p className="font-medium">{selectedAdmin.adminName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Username</p>
                <p className="font-medium">{selectedAdmin.username || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{selectedAdmin.email || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Role</p>
                <p className="font-medium">{selectedAdmin.role || 'admin'}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className={`font-medium ${selectedAdmin.isDeleted ? 'text-red-600' : 'text-green-600'}`}>
                  {selectedAdmin.isDeleted ? 'Deleted' : 'Active'}
                </p>
              </div>
              {selectedAdmin.isDeleted && selectedAdmin.deletedAt && (
                <div>
                  <p className="text-gray-600">Deleted At</p>
                  <p className="font-medium text-red-600">
                    {new Date(selectedAdmin.deletedAt).toLocaleString()}
                  </p>
                </div>
              )}
              {selectedAdmin.createdAt && (
                <div>
                  <p className="text-gray-600">Created At</p>
                  <p className="font-medium">
                    {new Date(selectedAdmin.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
              {selectedAdmin.updatedAt && (
                <div>
                  <p className="text-gray-600">Updated At</p>
                  <p className="font-medium">
                    {new Date(selectedAdmin.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Admins List */}
        {!loading && filteredAdmins.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Available Admins</h2>
            <div className="space-y-4">
              {filteredAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                    selectedAdmin && selectedAdmin._id === admin._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  } ${admin.isDeleted ? 'opacity-70' : ''}`}
                  onClick={() => setSelectedAdmin(admin)}
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {admin.adminName}
                      {admin.isDeleted && <span className="ml-2 text-red-600 text-sm">(Deleted)</span>}
                    </h3>
                    <div className="text-sm text-gray-500">
                      <p>Username: {admin.username}</p>
                      <p>Email: {admin.email}</p>
                    </div>
                  </div>
                  {!admin.isDeleted && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteConfirmation(admin);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAdmin;