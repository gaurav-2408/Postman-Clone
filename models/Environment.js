const mongoose = require('mongoose');

const environmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  variables: [{
    key: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      required: true,
      trim: true
    },
    description: String
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Environment', environmentSchema);
