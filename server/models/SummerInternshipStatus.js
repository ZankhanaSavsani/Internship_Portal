const mongoose = require("mongoose");

const summerInternshipStatusSchema = new mongoose.Schema(
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
    companyWebsite: {
      type: String,
    },
    stipendAmount: {
      type: Number,
      required: true,
      min: 0, // Ensures non-negative value
    },
    learningMode: {
      type: String,
      enum: [
        "Development Project",
        "Inhouse/Research Project",
        "On Technology Training",
      ], // Allowed options
      required: true,
    },
    confirmedTechnology: {
      type: String,
      required: true,
    },
    companyCity: {
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
