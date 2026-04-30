const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');

// Protect all admin routes - only 'admin' role allowed
router.use(auth(['admin']));

router.get('/stats', adminController.getStats);
router.get('/partners/pending', adminController.getPendingPartners);

module.exports = router;
