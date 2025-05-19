const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const auth = require('../middleware/auth');

// Create a new collection
router.post('/', auth, async (req, res) => {
  try {
    const collection = new Collection({
      name: req.body.name,
      description: req.body.description,
      user: req.user.id
    });

    await collection.save();
    res.json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all collections for a user
router.get('/', auth, async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user.id })
      .populate('requests')
      .sort({ createdAt: -1 });
    res.json(collections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get a single collection
router.get('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate('requests');
    if (!collection) {
      return res.status(404).json({ msg: 'Collection not found' });
    }
    res.json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a collection
router.put('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ msg: 'Collection not found' });
    }

    // Make sure user owns the collection
    if (collection.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    collection.name = req.body.name || collection.name;
    collection.description = req.body.description || collection.description;

    await collection.save();
    res.json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a collection
router.delete('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ msg: 'Collection not found' });
    }

    // Make sure user owns the collection
    if (collection.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Remove all requests in this collection
    await Request.deleteMany({ collection: req.params.id });

    await collection.remove();
    res.json({ msg: 'Collection removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
