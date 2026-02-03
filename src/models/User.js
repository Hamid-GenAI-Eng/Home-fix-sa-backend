const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: [true, 'First name is required'] 
  },
  lastName: { 
    type: String
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: { 
    type: String,
    // Optional because Google users might not provide phone initially
  },
  password: { 
    type: String, 
    // Optional because Google users won't have a password
  },
  googleId: { 
    type: String 
  },
  // User Stats Fields (as per your requirement)
  loginCount: { 
    type: Number, 
    default: 0 
  },
  lastLogin: { 
    type: Date, 
    default: Date.now 
  },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function () {
  // 1. Only run if password is modified AND exists
  if (!this.isModified('password') || !this.password) {
    return; 
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
