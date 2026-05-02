const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

router.post('/calculate', financeController.calculateFinancing);

module.exports = router;
