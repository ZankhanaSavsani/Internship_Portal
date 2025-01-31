const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const comparePassword = require("./passwordUtils"); // Import the function

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
    email: {
      type: String,
      required: true,
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
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index for `username`, `semester`, and `year`
studentSchema.index({ studentId: 1, semester: 1, year: 1 }, { unique: true });

// Pre-save hook for hashing password and setting email
studentSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next(); // Only hash if password is modified

  // Convert studentId to lowercase
  this.studentId = this.studentId.toLowerCase();

  // Automatically generate email from the studentId
  this.email = `${this.studentId}@charusat.edu.in`;

  // Generate a random password
  const randomPassword = crypto.randomBytes(8).toString("hex"); 
  this.password = randomPassword;

  // Hash the password before saving
  this.password = await bcrypt.hash(this.password, 10);

  // Auto-generate academic year
  const currentYear = new Date().getFullYear();
  this.year = `${currentYear}-${currentYear + 1}`;

  next();
});

studentSchema.methods.comparePassword = comparePassword;

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
