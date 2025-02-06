const express = require("express");
const router = express.Router();
const {
  getAllCompanyApprovals,
  getCompanyApprovalById,
  createCompanyApproval,
  updateCompanyApproval,
  deleteCompanyApproval,
} = require("../controllers/companyApprovalController");
const validateCompanyApproval = require("../middleware/validateCompanyApproval"); // Import the validation middleware
const { checkRoleAccess } = require("../middleware/authMiddleware");

// Apply validation middleware to POST & PUT routes
router.post("/", checkRoleAccess(["student"]), validateCompanyApproval, createCompanyApproval);
router.put("/:id", checkRoleAccess(["student", "admin"]), validateCompanyApproval, updateCompanyApproval);

// GET all approvals
router.get("/", checkRoleAccess(["admin"]), getAllCompanyApprovals);

// GET single approval by ID
router.get("/:id", checkRoleAccess(["student", "guide", "admin"]), getCompanyApprovalById);

// DELETE remove an approval
router.delete("/:id", checkRoleAccess(["student", "admin"]), deleteCompanyApproval);

module.exports = router;
