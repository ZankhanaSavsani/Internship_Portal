const WeeklyReport = require("../models/WeeklyProgressReportModel");
const logger = require("../utils/logger");
const mongoose = require("mongoose");
const StudentInternship = require("../models/StudentInternshipModel");

// @desc   Create a new weekly report
// @route  POST /api/weekly-reports
exports.createWeeklyReport = async (req, res, next) => {
    try {
      const student = req.user._id;
      const studentName = req.user.studentName;
  
      if (!student || !studentName) {
        logger.error("[POST /api/weeklyReport] Invalid user!!");
        return res.status(400).json({ success: false, message: "Invalid user!!" });
      }
  
      // Add student and studentName to the request body
      const reportData = {
        ...req.body,
        student: student, // Use _id as the student reference
        studentName: studentName, // Use the student's name from the user data
      };
  
      // Create the new approval
      const newReport = await WeeklyReport.create(reportData);
      
      // Find the corresponding StudentInternship document
          const studentInternship = await StudentInternship.findOne({ student });
      
          if (!studentInternship) {
            return res.status(404).json({
              success: false,
              message: "Student internship record not found.",
            });
          }
      
          // Push the new weekly Report ObjectId into the weeklyReports array
          studentInternship.weeklyReports.push(newReport._id);
      
          // Save the updated StudentInternship document
          await studentInternship.save();

      logger.info(`[POST /api/weeklyReport] Created ID: ${newReport._id}`);
  
      res.status(201).json({ success: true, data: newReport });
    } catch (error) {
      logger.error(`[POST /api/weeklyReport] Error: ${error.message}`);
      next(error);
    }
};

// @desc   Get all weekly reports (including soft-deleted ones if requested)
// @route  GET /api/weekly-reports
exports.getAllWeeklyReports = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit of 10

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    const skip = (page - 1) * limit;

    // Dynamic sorting
    const validSortFields = ["createdAt", "studentName", "reportWeek"];
    const sortField = validSortFields.includes(req.query.sortBy)
      ? req.query.sortBy
      : "createdAt"; // Default sorting by createdAt
    const sortOrder = req.query.order === "desc" ? -1 : 1;
    const sortOptions = { [sortField]: sortOrder };

    // Dynamic filtering
    const filterOptions = {};

    // Include/exclude soft-deleted records based on the `includeDeleted` query parameter
    if (req.query.includeDeleted !== "true") {
      filterOptions.isDeleted = false; // Exclude soft-deleted records by default
    }

    // Add filters for studentName, reportWeek, and approvalStatus
    if (req.query.studentName) {
      filterOptions.studentName = { $regex: req.query.studentName, $options: "i" };
    }
    if (req.query.reportWeek) {
      filterOptions.reportWeek = parseInt(req.query.reportWeek); // Filter by report week
    }
    if (req.query.approvalStatus) {
      filterOptions.approvalStatus = req.query.approvalStatus; // Filter by approval status
    }

    // Fetch weekly reports with filtering, sorting, and pagination
    const reports = await WeeklyReport.find(filterOptions)
      .populate("student", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Count total documents matching the filter
    const total = await WeeklyReport.countDocuments(filterOptions);

    // Send response
    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: reports,
    });
  } catch (error) {
    logger.error(`[GET /api/weekly-reports] Error: ${error.message}`);
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

// @desc   Update approval status and rejection reason
// @route  PATCH /api/weekly-reports/:id/approval
exports.updateApprovalStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    const { approvalStatus, comments } = req.body;

    // Validate input
    if (!approvalStatus || !["Pending", "Approved", "Rejected"].includes(approvalStatus)) {
      return res.status(400).json({ message: "Invalid approval status" });
    }

    if (approvalStatus === "Rejected" && !comments) {
      return res.status(400).json({ message: "Comments are required for rejected status" });
    }

    // Find the weekly report by ID
    const report = await WeeklyReport.findById(id);

    if (!report || report.isDeleted) {
      return res.status(404).json({ message: "Weekly report not found" });
    }

    // Update the approval status and comments
    report.approvalStatus = approvalStatus;
    report.comments = approvalStatus === "Rejected" ? comments : null;

    // Save the updated document
    await report.save();

    logger.info(`[PATCH /api/weekly-reports/${id}/approval] Updated approval status`);
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    logger.error(`[PATCH /api/weekly-reports/${req.params.id}/approval] Error: ${error.message}`);
    next(error);
  }
};

// @desc   Add marks to a weekly report
// @route  PATCH /api/weekly-reports/:id/marks
exports.addMarks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { marks } = req.body;

    // Validate input
    if (marks === undefined || marks < 0 || marks > 10) {
      return res.status(400).json({ message: "Marks must be between 0 and 10" });
    }

    // Find the weekly report by ID
    const report = await WeeklyReport.findById(id);

    if (!report || report.isDeleted) {
      return res.status(404).json({ message: "Weekly report not found" });
    }

    // Update the marks
    report.marks = marks;

    // Save the updated document
    await report.save();

    logger.info(`[PATCH /api/weekly-reports/${id}/marks] Updated marks`);
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    logger.error(`[PATCH /api/weekly-reports/${id}/marks] Error: ${error.message}`);
    next(error);
  }
};

// @desc   Restore a soft-deleted weekly report
// @route  PATCH /api/weekly-reports/:id/restore
exports.restoreWeeklyReport = async (req, res, next) => {
  try {
    const report = await WeeklyReport.findOne({
      _id: req.params.id,
      isDeleted: true, // Only restore if it's soft-deleted
    });

    if (!report) {
      logger.error(`[PATCH /api/weekly-reports/${req.params.id}/restore] Not Found`);
      return res.status(404).json({ success: false, message: "Weekly report not found or not soft-deleted" });
    }

    // Restore the record
    report.isDeleted = false;
    report.deletedAt = null;
    await report.save();

    logger.info(`[PATCH /api/weekly-reports/${req.params.id}/restore] Restored`);
    res.status(200).json({ success: true, message: "Weekly report restored successfully", data: report });
  } catch (error) {
    logger.error(`[PATCH /api/weekly-reports/${req.params.id}/restore] Error: ${error.message}`);
    next(error);
  }
};
