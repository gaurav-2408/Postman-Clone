const express = require('express');
const router = express.Router();
const axios = require('axios');
const Request = require('../models/Request');
const auth = require('../middleware/auth');

// Make a request
router.post('/', auth, async (req, res) => {
  try {
    const { method, url, headers, body, bodyType } = req.body;

    // Make the actual request using axios
    const response = await axios({
      method: method.toLowerCase(),
      url,
      headers,
      data: bodyType === 'raw' ? JSON.parse(body) : body
    });

    // Save the request to database
    const request = new Request({
      name: req.body.name,
      description: req.body.description,
      method,
      url,
      headers,
      body,
      bodyType,
      response: {
        status: response.status,
        headers: response.headers,
        body: JSON.stringify(response.data),
        timestamp: new Date()
      },
      collection: req.body.collection,
      user: req.user.id
    });

    await request.save();
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all requests for a user
router.get('/', auth, async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user.id })
      .populate('collection')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get a single request
router.get('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a request
router.put('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    // Make sure user owns the request
    if (request.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    request.name = req.body.name || request.name;
    request.description = req.body.description || request.description;
    request.method = req.body.method || request.method;
    request.url = req.body.url || request.url;
    request.headers = req.body.headers || request.headers;
    request.body = req.body.body || request.body;
    request.bodyType = req.body.bodyType || request.bodyType;

    await request.save();
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a request
router.delete('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    // Make sure user owns the request
    if (request.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await request.remove();
    res.json({ msg: 'Request removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
