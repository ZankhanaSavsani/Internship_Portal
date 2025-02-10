const mongoose = require("mongoose");

const internshipGroupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
      match: /^[a-zA-Z0-9 ]+$/,
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      required: true,
    },
    students: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
      },
    ],
    weeklyReports: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "WeeklyReport",
      default: [],
    },
    companyApprovalDetails: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "CompanyApprovalDetails",
      default: [],
    },
    summerInternshipStatus: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "SummerInternshipStatus",
      default: [],
    },
    summerInternshipCompletionStatus: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "SummerInternshipCompletionStatus",
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
internshipGroupSchema.index({ guide: 1 });
internshipGroupSchema.index({ "students.studentId": 1 });

// Soft delete pre-hook
internshipGroupSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

const InternshipGroup = mongoose.model("InternshipGroup", internshipGroupSchema);

module.exports = InternshipGroup;