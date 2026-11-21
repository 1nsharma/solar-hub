const express = require('express');
const router = express.Router();
const microgridController = require('../controllers/microgridController');

// Overview & Fleet
router.get('/summary', microgridController.getSummary);
router.get('/devices', microgridController.getDevices);

// Live IoT Telemetry
router.get('/telemetry/:deviceId', microgridController.getLiveTelemetry);
router.post('/telemetry/:deviceId', microgridController.ingestTelemetry);

// Prepaid Energy Wallet
router.get('/wallet/:deviceId', microgridController.getWallet);
router.post('/wallet/recharge', microgridController.rechargeWallet);

// Dynamic Pricing Engine
router.get('/pricing/current', microgridController.getCurrentPricing);
router.get('/pricing/history', microgridController.getPricingHistory);

// P2P Microgrid Solar Trading
router.get('/trades', microgridController.getTrades);
router.post('/trades/execute', microgridController.executeTrade);

// Remote Disconnect / Relay Control
router.post('/relay/control', microgridController.controlRelay);

// Legal PPA Agreement & Consent
router.get('/agreement/:deviceId', microgridController.getAgreement);
router.post('/agreement/accept', microgridController.acceptAgreement);

// Audit & Events Log
router.get('/events', microgridController.getEvents);

module.exports = router;
