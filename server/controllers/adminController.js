const Application = require('../models/Application');

exports.getAllApplications = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const applications = await Application.find(query)
            .populate('userId', 'name phone')
            .populate('serviceId', 'title')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error ' + error.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;

        const application = await Application.findById(id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        if (status) application.status = status;
        if (remarks !== undefined) application.remarks = remarks;

        // Remarks are mandatory when closing (Resolved or Rejected)
        if (['Resolved', 'Rejected'].includes(application.status)) {
            const trimmed = String(application.remarks || '').trim();
            if (!trimmed) {
                return res.status(400).json({ message: 'Remarks are required when resolving or rejecting an application' });
            }
        }

        await application.save();

        // TODO: Trigger Notification (WhatsApp/Push)

        res.json({ message: 'Status updated successfully', application });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
