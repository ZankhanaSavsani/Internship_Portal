import React, { useEffect, useState } from "react";
import { getAllGuideAllocations } from "../api";

const GuideAllocationList = () => {
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const response = await getAllGuideAllocations();
        setAllocations(response.data);
      } catch (error) {
        console.error("Error fetching allocations:", error);
      }
    };

    fetchAllocations();
  }, []);

  return (
    <div>
      <h2>Guide Allocations</h2>
      {allocations.length > 0 ? (
        <ul>
          {allocations.map((allocation) => (
            <li key={allocation._id}>
              <p>Guide: {allocation.guide.name}</p>
              <p>Range: {allocation.range}</p>
              <p>Semester: {allocation.semester}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No guide allocations found.</p>
      )}
    </div>
  );
};

export default GuideAllocationList;