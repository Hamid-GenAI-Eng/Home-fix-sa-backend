const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

// Load Config
dotenv.config();

// Important: Load Passport Config
require('./config/passport')(passport); 

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // You might need to configure specific origins for production
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);

// Root Route (Optional: Good for checking if the server is running)
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Database Connection
// In serverless, we check if the connection exists to prevent multiple connections
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

// Connect to DB immediately
connectDB();

module.exports = app;