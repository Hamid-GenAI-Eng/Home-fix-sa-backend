const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendLoginEmail } = require('../config/nodemailer');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    if (user) {
      // Send Welcome/Login Email
      // Note: We don't await this to keep response fast
      sendLoginEmail(user.email, user.firstName);
      
      res.status(201).json({
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate User & Get Token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Update User Stats
      user.loginCount += 1;
      user.lastLogin = Date.now();
      await user.save();

      // Send Login Notification
      sendLoginEmail(user.email, user.firstName);

      res.json({
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Handle Google Auth Callback
// @route   GET /api/auth/google/callback
exports.googleCallback = async (req, res) => {
    // Passport attaches the authenticated user to req.user
    const user = req.user;
    
    // Update stats
    user.loginCount += 1;
    user.lastLogin = Date.now();
    await user.save();

    // Send Login Notification
    sendLoginEmail(user.email, user.firstName);
    
    const token = generateToken(user._id);

    // Redirect to frontend (Change URL to your actual frontend)
    // We pass the token in the URL params
    res.redirect(`http://localhost:3000/login/success?token=${token}`);
};