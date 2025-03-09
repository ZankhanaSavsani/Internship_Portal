const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const comparePassword = require("../utils/passwordUtils"); // Import the function

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    studentName: {
      type: String,
      default: "",
      trim: true,
    },
    isOnboarded: {
      type: Boolean,
      default: false, // Set to true after the student provides their name
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "student",
      enum: ["student"],
      required: true,
    },
    semester: {
      type: Number,
      enum: [5, 7],
      required: true,
    },
    year: {
      type: String, // Format: "2025-2026"
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index for `studentId`, `semester`, and `year`
studentSchema.index({ studentId: 1, semester: 1, year: 1 }, { unique: true });

// Pre-save hook for hashing password and setting email
studentSchema.pre("save", async function (next) {
  try {
    // Convert studentId to lowercase
    this.studentId = this.studentId.toLowerCase();

    // Automatically generate email from the studentId
    this.email = `${this.studentId}@charusat.edu.in`;

    // Hash the password before saving
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    // Auto-generate academic year
    const currentYear = new Date().getFullYear();
    this.year = `${currentYear}-${currentYear + 1}`;

    next();
  } catch (error) {
    next(error);
  }
});

studentSchema.methods.comparePassword = comparePassword;

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;