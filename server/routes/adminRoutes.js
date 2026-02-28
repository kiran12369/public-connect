const express = require('express');
const router = express.Router();
const { verifyToken, checkAdmin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// All routes are protected and require admin role
router.use(verifyToken, checkAdmin);

router.get('/applications', adminController.getAllApplications);
router.patch('/applications/:id', adminController.updateApplicationStatus);

module.exports = router;
