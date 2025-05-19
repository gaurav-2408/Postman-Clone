const express = require('express');
const router = express.Router();
const Environment = require('../models/Environment');
const auth = require('../middleware/auth');

// Create a new environment
router.post('/', auth, async (req, res) => {
  try {
    const environment = new Environment({
      name: req.body.name,
      variables: req.body.variables,
      user: req.user.id
    });

    await environment.save();
    res.json(environment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all environments for a user
router.get('/', auth, async (req, res) => {
  try {
    const environments = await Environment.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(environments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get a single environment
router.get('/:id', auth, async (req, res) => {
  try {
    const environment = await Environment.findById(req.params.id);
    if (!environment) {
      return res.status(404).json({ msg: 'Environment not found' });
    }
    res.json(environment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update an environment
router.put('/:id', auth, async (req, res) => {
  try {
    const environment = await Environment.findById(req.params.id);
    if (!environment) {
      return res.status(404).json({ msg: 'Environment not found' });
    }

    // Make sure user owns the environment
    if (environment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    environment.name = req.body.name || environment.name;
    environment.variables = req.body.variables || environment.variables;

    await environment.save();
    res.json(environment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete an environment
router.delete('/:id', auth, async (req, res) => {
  try {
    const environment = await Environment.findById(req.params.id);
    if (!environment) {
      return res.status(404).json({ msg: 'Environment not found' });
    }

    // Make sure user owns the environment
    if (environment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await environment.remove();
    res.json({ msg: 'Environment removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
