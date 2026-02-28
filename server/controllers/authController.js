const User = require('../models/User');

function isAdminUser(phone, email) {
    const adminPhones = (process.env.ADMIN_PHONE_NUMBERS || '').split(',').map(s => s.trim()).filter(Boolean);
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean);
    return (phone && adminPhones.includes(phone)) || (email && adminEmails.includes(email));
}

exports.loginUser = async (req, res) => {
    try {
        // req.user is populated by verifyToken middleware
        const { uid, phone_number, email } = req.user;
        const { name } = req.body; // Optional: Update name on login if provided

        // Find user by phone OR email (if phone is missing)
        let query = {};
        if (phone_number) query.phone = phone_number;
        else if (email) query.email = email;
        else query.uid = uid; // Fallback to UID

        let user = await User.findOne(query);
        if (!user) {
            // Register new user
            user = new User({
                uid: uid,
                phone: phone_number,
                email: email,
                name: name || req.user.name || 'New User',
                role: isAdminUser(phone_number, email) ? 'admin' : 'user'
            });
            await user.save();
        } else {
            // Update name/email if provided
            if (name) user.name = name;
            if (email && !user.email) user.email = email;

            if (isAdminUser(phone_number, email) && user.role !== 'admin') {
                user.role = 'admin';
            }
            await user.save();
        }

        res.status(200).json({
            message: 'Login successful',
            user: user
        });
    } catch (error) {
        const logger = require('../utils/logger');
        logger.error('Login error', { err: error.message });
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const { phone_number, email, uid } = req.user;
        let user = null;
        if (phone_number) user = await User.findOne({ phone: phone_number });
        if (!user && email) user = await User.findOne({ email });
        if (!user) user = await User.findOne({ uid });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
