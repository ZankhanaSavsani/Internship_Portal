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

// Apply validation middleware to POST & PUT routes
router.post("/", validateCompanyApproval, createCompanyApproval);
router.put("/:id", validateCompanyApproval, updateCompanyApproval);

// GET all approvals
router.get("/", getAllCompanyApprovals);

// GET single approval by ID
router.get("/:id", getCompanyApprovalById);

// DELETE remove an approval
router.delete("/:id", deleteCompanyApproval);

module.exports = router;
