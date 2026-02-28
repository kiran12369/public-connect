const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
        logger.info('Firebase Admin initialized (env)');
    } catch (err) {
        logger.error('Firebase FIREBASE_SERVICE_ACCOUNT parse error', { err: err.message });
    }
} else {
    try {
        const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
        if (fs.existsSync(serviceAccountPath)) {
            admin.initializeApp({ credential: admin.credential.cert(serviceAccountPath) });
            logger.info('Firebase Admin initialized (file)');
        } else {
            logger.warn('Firebase credentials not found; auth verification may fail');
        }
    } catch (err) {
        logger.error('Firebase init error', { err: err.message });
    }
}

module.exports = admin;
