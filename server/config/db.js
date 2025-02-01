const mongoose = require('mongoose');
require('dotenv').config();

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxRetries: 3,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

let retryAttempts = options.maxRetries;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MongoDB connection string is not defined in environment variables');
    }

    // Connect to MongoDB
    const connection = await mongoose.connect(mongoURI, options);
    console.log(`MongoDB connected: ${connection.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB connection closure:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);

    if (retryAttempts > 0) {
      retryAttempts--;
      const backoffTime = Math.pow(2, options.maxRetries - retryAttempts) * 1000; // Exponential backoff
      console.log(`Retrying connection... (${retryAttempts} attempts remaining). Next retry in ${backoffTime / 1000}s.`);
      setTimeout(connectDB, backoffTime); // Retry with exponential backoff
    } else {
      console.error('Maximum retry attempts reached. Exiting process...');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
