// routes/guideRoutes.js
const express = require("express");
const router = express.Router();
const {
  createGuide,
  updateGuide,
  deleteGuide,
  getAllGuides
} = require("../controllers/guideController");

// Create a new guide
router.post("/", createGuide);

// Update an existing guide by ID
router.put("/:id", updateGuide);

// Soft delete a guide by ID
router.delete("/:id", deleteGuide);

// Get all guides (excluding soft-deleted records)
router.get("/", getAllGuides);

module.exports = router;
