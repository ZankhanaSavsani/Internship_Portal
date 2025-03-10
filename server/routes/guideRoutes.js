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
const {validateToken, checkRoleAccess } = require("../middleware/authMiddleware");
const validateGuideInput = require("../middleware/validateGuideInput");

// Create a new guide
router.post("/", validateToken, checkRoleAccess(["admin"]), validateGuideInput, createGuide);

// Update an existing guide by ID
router.put("/:id", validateToken, checkRoleAccess(["guide", "admin"]), validateGuideInput, updateGuide);

// Soft delete a guide by ID
router.delete("/:id", validateToken, checkRoleAccess(["admin"]), deleteGuide);

// Get a single guide by ID
router.get("/:id", validateToken, checkRoleAccess(["guide", "admin"]), getGuideById);

// Get all guides (excluding soft-deleted records)
router.get("/", validateToken, checkRoleAccess(["admin"]), getAllGuides);

module.exports = router;
