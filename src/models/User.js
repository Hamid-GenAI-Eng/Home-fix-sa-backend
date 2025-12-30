const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: [true, 'First name is required'] 
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'] 
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
  // 1. If password is not modified, return early (promisified)
  if (!this.isModified('password')) return;

  // 2. Generate Salt
  const salt = await bcrypt.genSalt(10);

  // 3. Hash the password
  this.password = await bcrypt.hash(this.password, salt);
  
  // No need to call next(); Mongoose waits for this async function to finish.
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);