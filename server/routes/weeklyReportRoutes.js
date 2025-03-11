const express = require("express");
const {
  createWeeklyReport,
  getAllWeeklyReports,
  getWeeklyReportById,
  updateWeeklyReport,
  deleteWeeklyReport,
} = require("../controllers/WeeklyReportController");

const validateReport = require("../middleware/validateWeeklyReport");
const { validateToken, checkRoleAccess } = require("../middleware/authMiddleware");

const router = express.Router();

// Routes
router.post("/", validateToken, checkRoleAccess(["student"]), validateReport, createWeeklyReport);
router.get("/", validateToken, checkRoleAccess(["admin"]), getAllWeeklyReports);
router.get("/:id", validateToken, checkRoleAccess(["student", "guide", "admin"]), getWeeklyReportById);
router.put("/:id", validateToken, checkRoleAccess(["student", "guide", "admin"]), validateReport, updateWeeklyReport);
router.delete("/:id", validateToken, checkRoleAccess(["student", "guide", "admin"]), deleteWeeklyReport);

module.exports = router;
