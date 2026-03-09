const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    eventTitle: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    college: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    teamName: { type: String, default: '' },
    teamMembers: { type: String, default: '' },
    status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'rejected'] },
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
