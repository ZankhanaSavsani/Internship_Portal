import React, { useState, useEffect } from "react";
import { UserX, ArrowLeft, AlertTriangle } from "lucide-react";

const DeleteAdmin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);

  // Fetch all admins when the component mounts
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin");
        const data = await response.json();
        if (response.ok) {
          setAdmins(data.data); // Set the list of admins
        } else {
          alert("Error fetching admins: " + (data.message || "Please try again."));
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
        alert("Error fetching admins. Please try again.");
      }
    };
    fetchAdmins();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter admins based on search query
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/${selectedAdmin._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Admin deleted successfully!");
        console.log("Admin deleted:", data);
        // Remove the deleted admin from the list
        setAdmins((prevAdmins) =>
          prevAdmins.filter((admin) => admin._id !== selectedAdmin._id)
        );
      } else {
        alert("Error deleting admin: " + (data.message || "Please try again."));
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Error deleting admin. Please try again.");
    }
    setShowConfirmDialog(false);
    setSelectedAdmin(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Delete Admin</h1>
            </div>
          </div>

          {/* Search Box */}
          <div className="p-6 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search by admin name or username..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Admins List */}
          <div className="p-6">
            {filteredAdmins.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No admins found
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAdmins.map((admin) => (
                  <div
                    key={admin._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {admin.adminName}
                      </h3>
                      <div className="text-sm text-gray-500">
                        <p>Username: {admin.username}</p>
                        <p>Email: {admin.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(admin)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold">Confirm Deletion</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedAdmin?.adminName}? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAdmin;