import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Select } from "../ui/select";
import axios from "axios";

const WeeklyReportForm = () => {
  const [formData, setFormData] = useState({
    student: "", // Will be set from token
    projectTitle: "",
    reportWeek: "", // Enum field (1 to 4)
    reportWeekStart: "",
    reportWeekEnd: "",
    objectivesForWeek: "",
    tasksCompleted: "",
    keyFindings: "",
    challengesEncountered: "",
    planForNextWeek: "",
  });

  // Get student ID from token (replace with actual auth method)
  useEffect(() => {
    const token = localStorage.getItem("token"); // Replace with actual auth handling
    if (token) {
      const studentData = JSON.parse(atob(token.split(".")[1])); // Decoding JWT (simplified)
      setFormData((prev) => ({ ...prev, student: studentData.id })); // Assuming student ID is stored as 'id'
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Weekly Report Submitted:", formData);

    axios
      .post("/api/weekly-reports", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Sending token in headers
      })
      .then((response) => {
        console.log("Report saved:", response.data);
      })
      .catch((error) => console.error("Error submitting report:", error));
  };

  return (
    <form onSubmit={handleSubmit} className="h-screen overflow-y-auto w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Weekly Report Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            name="projectTitle"
            placeholder="Project Title"
            value={formData.projectTitle}
            onChange={handleChange}
            required
          />

          {/* Report Week (Enum Selection) */}
          <div>
            <label className="text-sm font-medium">Report Week</label>
            <Select
              name="reportWeek"
              value={formData.reportWeek}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Week
              </option>
              <option value="1">Week 1</option>
              <option value="2">Week 2</option>
              <option value="3">Week 3</option>
              <option value="4">Week 4</option>
            </Select>
          </div>

          <div className="flex gap-2">
            <Input
              name="reportWeekStart"
              type="date"
              value={formData.reportWeekStart}
              onChange={handleChange}
              required
            />
            <Input
              name="reportWeekEnd"
              type="date"
              value={formData.reportWeekEnd}
              onChange={handleChange}
              required
            />
          </div>

          <Textarea
            name="objectivesForWeek"
            placeholder="Objectives for the Week"
            value={formData.objectivesForWeek}
            onChange={handleChange}
            required
          />
          <Textarea
            name="tasksCompleted"
            placeholder="Tasks Completed"
            value={formData.tasksCompleted}
            onChange={handleChange}
            required
          />
          <Textarea
            name="keyFindings"
            placeholder="Key Findings"
            value={formData.keyFindings}
            onChange={handleChange}
            required
          />
          <Textarea
            name="challengesEncountered"
            placeholder="Challenges Encountered"
            value={formData.challengesEncountered}
            onChange={handleChange}
            required
          />
          <Textarea
            name="planForNextWeek"
            placeholder="Plan for Next Week"
            value={formData.planForNextWeek}
            onChange={handleChange}
            required
          />

          <Button type="submit" className="w-full">
            Submit Weekly Report
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default WeeklyReportForm;
