const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    maxParticipants: { type: Number, default: 100 },
    teamSize: { type: String, default: 'Individual' },
    prize: { type: String, default: '' },
    image: { type: String, default: '' },
    registrationLink: { type: String, default: '' },
    registrationFee: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    mode: { type: String, enum: ['offline', 'online'], default: 'offline' },
    isPreEvent: { type: Boolean, default: false },
    registrationDeadline: { type: String, default: '' },  // ISO datetime e.g. "2026-03-23T17:00"
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
