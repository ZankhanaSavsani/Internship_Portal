const mongoose = require("mongoose");

const summerInternshipCompletionStatusSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // Reference to the Student model
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    typeOfInternship: {
      type: String,
      enum: [
        "Development Project",
        "Research Project",
        "On Technology Training",
      ], // Allowed options
      required: true,
    },
    technology: {
      type: String,
      required: true,
    },
    technologyDetails: {
      type: String,
      required: true,
    },
    modeOfInternship: {
      type: String,
      enum: ["Offline", "Online", "Hybrid"], // Allowed options
      required: true,
    },
    internshipLocation: {
      type: String,
      required: true,
    },
    companyAddress: {
      type: String,
      required: true,
    },
    hrDetails: {
      name: { type: String, required: true },
      contactNo: { type: String, required: true },
      email: { type: String, required: true },
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    stipendAmount: {
      type: Number,
      required: true,
      min: 0, // Ensures non-negative value
    },
    stipendProof: {
      type: String, // File path or URL to the uploaded file
      required: false, // Optional field
    },
    completionCertificate: {
      type: String, // File path or URL to the uploaded file
      required: true,
    },
  },
  { timestamps: true }
);

const SummerInternshipCompletionStatus = mongoose.model(
  "SummerInternshipCompletionStatus",
  summerInternshipCompletionStatusSchema
);

module.exports = SummerInternshipCompletionStatus;
