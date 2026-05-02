const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

router.get('/health', systemController.getHealth);
router.get('/external-deals', systemController.getExternalDeals);
router.get('/seed', systemController.seedDatabase);

module.exports = router;
