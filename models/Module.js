const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  therapy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Therapy',
    required: true
  },
  orderIndex: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['lesson', 'exercise', 'assessment'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Module', moduleSchema); 