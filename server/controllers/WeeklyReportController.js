const WeeklyReport = require("../models/WeeklyProgressReportModel");
const logger = require("../utils/logger");

// @desc   Create a new weekly report
// @route  POST /api/weekly-reports
exports.createWeeklyReport = async (req, res, next) => {
  try {
    const newReport = await WeeklyReport.create(req.body);
    logger.info(`New weekly report created: ${newReport._id}`);
    res.status(201).json(newReport);
  } catch (error) {
    next(error);
  }
};

// @desc   Get all weekly reports (excluding soft-deleted ones)
// @route  GET /api/weekly-reports
exports.getAllWeeklyReports = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit of 10

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    const skip = (page - 1) * limit;
    const sortField = req.query.sortBy || "createdAt"; // Default sorting by createdAt
    const sortOrder = req.query.order === "desc" ? -1 : 1;
    const sortOptions = { [sortField]: sortOrder };

    // Fetch reports excluding soft-deleted ones
    const reports = await WeeklyReport.find({ isDeleted: false })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await WeeklyReport.countDocuments({ isDeleted: false });

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get a single weekly report by ID (excluding soft-deleted reports)
// @route  GET /api/weekly-reports/:id
exports.getWeeklyReportById = async (req, res, next) => {
  try {
    const report = await WeeklyReport.findById(req.params.id).populate("student", "name email");

    if (!report || report.isDeleted) {
      return res.status(404).json({ message: "Weekly report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

// @desc   Update a weekly report
// @route  PUT /api/weekly-reports/:id
exports.updateWeeklyReport = async (req, res, next) => {
  try {
    const updatedReport = await WeeklyReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Ensures validation rules are applied
    );

    if (!updatedReport || updatedReport.isDeleted) {
      return res.status(404).json({ message: "Weekly report not found" });
    }

    logger.info(`Weekly report updated: ${updatedReport._id}`);
    res.status(200).json(updatedReport);
  } catch (error) {
    next(error);
  }
};

// @desc   Soft delete a weekly report
// @route  DELETE /api/weekly-reports/:id
exports.deleteWeeklyReport = async (req, res, next) => {
  try {
    const report = await WeeklyReport.findById(req.params.id);

    if (!report || report.isDeleted) {
      return res.status(404).json({ message: "Weekly report not found or already deleted" });
    }

    report.isDeleted = true;
    report.deletedAt = new Date();
    await report.save();

    logger.info(`Weekly report soft deleted: ${report._id}`);
    res.status(200).json({ message: "Weekly report deleted successfully" });
  } catch (error) {
    next(error);
  }
};
