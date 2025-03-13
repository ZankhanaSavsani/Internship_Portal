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
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2>Guide Allocations</h2>
        </div>
        <div className="card-body">
          {allocations.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Guide Name</th>
                    <th scope="col">Student Range</th>
                    <th scope="col">Semester</th>
                    <th scope="col">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((allocation, index) => (
                    <tr key={allocation._id}>
                      <td>{index + 1}</td>
                      <td>{allocation.guide?.name || "Unknown"}</td>
                      <td>{allocation.range}</td>
                      <td>
                        <span className="badge bg-primary">
                          Semester {allocation.semester}
                        </span>
                      </td>
                      <td>
                        {new Date(allocation.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">No guide allocations found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideAllocationList;