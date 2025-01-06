const Student = require('../models/Student');
const { sendEmail } = require('../utils/mailer'); 

// Controller to create a Student
async function createStudent(req, res) {
  try {
    const { username } = req.body;

    // Check if the student already exists
    const existingStudent = await Student.findOne({ username });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists!' });
    }

    // Create a new student (password and email will be handled by the model)
    const newStudent = new Student({
      username,
    });
    await newStudent.save();

    // Send the email to the student with their account details
    const emailContent = `Your account has been created. Your username is: ${username}, and your password is: ${newStudent.password}`;
    await sendEmail(newStudent.email, 'Account Created', emailContent);

    return res.status(201).json({
      success: true,
      message: 'Student created successfully.',
      email: newStudent.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating student.' });
  }
}

module.exports = { createStudent };
