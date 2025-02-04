const SummerInternshipStatus = require("../models/SummerInternshipStatusFormModel");
const logger = require("../utils/logger");

// @desc   Get all internship statuses
// @route  GET /api/summer-internships
exports.getAllInternshipStatuses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default limit 10 if not provided
    const skip = (page - 1) * limit; // Calculate skip value

    // Dynamic sorting
    const sortField = req.query.sortBy || 'createdAt'; // Default sorting by createdAt
    const sortOrder = req.query.order || 'desc'; // Default order is descending
    const sortOptions = { [sortField]: sortOrder === 'desc' ? -1 : 1 };

    // Dynamic filtering based on query params
    const filterOptions = {};
    if (req.query.companyName) {
      filterOptions.companyName = { $regex: req.query.companyName, $options: 'i' }; // Case-insensitive search
    }
    if (req.query.typeOfInternship) {
      filterOptions.typeOfInternship = req.query.typeOfInternship; // Filter by type of internship
    }

    // Fetch internship statuses from the database with pagination, sorting, and filtering
    const statuses = await SummerInternshipStatus.find(filterOptions)
      .populate("student", "name email") // Populate student details
      .sort(sortOptions) // Apply sorting
      .skip(skip) // Apply pagination by skipping records
      .limit(limit); // Limit the number of records returned

    // Count the total number of matching documents (without pagination)
    const total = await SummerInternshipStatus.countDocuments(filterOptions);

    // Send the response with pagination and filtered data
    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit), // Calculate the total number of pages
      data: statuses, // Send the fetched data
    });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};


// @desc   Get internship status by ID
// @route  GET /api/summer-internships/:id
exports.getInternshipStatusById = async (req, res, next) => {
  try {
    const status = await SummerInternshipStatus.findById(req.params.id);
    if (!status) {
      logger.error(`Internship status ID ${req.params.id} not found`);
      return res.status(404).json({ message: "Internship status not found" });
    }
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

// @desc   Create a new internship status
// @route  POST /api/summer-internships
exports.createInternshipStatus = async (req, res) => {
  try {
    const newStatus = await SummerInternshipStatus.create(req.body);
    res.status(201).json(newStatus);
  } catch (error) {
    next(error);
  }
};

// @desc   Update an internship status
// @route  PUT /api/summer-internships/:id
exports.updateInternshipStatus = async (req, res) => {
    try {
      // Add runValidators: true to ensure schema validation during update
      const updatedStatus = await SummerInternshipStatus.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true } // runValidators ensures validation rules are applied
      );
  
      if (!updatedStatus) {
        return res.status(404).json({ message: "Internship status not found" });
      }
  
      res.status(200).json(updatedStatus);
    } catch (error) {
        next(error);
    }
  };
  

// @desc   Delete an internship status
// @route  DELETE /api/summer-internships/:id
exports.deleteInternshipStatus = async (req, res) => {
  try {
    const deletedStatus = await SummerInternshipStatus.findByIdAndDelete(
      req.params.id
    );
    if (!deletedStatus) {
      return res.status(404).json({ message: "Internship status not found" });
    }
    res.status(200).json({ message: "Internship status deleted successfully" });
  } catch (error) {
    next(error);
  }
};
