const express = require('express');
const passport = require('passport');
const { signup, login, googleCallback } = require('../controllers/authController');

const router = express.Router();

// Local Auth Routes
router.post('/signup', signup);
router.post('/login', login);

// Google Auth Routes
// 1. Triggers the Google Login Screen
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Google redirects here after user consents
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

module.exports = router;