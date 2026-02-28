const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }, // Optional for complaints
    type: { type: String, enum: ['Application', 'Complaint'], default: 'Application' },
    title: { type: String }, // For complaints subject
    description: { type: String }, // For complaints description
    location: {
        lat: { type: Number },
        lng: { type: Number },
        address: { type: String } // Optional address string
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    formData: { type: Map, of: String }, // Dynamic form fields
    documents: [{ type: String }], // Array of file URLs
    remarks: { type: String },
    applicationId: { type: String, unique: true }, // Custom ID for tracking
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

// Auto-generate human-readable Application ID
ApplicationSchema.pre('save', async function () {
    if (!this.applicationId) {
        const prefix = this.type === 'Complaint' ? 'CMP-' : 'APP-';
        this.applicationId = prefix + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
    }
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Application', ApplicationSchema);
