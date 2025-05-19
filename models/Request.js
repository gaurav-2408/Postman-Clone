const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  headers: [{
    key: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      required: true,
      trim: true
    }
  }],
  body: {
    type: String,
    trim: true
  },
  bodyType: {
    type: String,
    enum: ['raw', 'form-data', 'x-www-form-urlencoded', 'binary']
  },
  response: {
    status: Number,
    headers: Object,
    body: String,
    timestamp: Date
  },
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    required: true
  },
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

module.exports = mongoose.model('Request', requestSchema);
