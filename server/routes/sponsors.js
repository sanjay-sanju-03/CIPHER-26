const express = require('express');
const router = express.Router();
const Sponsor = require('../models/Sponsor');
const auth = require('../middleware/auth');

// Get all sponsors (public)
router.get('/', async (req, res) => {
    try {
        const sponsors = await Sponsor.find().sort({ tier: 1 });
        res.json(sponsors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create sponsor (admin)
router.post('/', auth, async (req, res) => {
    try {
        const sponsor = new Sponsor(req.body);
        await sponsor.save();
        res.status(201).json(sponsor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update sponsor (admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(sponsor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete sponsor (admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        await Sponsor.findByIdAndDelete(req.params.id);
        res.json({ message: 'Sponsor deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
