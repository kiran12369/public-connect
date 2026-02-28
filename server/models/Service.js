const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    titleTe: { type: String }, // Telugu Title
    description: { type: String },
    descriptionTe: { type: String }, // Telugu Description
    category: { type: String, enum: ['State', 'Central'], default: 'State' },
    requiredDocuments: [{ type: String }],
    formFields: [{
        name: { type: String },
        label: { type: String },
        type: { type: String, default: 'text' }, // text, number, date
        required: { type: Boolean, default: true }
    }],
    icon: { type: String }, // URL or icon name
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Service', ServiceSchema);
