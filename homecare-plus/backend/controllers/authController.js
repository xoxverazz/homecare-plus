// Authentication Controller
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your_secret_key',
    { expiresIn: '7d' }
  );
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone_number, date_of_birth, gender } = req.body;
    
    // Validation
    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and full name are required'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    // Create user
    const result = await User.create({
      email,
      password,
      full_name,
      phone_number,
      date_of_birth,
      gender
    });
    
    if (result.success) {
      const token = generateToken(result.userId);
      
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          userId: result.userId,
          email,
          full_name
        }
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check if user has password (not Google-only account)
    if (!user.password_hash) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in with Google'
      });
    }
    
    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Update last login
    await User.updateLastLogin(user.user_id);
    
    // Generate token
    const token = generateToken(user.user_id);
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        userId: user.user_id,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
        profile_picture: user.profile_picture
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const result = await User.updateProfile(req.userId, updates);
    
    if (result.success) {
      const user = await User.findById(req.userId);
      res.json({
        success: true,
        message: result.message,
        user
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Verify token
exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: {
        userId: user.user_id,
        email: user.email,
        full_name: user.full_name,
        profile_picture: user.profile_picture
      }
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
