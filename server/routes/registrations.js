const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');

// Register for an event (public - no login needed)
router.post('/', async (req, res) => {
    try {
        const registration = new Registration(req.body);
        await registration.save();
        res.status(201).json({ message: 'Registration successful!', registration });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all registrations (admin)
router.get('/', auth, async (req, res) => {
    try {
        const registrations = await Registration.find().sort({ createdAt: -1 });
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get registrations for a specific event (admin)
router.get('/event/:eventId', auth, async (req, res) => {
    try {
        const registrations = await Registration.find({ eventId: req.params.eventId });
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update registration status (admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const registration = await Registration.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(registration);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete registration (admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        await Registration.findByIdAndDelete(req.params.id);
        res.json({ message: 'Registration deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
