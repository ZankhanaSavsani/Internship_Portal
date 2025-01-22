const mongoose = require("mongoose");

const weeklyReportSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // Reference to the Student model
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    projectTitle: {
      type: String,
      required: true,
    },
    reportWeek: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true,
    },
    reportWeekStart: {
      type: Date,
      required: true,
    },
    reportWeekEnd: {
      type: Date,
      required: true,
    },
    objectivesForWeek: {
      type: String,
      required: true,
    },
    tasksCompleted: {
      type: String,
      required: true,
    },
    keyFindings: {
      type: String,
      required: true,
    },
    challengesEncountered: {
      type: String,
      required: true,
    },
    planForNextWeek: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const WeeklyReport = mongoose.model("WeeklyReport", weeklyReportSchema);

module.exports = WeeklyReport;
