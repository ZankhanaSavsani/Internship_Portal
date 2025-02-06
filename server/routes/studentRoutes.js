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
const { checkRoleAccess } = require("../middleware/authMiddleware");
const validateStudentInput = require("../middleware/validateStudentInput");

// Create a student
router.post("/", checkRoleAccess(["admin"]), validateStudentInput, createStudent);

// Get all students
router.get("/", checkRoleAccess(["admin"]), getAllStudents);

// Get student by ID
router.get("/:id",checkRoleAccess(["student", "guide", "admin"]), getStudentById);

// Update student
router.put("/:id",checkRoleAccess(["student", "admin"]), validateStudentInput, updateStudent);

// Soft delete student
router.delete("/:id", checkRoleAccess(["admin"]), deleteStudent);


module.exports = router;
