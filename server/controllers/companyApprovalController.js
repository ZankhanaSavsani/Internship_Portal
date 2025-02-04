const logger = require("../utils/logger");
const CompanyApprovalDetails = require("../models/CompanyApprovalForm");

// @desc   Get a single company approval by ID
// @route  GET /api/company-approvals/:id
exports.getCompanyApprovalById = async (req, res, next) => {
  try {
    const approval = await CompanyApprovalDetails.findById(req.params.id);
    if (!approval) {
      logger.error(`Approval ID ${req.params.id} not found`);
      return res.status(404).json({ message: "Approval record not found" });
    }
    res.status(200).json(approval);
  } catch (error) {
    logger.error(`Error fetching approval: ${error.message}`);
    next(error); // Pass the error to the centralized handler
  }
};

// @desc   Get all company approvals (with pagination)
// @route  GET /api/company-approvals
exports.getAllCompanyApprovals = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const approvals = await CompanyApprovalDetails.find()
      .populate("student", "name email")
      .skip(skip)
      .limit(limit);

    const total = await CompanyApprovalDetails.countDocuments();
    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: approvals,
    });
  } catch (error) {
    next(error); // Pass the error to the centralized handler
  }
};

// @desc   Create a new company approval request
// @route  POST /api/company-approvals
exports.createCompanyApproval = async (req, res, next) => {
  try {
    const newApproval = await CompanyApprovalDetails.create(req.body);
    logger.info(`New company approval created: ${newApproval._id}`);
    res.status(201).json(newApproval);
  } catch (error) {
    logger.error(`Error creating approval: ${error.message}`);
    next(error); // Pass the error to the centralized handler
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
        return res.status(404).json({ message: "Approval record not found" });
      }
  
      // Log the update action
      logger.info(`Company approval updated: ${updatedApproval._id}`);
      res.status(200).json(updatedApproval);
    } catch (error) {
      logger.error(`Error updating approval: ${error.message}`);
      next(error);
    }
  };
  

// @desc   Delete a company approval request
// @route  DELETE /api/company-approvals/:id
exports.deleteCompanyApproval = async (req, res, next) => {
  try {
    const deletedApproval = await CompanyApprovalDetails.findByIdAndDelete(
      req.params.id
    );

    if (!deletedApproval) {
      return res.status(404).json({ message: "Approval record not found" });
    }

    res.status(200).json({ message: "Approval record deleted successfully" });
  } catch (error) {
    next(error);
  }
};
