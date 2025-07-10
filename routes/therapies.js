const express = require('express');
const Therapy = require('../models/Therapy');
const Module = require('../models/Module');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/therapies
// @desc    Get all therapies
// @access  Public
// TODO: Implement get all therapies (EASY TASK)
router.get('/', async (req, res) => {
  try {
    // TODO: Implement logic to fetch all therapies
    // 1. Use Therapy.find() to get all therapies
    // 2. Populate the createdBy field to show creator name
    // 3. Return the therapies

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
    // TODO: Implement logic to fetch therapy by ID
    // 1. Use Therapy.findById() to get therapy
    // 2. Populate the createdBy field
    // 3. Return 404 if therapy not found
    // 4. Return the therapy

    res.status(501).json({ message: 'Get therapy by ID endpoint not implemented yet' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/therapies/:id/modules
// @desc    Get modules for a therapy
// @access  Public
// TODO: Implement get modules for therapy (EASY TASK)
router.get('/:id/modules', async (req, res) => {
  try {
    // TODO: Implement logic to fetch modules for a therapy
    // 1. First check if therapy exists
    // 2. Use Module.find() to get modules for the therapy
    // 3. Sort modules by orderIndex
    // 4. Return the modules

    res.status(501).json({ message: 'Get therapy modules endpoint not implemented yet' });
  } catch (error) {
    console.error(error);
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