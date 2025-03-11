import React, { useState } from "react";
import { allocateGuide } from "../api";

const GuideAllocationForm = () => {
  const [range, setRange] = useState("");
  const [guideId, setGuideId] = useState("");
  const [semester, setSemester] = useState(5);
  const [message, setMessage] = useState("");
  const [missingStudents, setMissingStudents] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await allocateGuide(range, guideId, semester);
      setMessage("Guide allocated successfully!");
      setMissingStudents(response.missingStudents);
    } catch (error) {
      setMessage("Failed to allocate guide. Please try again.");
      setMissingStudents([]);
    }
  };

  return (
    <div>
      <h2>Allocate Guide to Students</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student ID Range (e.g., 22cs078-22cs082):</label>
          <input
            type="text"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Guide ID:</label>
          <input
            type="text"
            value={guideId}
            onChange={(e) => setGuideId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Semester:</label>
          <select
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
          >
            <option value={5}>5th Semester</option>
            <option value={7}>7th Semester</option>
          </select>
        </div>
        <button type="submit">Allocate Guide</button>
      </form>

      {message && <p>{message}</p>}
      {missingStudents.length > 0 && (
        <div>
          <p>The following students were not found:</p>
          <ul>
            {missingStudents.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GuideAllocationForm;