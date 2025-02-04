const mongoose = require("mongoose");

const summerInternshipStatusSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // Reference to the Student model
      required: true,
    },

    // Company Details
    companyName: {
      type: String,
      required: true,
    },
    companyWebsite: {
      type: String,
      required: true,
    },
    companyAddress: {
      type: String,
      required: true,
    },
    companyCity: {
      type: String,
      required: true,
    },

    // Internship Details
    typeOfInternship: {
      type: String,
      enum: [
        "Development Project",
        "Inhouse/Research Project",
        "On Technology Training",
      ], // Allowed options
      required: true,
    },
    technologies: {
      type: [String], // Array of technologies
      required: true,
    },
    technologiesDetails: {
      type: String,
      required: true,
    },
    modeOfInternship: {
      type: String,
      enum: ["Offline", "Online", "Hybrid"], // Allowed options
      required: true,
    },

    // HR Contact Details
    hrDetails: {
      name: { type: String, required: true },
      contactNo: { type: String, required: true },
      email: { type: String, required: true },
    },

    // Financial & Document Details
    stipendAmount: {
      type: Number,
      required: true,
      min: 0, // Ensures non-negative value
    },
    offerLetter: {
      type: String, // File path or URL to the uploaded file
      required: true,
    },
  },
  { timestamps: true }
);

const SummerInternshipStatus = mongoose.model(
  "SummerInternshipStatus",
  summerInternshipStatusSchema
);

module.exports = SummerInternshipStatus;
