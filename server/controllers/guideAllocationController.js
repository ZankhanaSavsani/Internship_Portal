const GuideAllocation = require("../models/GuideAllocationModel");
const Student = require("../models/StudentModel");
const Guide = require("../models/GuideModel");
const StudentInternship = require("../models/StudentInternshipModel"); // Import the new model

// Helper function to parse student ID range
function parseStudentIdRange(range) {
  const [startId, endId] = range.split("-");

  if (!startId || !endId) {
    throw new Error("Invalid range format. Expected format: 22cs078-22cs082");
  }

  const startYear = startId.slice(0, 2);
  const startDept = startId.slice(2, 4);
  const startDigits = parseInt(startId.slice(4), 10);

  const endYear = endId.slice(0, 2);
  const endDept = endId.slice(2, 4);
  const endDigits = parseInt(endId.slice(4), 10);

  if (startYear !== endYear || startDept !== endDept) {
    throw new Error("Year and department must be the same in the range.");
  }

  if (startDigits > endDigits) {
    throw new Error("Start digits must be less than or equal to end digits.");
  }

  return { year: startYear, dept: startDept, startDigits, endDigits };
}

// Helper function to generate student IDs
function generateStudentIds(year, dept, startDigits, endDigits) {
  const studentIds = [];
  for (let i = startDigits; i <= endDigits; i++) {
    const digits = i.toString().padStart(3, "0"); // Ensure 3 digits (e.g., 078)
    studentIds.push(`${year}${dept}${digits}`);
  }
  return studentIds;
}

// Allocate guide to a range of students
exports.allocateGuideToRange = async (req, res, next) => {
  const { range, guideId, semester } = req.body;

  try {
    const { year, dept, startDigits, endDigits } = parseStudentIdRange(range);
    const studentIds = generateStudentIds(year, dept, startDigits, endDigits);

    // Find the corresponding Student documents
    const students = await Student.find({ studentId: { $in: studentIds } });

    // Check if the guide exists
    const guide = await Guide.findById(guideId);
    if (!guide) {
      throw new Error("Guide not found.");
    }

    // Create or update StudentInternship documents for each student
    for (const student of students) {
      await StudentInternship.findOneAndUpdate(
        { student: student._id, semester },
        { guide: guideId, semester },
        { upsert: true }
      );
    }

    // Determine which students were not found
    const existingStudentIds = students.map((student) => student.studentId);
    const missingStudentIds = studentIds.filter(
      (id) => !existingStudentIds.includes(id)
    );

    // Create a GuideAllocation document
    const guideAllocation = await GuideAllocation.findOneAndUpdate(
      { guide: guideId, semester },
      { range, semester },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      data: guideAllocation,
      missingStudents: missingStudentIds, // List of student IDs that were not found
    });
  } catch (error) {
    next(error);
  }
};

// Fetch all guide allocations
exports.getAllGuideAllocations = async (req, res, next) => {
  try {
    const guideAllocations = await GuideAllocation.find().populate("guide");
    res.status(200).json({
      success: true,
      data: guideAllocations,
    });
  } catch (error) {
    next(error);
  }
};
