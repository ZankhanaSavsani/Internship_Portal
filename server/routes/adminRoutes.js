// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAllAdmins
} = require("../controllers/adminController");

// Create a new admin
router.post("/", createAdmin);

// Update an existing admin by ID
router.put("/:id", updateAdmin);

// Soft delete an admin by ID
router.delete("/:id", deleteAdmin);

// Get all admins (excluding soft-deleted records)
router.get("/", getAllAdmins);

module.exports = router;
