const logger = require("../utils/logger");
const CompanyApprovalDetails = require("../models/CompanyApprovalFormModel");

// @desc   Get a single company approval by ID
// @route  GET /api/company-approvals/:id
exports.getCompanyApprovalById = async (req, res, next) => {
  try {
    const approval = await CompanyApprovalDetails.findById(req.params.id)
      .populate("student", "name email");

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

// @desc   Get all company approvals with pagination, sorting, and filtering
// @route  GET /api/company-approvals
exports.getAllCompanyApprovals = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Dynamic sorting
    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1; 
    const sortOptions = { [sortField]: sortOrder };

    // Dynamic filtering
    const filterOptions = {};
    if (req.query.companyName) {
      filterOptions.companyName = { $regex: req.query.companyName, $options: "i" };
    }
    if (req.query.studentName) {
      filterOptions.studentName = { $regex: req.query.studentName, $options: "i" };
    }
    if (req.query.status !== undefined) {
      filterOptions.status = req.query.status === 'true'; // Convert to boolean
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
    const newApproval = await CompanyApprovalDetails.create(req.body);
    logger.info(`[POST /api/company-approvals] Created ID: ${newApproval._id}`);
    
    res.status(201).json({ success: true, data: newApproval });
  } catch (error) {
    logger.error(`[POST /api/company-approvals] Error: ${error.message}`);
    next(error);
  }
};

// @desc   Update a company approval request
// @route  PUT /api/company-approvals/:id
exports.updateCompanyApproval = async (req, res, next) => {
  try {
    const updatedApproval = await CompanyApprovalDetails.findByIdAndUpdate(
      req.params.id,
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

// @desc   Delete a company approval request
// @route  DELETE /api/company-approvals/:id
exports.deleteCompanyApproval = async (req, res, next) => {
  try {
    const deletedApproval = await CompanyApprovalDetails.findByIdAndDelete(req.params.id);

    if (!deletedApproval) {
      logger.error(`[DELETE /api/company-approvals/${req.params.id}] Not Found`);
      return res.status(404).json({ success: false, message: "Approval record not found" });
    }

    logger.info(`[DELETE /api/company-approvals/${req.params.id}] Deleted`);
    res.status(200).json({ success: true, message: "Approval record deleted successfully" });
  } catch (error) {
    logger.error(`[DELETE /api/company-approvals/${req.params.id}] Error: ${error.message}`);
    next(error);
  }
};
