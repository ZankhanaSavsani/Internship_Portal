const mongoose = require("mongoose");

const internshipGroupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide", // Reference to Guide model
      required: true,
    },
    students: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student", // Reference to Student model
          required: true,
        },
        studentName: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    weeklyReports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WeeklyReport", // Reference to Weekly Reports
      },
    ],
    companyApprovalDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyApprovalDetails", // Reference to Company Approval Details
      },
    ],
    summerInternshipStatus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SummerInternshipStatus", // Reference to Summer Internship Status
      },
    ],
    summerInternshipCompletionStatus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SummerInternshipCompletionStatus", // Reference to Internship Completion
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
  }
);

const InternshipGroup = mongoose.model(
  "InternshipGroup",
  internshipGroupSchema
);

module.exports = InternshipGroup;
