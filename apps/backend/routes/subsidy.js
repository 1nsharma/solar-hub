const express = require('express');
const router = express.Router();
const subsidyController = require('../controllers/subsidyController');

router.post('/apply', subsidyController.applyForSubsidy);
router.get('/status/:userId', subsidyController.getSubsidyStatus);

module.exports = router;
