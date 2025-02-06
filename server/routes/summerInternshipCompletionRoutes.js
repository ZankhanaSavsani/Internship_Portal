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
const { checkRoleAccess } = require("../middleware/authMiddleware");

// Create internship completion status
router.post("/", checkRoleAccess(["student"]), validateInternshipCompletionStatus, createInternshipCompletionStatus);

// Get all internship completion statuses
router.get("/",checkRoleAccess(["admin"]), getAllInternshipCompletionStatuses);

// Get a specific internship completion status by ID
router.get("/:id", checkRoleAccess(["student", "guide", "admin"]), getInternshipCompletionStatusById);

// Update an internship completion status by ID
router.put("/:id",checkRoleAccess(["student", "admin"]), validateInternshipCompletionStatus, updateInternshipCompletionStatus);

// Delete an internship completion status by ID
router.delete("/:id",checkRoleAccess(["student", "admin"]), deleteInternshipCompletionStatus);

module.exports = router;
