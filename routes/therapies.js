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
    // TODO: Implement logic to fetch all therapies
    // 1. Use Therapy.find() to get all therapies
    // 2. Populate the createdBy field to show creator name and email
    // 3. Return the therapies
    //
    // HINT: const therapies = await Therapy.find().populate('createdBy', 'name email');
    //       res.json(therapies);

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
    // 4. Handle invalid ObjectId format
    //
    // HINT: const therapy = await Therapy.findById(req.params.id).populate('createdBy', 'name email');
    //       if (!therapy) return res.status(404).json({ message: 'Therapy not found' });
    //       res.json(therapy);

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