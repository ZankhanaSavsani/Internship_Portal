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

// Import validation middleware from the middleware file
const { validateInternshipStatus } = require("../middleware/validateInternshipStatusMiddleware");

// Apply validation middleware to POST & PUT routes
router.post("/", validateInternshipStatus, createInternshipStatus);
router.put("/:id", validateInternshipStatus, updateInternshipStatus);

// GET all internship statuses
router.get("/", getAllInternshipStatuses);

// GET single internship status by ID
router.get("/:id", getInternshipStatusById);

// DELETE remove an internship status
router.delete("/:id", deleteInternshipStatus);

module.exports = router;
