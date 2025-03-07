const logger = require("../utils/logger");
const CompanyApprovalDetails = require("../models/CompanyApprovalFormModel");
// const StudentModel = require("../models/StudentModel"); 

// @desc   Get a single company approval by ID (excluding soft-deleted records)
// @route  GET /api/company-approvals/:id
exports.getCompanyApprovalById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      logger.error(`[GET /api/company-approvals/${req.params.id}] Invalid ID`);
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const approval = await CompanyApprovalDetails.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("student", "name email");

    if (!approval) {
      logger.error(`[GET /api/company-approvals/${req.params.id}] Not Found`);
      return res.status(404).json({ success: false, message: "Approval record not found" });
    }

    res.status(200).json({ success: true, data: approval });
  } catch (error) {
    logger.error(`[GET /api/company-approvals/${req.params.id}] Error: ${error.message}`);
    next(error);
  }
};

// @desc   Get all company approvals with pagination, sorting, and filtering (excluding soft-deleted records)
// @route  GET /api/company-approvals
exports.getAllCompanyApprovals = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Add a max limit
    const skip = (page - 1) * limit;

    // Dynamic sorting
    const sortField = req.query.sortBy || "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;
    const sortOptions = { [sortField]: sortOrder };

    // Dynamic filtering
    const filterOptions = { isDeleted: false };
    if (req.query.companyName) {
      filterOptions.companyName = { $regex: req.query.companyName, $options: "i" };
    }
    if (req.query.studentName) {
      filterOptions.studentName = { $regex: req.query.studentName, $options: "i" };
    }
    if (req.query.status) {
      filterOptions.approvalStatus = req.query.status; // Use approvalStatus directly
    }

    const approvals = await CompanyApprovalDetails.find(filterOptions)
      .populate("student", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await CompanyApprovalDetails.countDocuments(filterOptions);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: approvals,
    });
  } catch (error) {
    logger.error(`[GET /api/company-approvals] Error: ${error.message}`);
    next(error);
  }
};

// @desc   Create a new company approval request
// @route  POST /api/company-approvals

exports.createCompanyApproval = async (req, res, next) => {
  try {
    const student = req.user.id;
    const {studentName} = req.body;

    if (!student || !studentName) {
      logger.error("[POST /api/company-approvals] Invalid user!!");
      return res.status(400).json({ success: false, message: "Invalid user!!" });
    }

    // Add student and studentName to the request body
    const approvalData = {
      ...req.body,
      studentId: student, // Use _id as the student reference
      studentName: studentName, // Use the student's name from the user data
    };

    // Create the new approval
    const newApproval = await CompanyApprovalDetails.create(approvalData);
    logger.info(`[POST /api/company-approvals] Created ID: ${newApproval._id}`);

    res.status(201).json({ success: true, data: newApproval });
  } catch (error) {
    logger.error(`[POST /api/company-approvals] Error: ${error.message}`);
    next(error);
  }
};

// @desc   Update a company approval request (excluding soft-deleted records)
// @route  PUT /api/company-approvals/:id
exports.updateCompanyApproval = async (req, res, next) => {
  try {
    const updatedApproval = await CompanyApprovalDetails.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedApproval) {
      logger.error(`[PUT /api/company-approvals/${req.params.id}] Not Found`);
      return res.status(404).json({ success: false, message: "Approval record not found" });
    }

    logger.info(`[PUT /api/company-approvals/${req.params.id}] Updated`);
    res.status(200).json({ success: true, data: updatedApproval });
  } catch (error) {
    logger.error(`[PUT /api/company-approvals/${req.params.id}] Error: ${error.message}`);
    next(error);
  }
};

// @desc   Soft delete a company approval request
// @route  DELETE /api/company-approvals/:id
exports.deleteCompanyApproval = async (req, res, next) => {
  try {
    const approval = await CompanyApprovalDetails.findById(req.params.id);

    if (!approval || approval.isDeleted) {
      logger.error(`[DELETE /api/company-approvals/${req.params.id}] Not Found`);
      return res.status(404).json({ success: false, message: "Approval record not found or already deleted" });
    }

    approval.isDeleted = true;
    approval.deletedAt = new Date();
    await approval.save();

    logger.info(`[DELETE /api/company-approvals/${req.params.id}] Soft Deleted`);
    res.status(200).json({ success: true, message: "Approval record deleted successfully" });
  } catch (error) {
    logger.error(`[DELETE /api/company-approvals/${req.params.id}] Error: ${error.message}`);
    next(error);
  }
};
