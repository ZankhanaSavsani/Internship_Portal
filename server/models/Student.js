const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const studentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "student",
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
  Guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guide", // Reference to the Guide model
  },
});

// Create a compound index for `username`, `semester`, and `year`
studentSchema.index({ username: 1, semester: 1, year: 1 }, { unique: true });

// Pre-save hook for hashing password and setting email
studentSchema.pre("save", async function (next) {

  // Convert username to lowercase
  this.username = this.username.toLowerCase();
  
  // Automatically generate email from the username
  this.email = `${this.username}@charusat.edu.in`;

  // Generate a random password 
  const randomPassword = crypto.randomBytes(8).toString("hex"); // Random 16-character password
  this.password = randomPassword;

  // Hash the password before saving
  this.password = await bcrypt.hash(this.password, 10);

   // Auto-generate academic year
   const currentYear = new Date().getFullYear();
   this.year = `${currentYear}-${currentYear + 1}`;

  next();
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
