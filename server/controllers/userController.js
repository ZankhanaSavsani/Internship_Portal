const User = require('../models/User');
const { sendEmail } = require('../utils/mailer'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Controller to create a User (Admin or Guide)
async function createUser(req, res) {
  try {
    const { username, email, role } = req.body;

    // Check if the role is valid
    if (!['admin', 'guide'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role! Use "admin" or "guide".' });
    }

    // Create a new user (admin or guide)
    const newUser = new User({
      username,
      email,
      role,
    });
    await newUser.save();

    // Send the auto-generated password to the user's email
    const emailContent = `Your account has been created. Your username is: ${username}, and your password is: ${newUser.password}`;
    await sendEmail(email, 'Account Created', emailContent);

    return res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully.`,
      email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating user.' });
  }
}

module.exports = { createUser };

// Controller to login a User (Admin or Guide)
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials!' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful!', role: user.role, token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { loginUser };
