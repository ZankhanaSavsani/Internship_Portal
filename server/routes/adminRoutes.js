// routes/adminRoutes.js
const express = require("express");
const {validateToken, checkRoleAccess } = require("../middleware/authMiddleware");
const validateAdminInput = require("../middleware/validateAdminInput");
const router = express.Router();
const {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAllAdmins
} = require("../controllers/adminController");

// Create a new admin
router.post("/", validateToken, checkRoleAccess(["admin"]), validateAdminInput, createAdmin);

// Update an existing admin by ID
router.put("/:id", validateToken, checkRoleAccess(["admin"]), validateAdminInput, updateAdmin);

// Soft delete an admin by ID
router.delete("/:id", validateToken, checkRoleAccess(["admin"]), deleteAdmin);

// Get all admins (excluding soft-deleted records)
router.get("/", validateToken, checkRoleAccess(["admin"]), getAllAdmins);

module.exports = router;
