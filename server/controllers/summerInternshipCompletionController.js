const logger = require("../utils/logger");
const SummerInternshipCompletionStatus = require("../models/SummerInternshipCompletionFormModel");

// @desc   Get all internship completion statuses
// @route  GET /api/summer-internships-completion
exports.getAllInternshipCompletionStatuses = async (req, res, next) => {
  try {
    // Extract page and limit from query params, defaulting to page 1 and 10 items per page
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit; // Skip records based on the current page

    // Dynamic sorting
    const sortField = req.query.sortBy || 'createdAt'; // Default sorting by createdAt
    const sortOrder = req.query.order || 'desc'; // Default order is descending
    const sortOptions = { [sortField]: sortOrder === 'desc' ? -1 : 1 };

    // Dynamic filtering based on query params
    const filterOptions = {};
    if (req.query.companyName) {
      filterOptions.companyName = { $regex: req.query.companyName, $options: 'i' }; // Case-insensitive search
    }
    if (req.query.studentName) {
      filterOptions.studentName = { $regex: req.query.studentName, $options: 'i' }; // Case-insensitive search by student name
    }

    // Find internship completion statuses with pagination, sorting, and filtering
    const statuses = await SummerInternshipCompletionStatus.find(filterOptions)
      .populate("student", "name email") // Optionally populate student data
      .populate("company", "companyName companyAddress") // Optionally populate company data
      .sort(sortOptions) // Apply sorting
      .skip(skip) // Skip the records based on the current page
      .limit(limit); // Limit the number of records returned

    // Get the total number of matching records (without pagination)
    const total = await SummerInternshipCompletionStatus.countDocuments(filterOptions);

    // Respond with paginated data, including filtering and sorting details
    res.status(200).json({
      total, // Total number of records in the collection
      page, // Current page
      pages: Math.ceil(total / limit), // Total number of pages
      data: statuses, // The data for the current page
    });
  } catch (error) {
    next(error); // Forward any errors to the centralized error handler
  }
};


// Get a specific internship completion status by ID
exports.getInternshipCompletionStatusById = async (req, res) => {
  try {
    const status = await SummerInternshipCompletionStatus.findById(
      req.params.id
    )
      .populate("student", "name email")
      .populate("company", "companyName companyAddress");

    if (!status) {
      return res.status(404).json({ message: "Internship status not found" });
    }

    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

// Create a new internship completion status
exports.createInternshipCompletionStatus = async (req, res) => {
  try {
    const newStatus = await SummerInternshipCompletionStatus.create(req.body);
    res.status(201).json(newStatus);
  } catch (error) {
    next(error);
  }
};

// Update an internship completion status by ID
exports.updateInternshipCompletionStatus = async (req, res) => {
  try {
    const updatedStatus =
      await SummerInternshipCompletionStatus.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

    if (!updatedStatus) {
      return res.status(404).json({ message: "Internship status not found" });
    }

    res.status(200).json(updatedStatus);
  } catch (error) {
    next(error);
  }
};

// Delete an internship completion status by ID
exports.deleteInternshipCompletionStatus = async (req, res) => {
  try {
    const deletedStatus =
      await SummerInternshipCompletionStatus.findByIdAndDelete(req.params.id);

    if (!deletedStatus) {
      return res.status(404).json({ message: "Internship status not found" });
    }

    res.status(200).json({ message: "Internship status deleted successfully" });
  } catch (error) {
    next(error);
  }
};
