const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  step: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Step',
    required: true
  },
  status: {
    type: String,
    enum: ['not-started', 'completed'],
    default: 'not-started'
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
userProgressSchema.index({ user: 1, step: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema); 