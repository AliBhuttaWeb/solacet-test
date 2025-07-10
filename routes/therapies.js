const express = require('express');
const Therapy = require('../models/Therapy');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/therapies
// @desc    Get all therapies
// @access  Public
// TODO: Implement get all therapies (EASY TASK)
router.get('/', async (req, res) => {
  try {

    res.status(501).json({ message: 'Get therapies endpoint not implemented yet' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/therapies/:id
// @desc    Get therapy by ID
// @access  Public
// TODO: Implement get therapy by ID (EASY TASK)
router.get('/:id', async (req, res) => {
  try {

    res.status(501).json({ message: 'Get therapy by ID endpoint not implemented yet' });
  } catch (error) {
    console.error(error);
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid therapy ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/therapies
// @desc    Create a new therapy
// @access  Private (therapist only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is therapist
    if (req.user.role !== 'therapist') {
      return res.status(403).json({ message: 'Only therapists can create therapies' });
    }

    const { title, description, category, duration } = req.body;

    const therapy = new Therapy({
      title,
      description,
      category,
      duration,
      createdBy: req.user._id
    });

    await therapy.save();
    await therapy.populate('createdBy', 'name email');

    res.status(201).json(therapy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 