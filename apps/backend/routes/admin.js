const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/stats', adminController.getStats);
router.get('/partners/pending', adminController.getPendingPartners);

module.exports = router;
