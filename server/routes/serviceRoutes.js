const express = require('express');
const router = express.Router();
const { verifyToken, checkAdmin } = require('../middleware/authMiddleware');
const serviceController = require('../controllers/serviceController');

router.get('/', serviceController.getAllServices);
router.post('/', verifyToken, checkAdmin, serviceController.createService);
router.post('/seed', verifyToken, checkAdmin, serviceController.seedServices);

module.exports = router;
