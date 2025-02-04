const mongoose = require("mongoose");

const companyApprovalDetailsSchema = new mongoose.Schema(
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
    companyName: {
      type: String,
      required: true,
    },
    companyWebsite: {
      type: String,
    },
    companyAddress: {
      type: String,
      required: true,
    },
    numberOfEmployees: {
      type: Number,
    },
    branches: [
      {
        location: { type: String }, // Location of each branch
      },
    ],
    headOfficeAddress: {
      type: String,
    },
    stipendAmount: {
      type: Number,
      required: true,
      min: 0, // Ensures non-negative value
    },
    hrDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    technology: {
      type: [String], // Array of technologies
    },
    currentProject: {
      type: String,
    },
    clients: {
      type: [String], // Array of client names
    },
    sourceOfCompany: {
      type: String, // How the student found the company
    },
    reasonToChoose: {
      type: String, // Why the student chose this company
    },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending", // Default value
    },
    rejectionReason: {
      type: String, // Reason for rejection
      default: null, // Null by default, only used when rejected
    },
  },
  { timestamps: true }
);

const CompanyApprovalDetails = mongoose.model(
  "CompanyApprovalDetails",
  companyApprovalDetailsSchema
);

module.exports = CompanyApprovalDetails;
