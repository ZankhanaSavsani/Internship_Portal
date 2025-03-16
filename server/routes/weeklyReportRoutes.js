const express = require("express");
const {
  createWeeklyReport,
  getAllWeeklyReports,
  getWeeklyReportById,
  updateWeeklyReport,
  deleteWeeklyReport,
  updateApprovalStatus,
  addMarks,
  restoreWeeklyReport,
} = require("../controllers/WeeklyReportController");

const validateReport = require("../middleware/validateWeeklyReport");
const {
  validateToken,
  checkRoleAccess,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Routes
// Create a new weekly report
router.post(
  "/",
  validateToken,
  checkRoleAccess(["student"]),
  validateReport,
  createWeeklyReport
);
// Get all weekly reports
router.get("/", validateToken, checkRoleAccess(["admin"]), getAllWeeklyReports);
// Get a single weekly report by ID
router.get(
  "/:id",
  validateToken,
  checkRoleAccess(["student", "guide", "admin"]),
  getWeeklyReportById
);
// Update a weekly report
router.put(
  "/:id",
  validateToken,
  checkRoleAccess(["student", "guide", "admin"]),
  validateReport,
  updateWeeklyReport
);
// Delete a weekly report
router.delete(
  "/:id",
  validateToken,
  checkRoleAccess(["admin"]),
  deleteWeeklyReport
);
// Update approval status and rejection reason
router.patch(
  "/:id/approval",
  validateToken,
  checkRoleAccess(["admin", "guide"]),
  updateApprovalStatus
);
// Add marks to a weekly report
router.patch(
  "/:id/marks",
  validateToken,
  checkRoleAccess(["admin", "guide"]),
  addMarks
);
// Restore a soft-deleted weekly report
router.patch(
  "/:id/restore",
  validateToken,
  checkRoleAccess(["admin"]),
  restoreWeeklyReport
);

module.exports = router;
