import React, { useState, useEffect } from "react";
import { UserX, ArrowLeft, AlertTriangle } from "lucide-react";

const DeleteGuide = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [guides, setGuides] = useState([]);

  // Fetch all guides when the component mounts
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/guide");
        const data = await response.json();
        if (response.ok) {
          setGuides(data.data); // Set the list of guides
        } else {
          alert("Error fetching guides: " + (data.message || "Please try again."));
        }
      } catch (error) {
        console.error("Error fetching guides:", error);
        alert("Error fetching guides. Please try again.");
      }
    };
    fetchGuides();
  }, []);

  const handleDeleteClick = (guide) => {
    setSelectedGuide(guide);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/guide/${selectedGuide._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Guide deleted successfully!");
        console.log("Guide deleted:", data);
        // Remove the deleted guide from the list
        setGuides((prevGuides) =>
          prevGuides.filter((guide) => guide._id !== selectedGuide._id)
        );
      } else {
        alert("Error deleting guide: " + (data.message || "Please try again."));
      }
    } catch (error) {
      console.error("Error deleting guide:", error);
      alert("Error deleting guide. Please try again.");
    }
    setShowConfirmDialog(false);
    setSelectedGuide(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
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
              <h1 className="text-xl font-semibold text-gray-900">Delete Guide</h1>
            </div>
          </div>

          {/* Guides Table */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guide Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {guides.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        No guides found
                      </td>
                    </tr>
                  ) : (
                    guides.map((guide) => (
                      <tr key={guide._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {guide.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {guide.guideName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {guide.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDeleteClick(guide)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
              Are you sure you want to delete {selectedGuide?.guideName}? This
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

export default DeleteGuide;