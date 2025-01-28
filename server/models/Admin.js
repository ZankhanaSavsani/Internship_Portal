const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // For generating random passwords

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, 
    unique: true,
  },
  adminName: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "admin",
    required: true,
  },
});

// Pre-save hook to generate password and hash it
userSchema.pre("save", async function (next) {
  // Generate a random password 
    const randomPassword = crypto.randomBytes(8).toString("hex"); // Random 16-character password
    this.password = randomPassword;
  
    // Hash the password before saving
    this.password = await bcrypt.hash(this.password, 10);

  next();
});

module.exports = mongoose.model("Admin", adminSchema);
