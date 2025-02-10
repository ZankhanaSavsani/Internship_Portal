const express = require("express");
const router = express.Router();
const InternshipGroup = require("../models/internshipGroupModel");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/students", verifyToken, async (req, res) => {
  try {
    const guideId = req.user.id;

    const groups = await InternshipGroup.find({ guide: guideId })
      .populate("students.studentId", "name email")
      .select("students");

    if (!groups.length) {
      return res.status(404).json({ message: "No students found for this guide" });
    }

    const students = groups.flatMap(group => group.students);

    res.json({
      guideId,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;