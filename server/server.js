const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')
require('dotenv').config();

const app = express();

app.use(cors());

// Connect to MongoDB
connectDB(); // Call the connectDB function from db.js

const PORT = process.env.PORT || 4000 ; 

// Start the server only after the DB connection
app.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});
