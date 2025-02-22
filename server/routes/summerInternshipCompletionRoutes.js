const express = require("express");
const router = express.Router();
const multer = require("multer");
const validateInternshipCompletionStatus = require("../middleware/validateInternshipCompletionStatus");
const {
  createInternshipCompletionStatus,
  getAllInternshipCompletionStatuses,
  getInternshipCompletionStatusById,
  updateInternshipCompletionStatus,
  deleteInternshipCompletionStatus,
} = require("../controllers/summerInternshipCompletionController");
const { checkRoleAccess } = require("../middleware/authMiddleware");
const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files

// Create internship completion status
router.post(
  "/",
  upload.fields([
    { name: "stipendProof", maxCount: 1 },
    { name: "completionCertificate", maxCount: 1 },
  ]),
  validateInternshipCompletionStatus,
  createInternshipCompletionStatus
);

// Update an internship completion status by ID
router.put(
  "/:id",
  upload.fields([
    { name: "stipendProof", maxCount: 1 },
    { name: "completionCertificate", maxCount: 1 },
  ]),
  validateInternshipCompletionStatus,
  updateInternshipCompletionStatus
);

// Get all internship completion statuses
router.get("/", checkRoleAccess(["admin"]), getAllInternshipCompletionStatuses);

// Get a specific internship completion status by ID
router.get(
  "/:id",
  checkRoleAccess(["student", "guide", "admin"]),
  getInternshipCompletionStatusById
);

// Delete an internship completion status by ID
router.delete(
  "/:id",
  checkRoleAccess(["student", "admin"]),
  deleteInternshipCompletionStatus
);

module.exports = router;
