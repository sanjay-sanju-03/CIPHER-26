const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const auth = require('../middleware/auth');

// Get all schedule items (public)
router.get('/', async (req, res) => {
    try {
        const schedule = await Schedule.find().sort({ date: 1, order: 1 });
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create schedule item (admin)
router.post('/', auth, async (req, res) => {
    try {
        const item = new Schedule(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update schedule item (admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const item = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete schedule item (admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        await Schedule.findByIdAndDelete(req.params.id);
        res.json({ message: 'Schedule item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
