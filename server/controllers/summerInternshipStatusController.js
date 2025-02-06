const SummerInternshipStatus = require("../models/SummerInternshipStatusFormModel");
const logger = require("../utils/logger");

// @desc   Get all internship statuses (excluding soft-deleted ones)
// @route  GET /api/summer-internships
exports.getAllInternshipStatuses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit of 10
    const skip = (page - 1) * limit; // Calculate records to skip

    // Dynamic sorting
    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const sortOptions = { [sortField]: sortOrder };

    // Dynamic filtering
    const filterOptions = { isDeleted: false }; // Exclude soft-deleted records
    if (req.query.companyName) {
      filterOptions.companyName = { $regex: req.query.companyName, $options: 'i' };
    }
    if (req.query.typeOfInternship) {
      filterOptions.typeOfInternship = req.query.typeOfInternship;
    }

    // Fetch internship statuses
    const statuses = await SummerInternshipStatus.find(filterOptions)
      .populate("student", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await SummerInternshipStatus.countDocuments(filterOptions);

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: statuses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get internship status by ID
// @route  GET /api/summer-internships/:id
exports.getInternshipStatusById = async (req, res, next) => {
  try {
    const status = await SummerInternshipStatus.findById(req.params.id);
    if (!status || status.isDeleted) {
      logger.error(`Internship status ID ${req.params.id} not found or deleted`);
      return res.status(404).json({ message: "Internship status not found" });
    }
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

// @desc   Create a new internship status
// @route  POST /api/summer-internships
exports.createInternshipStatus = async (req, res, next) => {
  try {
    const newStatus = await SummerInternshipStatus.create(req.body);
    res.status(201).json(newStatus);
  } catch (error) {
    next(error);
  }
};

// @desc   Update an internship status
// @route  PUT /api/summer-internships/:id
exports.updateInternshipStatus = async (req, res, next) => {
  try {
    const updatedStatus = await SummerInternshipStatus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStatus || updatedStatus.isDeleted) {
      return res.status(404).json({ message: "Internship status not found" });
    }

    res.status(200).json(updatedStatus);
  } catch (error) {
    next(error);
  }
};

// @desc   Soft delete an internship status
// @route  DELETE /api/summer-internships/:id
exports.deleteInternshipStatus = async (req, res, next) => {
  try {
    const status = await SummerInternshipStatus.findById(req.params.id);

    if (!status || status.isDeleted) {
      return res.status(404).json({ message: "Internship status not found or already deleted" });
    }

    status.isDeleted = true;
    status.deletedAt = new Date();
    await status.save();

    logger.info(`Internship status soft deleted: ${status._id}`);
    res.status(200).json({ message: "Internship status deleted successfully" });
  } catch (error) {
    next(error);
  }
};
