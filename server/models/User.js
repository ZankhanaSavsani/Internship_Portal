const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // For generating random passwords

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true},
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'guide'], required: true },
});

// Pre-save hook to generate password and hash it
userSchema.pre('save', async function (next) {
  // Auto-generate a password if not provided
  if (!this.password) {
    const randomPassword = crypto.randomBytes(8).toString('hex'); // Generate an 8-byte random password
    this.password = randomPassword;
  }

  // Hash the password before saving
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

module.exports = mongoose.model('User', userSchema);
