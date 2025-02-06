// routes/guideRoutes.js
const express = require("express");
const router = express.Router();
const {
  createGuide,
  updateGuide,
  deleteGuide,
  getGuideById,
  getAllGuides
} = require("../controllers/guideController");
const { checkRoleAccess } = require("../middleware/authMiddleware");
const validateGuideInput = require("../middleware/validateGuideInput");

// Create a new guide
router.post("/", checkRoleAccess(["admin"]), validateGuideInput, createGuide);

// Update an existing guide by ID
router.put("/:id", checkRoleAccess(["guide", "admin"]), validateGuideInput, updateGuide);

// Soft delete a guide by ID
router.delete("/:id", checkRoleAccess(["admin"]), deleteGuide);

// Get a single guide by ID
router.get("/:id", checkRoleAccess(["guide", "admin"]), getGuideById);

// Get all guides (excluding soft-deleted records)
router.get("/", checkRoleAccess(["admin"]), getAllGuides);

module.exports = router;
