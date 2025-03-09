// controllers/studentController.js
const Student = require("../models/StudentModel");
const logger = require("../utils/logger");
const { sendEmail } = require("../utils/mailer");
const crypto = require("crypto");

// @desc   Create a new student record
// @route  POST /api/students
exports.createStudent = async (req, res, next) => {
  try {
    const { studentId, semester } = req.body;

    // Generate random password before creating student
    const plainPassword = crypto.randomBytes(8).toString("hex");

    // Create the student with the plain password
    const student = new Student({
      studentId,
      semester,
      password: plainPassword, // This will be hashed in the pre-save hook
    });

    // Save the student to the database
    await student.save();
    logger.info(`[POST /api/students] Created student ID: ${student._id}`);

    // Prepare email content
    const emailSubject = "Your Login Credentials";
    const emailContent = `
      Hello,

      Your account has been created successfully. Below are your login credentials:

      Username: ${studentId}
      Password: ${plainPassword}

      Please change your password after logging in for the first time.

      Regards,
      Your Institution
    `;

    // Send email with credentials
    await sendEmail(student.email, emailSubject, emailContent);

    // Respond to the client
    res.status(201).json({
      success: true,
      data: {
        id: student._id,
        studentId: student.studentId,
        email: student.email,
      },
    });
  } catch (error) {
    logger.error(`[POST /api/students] Error: ${error.message}`);
    next(error);
  }
};

// @desc   Get all students
// @route  GET /api/students
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ isDeleted: false });
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    logger.error(`[GET /api/students] Error: ${error.message}`);
    next(error);
  }
};

// @desc   Get student by ID
// @route  GET /api/students/:id
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).where({
      isDeleted: false,
    });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    logger.error(
      `[GET /api/students/${req.params.id}] Error: ${error.message}`
    );
    next(error);
  }
};

// @desc   Update a student record
// @route  PUT /api/students/:id
exports.updateStudent = async (req, res, next) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: updatedStudent });
  } catch (error) {
    logger.error(
      `[PUT /api/students/${req.params.id}] Error: ${error.message}`
    );
    next(error);
  }
};

// @desc   Update student name and onboarding status
// @route  PATCH /api/students/:id
exports.updateStudentName = async (req, res) => {
  try {
    const id  = req.user._id;
    const { studentName, isOnboarded } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { studentName, isOnboarded },
      { new: true } // Return the updated document
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: updatedStudent });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// @desc   Soft delete a student record
// @route  DELETE /api/students/:id
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student || student.isDeleted) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Student not found or already deleted",
        });
    }

    student.isDeleted = true;
    student.deletedAt = new Date();
    await student.save();

    res
      .status(200)
      .json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    logger.error(
      `[DELETE /api/students/${req.params.id}] Error: ${error.message}`
    );
    next(error);
  }
};
