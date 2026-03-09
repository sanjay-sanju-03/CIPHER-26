const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, default: '' },
    type: { type: String, default: 'event', enum: ['event', 'ceremony', 'break', 'workshop'] },
    order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
