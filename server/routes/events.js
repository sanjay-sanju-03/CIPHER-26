const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// GET all active events (public)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all events including inactive (admin)
router.get('/all', auth, async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single event (public)
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create event — plain JSON, image sent as base64 string (admin)
router.post('/', auth, async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update event — plain JSON (admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: false });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE event (admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
