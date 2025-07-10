const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  orderIndex: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'reading', 'exercise', 'quiz'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Step', stepSchema); 