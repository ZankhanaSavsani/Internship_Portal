const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // For generating random passwords

const studentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'student',
  },
});

// Pre-save hook to generate email and hash password
studentSchema.pre('save', async function (next) {
  // Automatically generate email from username
  if (this.username && !this.email) {
    this.email = `${this.username}@charusat.edu.in`;
  }

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

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
