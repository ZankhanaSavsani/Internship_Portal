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
const {handleMulterErrors} = require("../middleware/multerMiddleware");

// File validation middleware
const validateFiles = (req, res, next) => {
  if (!req.files?.completionCertificate?.[0]) {
    return res.status(400).json({
      success: false,
      message: "Completion certificate is required",
    });
  }

  if (req.files?.stipendProof?.[0]) {
    const stipendProof = req.files.stipendProof[0];
    if (!stipendProof.mimetype.startsWith("image/") && !stipendProof.mimetype.startsWith("application/pdf")) {
      return res.status(400).json({
        success: false,
        message: "Stipend proof must be an image or PDF file",
      });
    }
  }

  next();
};

// Create internship completion status
router.post(
  "/",
  checkRoleAccess(["student"]),
  upload.fields([
    { name: "stipendProof", maxCount: 1 },
    { name: "completionCertificate", maxCount: 1 },
  ]),
  handleMulterErrors,
  validateFiles,
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
