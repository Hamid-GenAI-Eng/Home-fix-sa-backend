const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

dotenv.config();
require('./config/passport')(passport); 
const authRoutes = require('./routes/authRoutes');

const app = express();
app.set('trust proxy', 1);

app.use(express.json());
app.use(cors());

// --- THE DATABASE CONNECTION FUNCTION ---
const connectDB = async () => {
    try {
        // 0 = disconnected, 1 = connected, 2 = connecting
        if (mongoose.connection.readyState >= 1) {
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

// --- FIX: MIDDLEWARE TO WAIT FOR DB ---
// This forces every request to wait until DB is connected before moving on
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});



module.exports = app;