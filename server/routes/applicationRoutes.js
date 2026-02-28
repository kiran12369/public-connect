const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyToken } = require('../middleware/authMiddleware');
const applicationController = require('../controllers/applicationController');

// Allowed MIME types for documents
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function sanitizeFilename(name) {
    return (name || 'file').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + sanitizeFilename(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIMES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type. Allowed: JPEG, PNG, WebP, PDF`));
        }
    }
});

router.post('/', verifyToken, (req, res, next) => {
    upload.array('documents', 5)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'File too large. Max 5MB per file.' });
            if (err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ message: 'Unexpected field.' });
        }
        if (err) return res.status(400).json({ message: err.message || 'Upload error' });
        next();
    });
}, applicationController.submitApplication);
router.get('/my-applications', verifyToken, applicationController.getUserApplications);
router.get('/track/:id', applicationController.trackApplication); // Public tracking

module.exports = router;
