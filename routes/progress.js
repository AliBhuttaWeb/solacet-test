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

    // TODO: Implement progress statistics using MongoDB aggregation
    // Expected response format:
    // {
    //   "totalStepsCompleted": 2,
    //   "therapyProgress": [
    //     {
    //       "therapyId": "...",
    //       "therapyTitle": "Anxiety Management",
    //       "completedSteps": 2,
    //       "totalSteps": 2,
    //       "progressPercentage": 100
    //     }
    //   ],
    //   "recentActivity": [
    //     {
    //       "stepTitle": "Step 1",
    //       "therapyTitle": "Anxiety Management",
    //       "completedAt": "2024-01-15T10:30:00Z"
    //     }
    //   ]
    // }
    //
    // HINT: Use aggregation pipeline with $lookup to join collections
    // 1. Start with UserProgress.aggregate([...])
    // 2. $match to filter by user
    // 3. $lookup to join with Step, Module, and Therapy collections
    // 4. $group to calculate statistics
    // 5. $project to format the output

    res.status(501).json({ message: 'User progress statistics endpoint not implemented yet' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 