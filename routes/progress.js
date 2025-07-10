const express = require('express');
const UserProgress = require('../models/UserProgress');
const Step = require('../models/Step');
const Module = require('../models/Module');
const Therapy = require('../models/Therapy');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/progress/complete
// @desc    Mark a step as completed
// @access  Private
router.post('/complete', auth, async (req, res) => {
  try {
    const { stepId } = req.body;

    if (!stepId) {
      return res.status(400).json({ message: 'Step ID is required' });
    }

    // Check if step exists
    const step = await Step.findById(stepId);
    if (!step) {
      return res.status(404).json({ message: 'Step not found' });
    }

    // Create or update progress
    const progress = await UserProgress.findOneAndUpdate(
      { user: req.user._id, step: stepId },
      { 
        status: 'completed',
        completedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/progress/user/:userId
// @desc    Get user progress statistics
// @access  Private
// TODO: Implement user progress statistics with aggregation (HARD TASK - OPTIONAL)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Only allow users to view their own progress or therapists to view any
    if (req.user._id.toString() !== userId && req.user.role !== 'therapist') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // TODO: Implement advanced progress statistics using MongoDB aggregation
    // This should calculate:
    // 1. Total steps completed by the user
    // 2. Progress percentage for each therapy
    // 3. Progress percentage for each module
    // 4. Overall completion statistics
    // 5. Recent activity (last 7 days)
    // 
    // Use MongoDB aggregation pipeline with $lookup, $group, and $project stages
    // Consider using $facet for multiple aggregations in one query

    res.status(501).json({ message: 'User progress statistics endpoint not implemented yet' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/progress/therapy/:therapyId
// @desc    Get therapy completion statistics
// @access  Private (therapist only)
// TODO: Implement therapy statistics (HARD TASK - OPTIONAL)
router.get('/therapy/:therapyId', auth, async (req, res) => {
  try {
    // Only therapists can view therapy statistics
    if (req.user.role !== 'therapist') {
      return res.status(403).json({ message: 'Only therapists can view therapy statistics' });
    }

    const { therapyId } = req.params;

    // TODO: Implement therapy completion statistics using MongoDB aggregation
    // This should calculate:
    // 1. Number of users who started this therapy
    // 2. Number of users who completed this therapy
    // 3. Average completion rate
    // 4. Most/least completed modules
    // 5. Average time to completion

    res.status(501).json({ message: 'Therapy statistics endpoint not implemented yet' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 