const express = require('express');
const router = express.Router();
const Sweet = require('../models/Sweet');

// Create a new sweet
router.post('/', async (req, res) => {
  try {
    const sweet = new Sweet(req.body);
    await sweet.save();
    res.status(201).json(sweet);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Sweet name already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all sweets with optional sorting
router.get('/', async (req, res) => {
  try {
    const { sort } = req.query;
    let sortQuery = {};

    if (sort) {
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      sortQuery[sortField] = sortOrder;
    }

    const sweets = await Sweet.find().sort(sortQuery);
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Search sweets
router.get('/search', async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a sweet
router.delete('/:id', async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    res.json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Purchase sweet
router.post('/:id/purchase', async (req, res) => {
  try {
    const { quantity } = req.body;
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    sweet.quantity -= quantity;
    await sweet.save();
    res.json(sweet);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Restock sweet
router.post('/:id/restock', async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity < 0) {
      return res.status(400).json({ message: 'Restock quantity cannot be negative' });
    }

    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    sweet.quantity += quantity;
    await sweet.save();
    res.json(sweet);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a sweet
router.put('/:id', async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    if (name) sweet.name = name;
    if (category) sweet.category = category;
    if (price) sweet.price = price;
    if (quantity) sweet.quantity = quantity;

    await sweet.save();
    res.json(sweet);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Sweet name already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;