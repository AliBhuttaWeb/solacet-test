const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
// TODO: Implement user login (MEDIUM TASK)
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // TODO: Implement user login logic
    // 1. Find user by email
    // 2. Compare password using user.comparePassword()
    // 3. Generate JWT token
    // 4. Return user data and token (exclude password)
    //
    // HINT: const { email, password } = req.body;
    //       const user = await User.findOne({ email });
    //       if (!user || !(await user.comparePassword(password))) {
    //         return res.status(401).json({ message: 'Invalid credentials' });
    //       }
    //       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    //       res.json({ token, user: { name: user.name, email: user.email, role: user.role } });

    res.status(501).json({ message: 'Login endpoint not implemented yet' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 