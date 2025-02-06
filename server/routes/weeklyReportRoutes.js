const express = require("express");
const {
  createWeeklyReport,
  getAllWeeklyReports,
  getWeeklyReportById,
  updateWeeklyReport,
  deleteWeeklyReport,
} = require("../controllers/WeeklyReportController");

const validateReport = require("../middleware/validateWeeklyReport");
const { checkRoleAccess } = require("../middleware/authMiddleware");

const router = express.Router();

// Routes
router.post("/", checkRoleAccess(["student"]), validateReport, createWeeklyReport);
router.get("/", checkRoleAccess(["admin"]), getAllWeeklyReports);
router.get("/:id", checkRoleAccess(["student", "guide", "admin"]), getWeeklyReportById);
router.put("/:id", checkRoleAccess(["student", "guide", "admin"]), validateReport, updateWeeklyReport);
router.delete("/:id", checkRoleAccess(["student", "guide", "admin"]), deleteWeeklyReport);

module.exports = router;
