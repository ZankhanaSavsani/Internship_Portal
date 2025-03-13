import React, { useEffect, useState } from "react";
import { getAllGuideAllocations } from "../../../api/index";

const GuideAllocationList = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllocations = async () => {
      setLoading(true);
      try {
        const response = await getAllGuideAllocations();
        setAllocations(response.data || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching allocations:", error);
        setError("Failed to load guide allocations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllocations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-5">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Guide Allocations</h2>
        </div>
        <div className="p-4">
          {allocations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guide Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Range</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allocations.map((allocation, index) => (
                    <tr key={allocation._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{allocation.guide?.name || "Unknown"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{allocation.range}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Semester {allocation.semester}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(allocation.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
              <p>No guide allocations found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideAllocationList;