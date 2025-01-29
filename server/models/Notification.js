const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "recipientType",
      required: true, // Can be Student, Guide, or Admin
    },
    recipientType: {
      type: String,
      enum: ["Student", "Guide", "Admin"],
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderType",
      required: true,
    },
    senderType: {
      type: String,
      enum: ["Admin", "Guide"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedEntity: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "entityType", // Links to WeeklyReport, CompanyApprovalDetails, etc.
      default: null,
    },
    entityType: {
      type: String,
      enum: ["WeeklyReport", "CompanyApprovalDetails", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
