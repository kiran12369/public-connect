const Application = require('../models/Application');
const User = require('../models/User');

exports.submitApplication = async (req, res) => {
    try {
        const { serviceId, formData } = req.body;
        // req.files contains uploaded files
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one photo/document is required.' });
        }
        const documents = req.files.map(file => `/uploads/${file.filename}`);

        const { phone_number, email } = req.user;
        let user = phone_number ? await User.findOne({ phone: phone_number }) : null;
        if (!user && email) user = await User.findOne({ email });
        if (!user) {
            user = new User({ phone: phone_number, email, name: 'Guest', uid: req.user.uid });
            await user.save();
        }

        let parsedFormData = {};
        let parsedLocation = undefined;
        try {
            parsedFormData = formData ? JSON.parse(formData) : {};
        } catch (e) {
            return res.status(400).json({ message: 'Invalid formData JSON' });
        }
        if (req.body.location) {
            try {
                parsedLocation = JSON.parse(req.body.location);
            } catch (e) {
                return res.status(400).json({ message: 'Invalid location JSON' });
            }
        }

        const newApplication = new Application({
            userId: user._id,
            serviceId,
            formData: parsedFormData,
            documents,
            type: req.body.type || 'Application',
            title: req.body.title,
            description: req.body.description,
            location: parsedLocation
        });

        await newApplication.save();

        res.status(201).json({
            message: 'Application submitted successfully',
            applicationId: newApplication.applicationId,
            application: newApplication
        });

    } catch (error) {
        const logger = require('../utils/logger');
        logger.error('Submit error', { err: error.message });
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserApplications = async (req, res) => {
    try {
        const { phone_number, email } = req.user;
        let user = phone_number ? await User.findOne({ phone: phone_number }) : null;
        if (!user && email) user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const applications = await Application.find({ userId: user._id })
            .populate('serviceId')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.trackApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await Application.findOne({ applicationId: id })
            .populate('serviceId', 'title icon')
            .select('applicationId type status createdAt updatedAt serviceId title description remarks');

        if (!application) return res.status(404).json({ message: 'Application not found' });

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
