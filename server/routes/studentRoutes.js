// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

// Create a student
router.post("/", createStudent);

// Get all students
router.get("/", getAllStudents);

// Get student by ID
router.get("/:id", getStudentById);

// Update student
router.put("/:id", updateStudent);

// Soft delete student
router.delete("/:id", deleteStudent);


module.exports = router;
