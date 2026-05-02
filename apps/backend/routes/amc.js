const express = require('express');
const router = express.Router();
const amcController = require('../controllers/amcController');

router.get('/plans', amcController.getPlans);
router.get('/subscription/:userId', amcController.getUserSubscription);
router.post('/subscribe', amcController.createSubscription);

module.exports = router;
