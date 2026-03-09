const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String, default: '' },
    website: { type: String, default: '' },
    tier: { type: String, enum: ['platinum', 'gold', 'silver', 'bronze'], default: 'silver' },
}, { timestamps: true });

module.exports = mongoose.model('Sponsor', sponsorSchema);
