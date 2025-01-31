const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // For generating random passwords
const comparePassword = require("./passwordUtils"); // Import the function

const guideSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    guideName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "guide",
      enum: ["guide"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate password and hash it
guideSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next(); // Only hash if password is modified

  // Generate a random password
  const randomPassword = crypto.randomBytes(8).toString("hex"); 
  this.password = randomPassword;

  // Hash the password before saving
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

guideSchema.methods.comparePassword = comparePassword;

const Guide = mongoose.model("Guide", guideSchema);

module.exports = Guide;
