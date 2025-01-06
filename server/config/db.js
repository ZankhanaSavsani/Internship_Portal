// db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI; // Fetch the connection string from environment variables

    await mongoose.connect(mongoURI);

    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit process with failure code
  }
};

module.exports = connectDB;
