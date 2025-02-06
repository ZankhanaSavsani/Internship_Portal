// internshipStatusRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAllInternshipStatuses,
  getInternshipStatusById,
  createInternshipStatus,
  updateInternshipStatus,
  deleteInternshipStatus,
} = require("../controllers/summerInternshipStatusController");
const { checkRoleAccess } = require("../middleware/authMiddleware");

// Import validation middleware from the middleware file
const { validateInternshipStatus } = require("../middleware/validateInternshipStatusMiddleware");

// Apply validation middleware to POST & PUT routes
router.post("/", checkRoleAccess(["student"]), validateInternshipStatus, createInternshipStatus);
router.put("/:id", checkRoleAccess(["student", "admin"]), validateInternshipStatus, updateInternshipStatus);

// GET all internship statuses
router.get("/", checkRoleAccess(["admin"]), getAllInternshipStatuses);

// GET single internship status by ID
router.get("/:id", checkRoleAccess(["student", "guide", "admin"]), getInternshipStatusById);

// DELETE remove an internship status
router.delete("/:id", checkRoleAccess(["student", "admin"]), deleteInternshipStatus);

module.exports = router;
