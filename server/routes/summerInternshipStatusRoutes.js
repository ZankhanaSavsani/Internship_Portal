const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerMiddleware");
const {
  getAllInternshipStatuses,
  getInternshipStatusById,
  createInternshipStatus,
  updateInternshipStatus,
  deleteInternshipStatus,
} = require("../controllers/summerInternshipStatusController");
const { checkRoleAccess } = require("../middleware/authMiddleware");
const { validateInternshipStatus } = require("../middleware/validateInternshipStatusMiddleware");

// Apply Multer middleware for file uploads
router.post(
  "/",
  upload.single("offerLetter"), // Handle single file upload
  validateInternshipStatus,
  createInternshipStatus
);

router.put(
  "/:id",
  checkRoleAccess(["student", "admin"]),
  upload.single("offerLetter"), // Handle single file upload
  validateInternshipStatus,
  updateInternshipStatus
);

// GET all internship statuses
router.get("/", checkRoleAccess(["admin"]), getAllInternshipStatuses);

// GET single internship status by ID
router.get("/:id", checkRoleAccess(["student", "guide", "admin"]), getInternshipStatusById);

// DELETE remove an internship status
router.delete("/:id", checkRoleAccess(["student", "admin"]), deleteInternshipStatus);

module.exports = router;