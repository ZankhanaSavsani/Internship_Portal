const express = require("express");
const router = express.Router();
const validateInternshipCompletionStatus = require("../middleware/validateInternshipCompletionStatus");
const {
  createInternshipCompletionStatus,
  getAllInternshipCompletionStatuses,
  getInternshipCompletionStatusById,
  updateInternshipCompletionStatus,
  deleteInternshipCompletionStatus,
} = require("../controllers/summerInternshipCompletionController");

// Create internship completion status
router.post("/", validateInternshipCompletionStatus, createInternshipCompletionStatus);

// Get all internship completion statuses
router.get("/", getAllInternshipCompletionStatuses);

// Get a specific internship completion status by ID
router.get("/:id", getInternshipCompletionStatusById);

// Update an internship completion status by ID
router.put("/:id", validateInternshipCompletionStatus, updateInternshipCompletionStatus);

// Delete an internship completion status by ID
router.delete("/:id", deleteInternshipCompletionStatus);

module.exports = router;
