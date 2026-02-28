const admin = require('../config/firebase');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Dev bypass tokens - ONLY allowed in development
        const isDev = process.env.NODE_ENV === 'development';
        if (isDev && token === 'dev-token') {
            req.user = { uid: 'dev-user-uid', phone_number: '+919876543210' };
            return next();
        }
        if (isDev && token === 'admin-token') {
            req.user = { uid: 'admin-user-uid', phone_number: '+910000000000' };
            return next();
        }

        if (!admin.apps.length) {
            throw new Error("Firebase Admin not initialized");
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        const logger = require('../utils/logger');
        logger.debug('Auth error', { err: error.message });
        res.status(401).json({ message: 'Invalid token' });
    }
};

const checkAdmin = async (req, res, next) => {
    try {
        const { phone_number, email } = req.user;
        let user = null;
        if (phone_number) user = await User.findOne({ phone: phone_number });
        if (!user && email) user = await User.findOne({ email });
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied: Admins only' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error checking admin role' });
    }
};

module.exports = { verifyToken, checkAdmin };
