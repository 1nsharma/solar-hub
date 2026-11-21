/**
 * SolarHub Microgrid Controller
 * Exposes REST endpoints for Smart Meter Telemetry, Energy Wallet, Dynamic Pricing, P2P Trading, and Safety Relay Control
 */

const microgridService = require('../services/microgridService');

const getSummary = async (req, res) => {
  try {
    const summary = microgridService.getSummary();
    res.json(summary);
  } catch (err) {
    console.error('[MicrogridController] getSummary error:', err);
    res.status(500).json({ error: 'Failed to fetch microgrid summary' });
  }
};

const getDevices = async (req, res) => {
  try {
    const devices = microgridService.getDevices();
    res.json({ devices });
  } catch (err) {
    console.error('[MicrogridController] getDevices error:', err);
    res.status(500).json({ error: 'Failed to fetch microgrid devices' });
  }
};

const getLiveTelemetry = async (req, res) => {
  try {
    const deviceId = req.params.deviceId || 'flat_101';
    const telemetry = microgridService.getLiveTelemetry(deviceId);
    res.json(telemetry);
  } catch (err) {
    console.error('[MicrogridController] getLiveTelemetry error:', err);
    res.status(500).json({ error: 'Failed to fetch telemetry' });
  }
};

const ingestTelemetry = async (req, res) => {
  try {
    const deviceId = req.params.deviceId || req.body.device_id;
    const readings = req.body;
    if (!deviceId) {
      return res.status(400).json({ error: 'device_id is required' });
    }
    const result = microgridService.ingestTelemetry(deviceId, readings);
    res.json(result);
  } catch (err) {
    console.error('[MicrogridController] ingestTelemetry error:', err);
    res.status(500).json({ error: err.message || 'Failed to ingest telemetry' });
  }
};

const getWallet = async (req, res) => {
  try {
    const deviceId = req.params.deviceId || 'flat_101';
    const wallet = microgridService.getWallet(deviceId);
    res.json(wallet);
  } catch (err) {
    console.error('[MicrogridController] getWallet error:', err);
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
};

const rechargeWallet = async (req, res) => {
  try {
    const { deviceId, amount, paymentMethod } = req.body;
    if (!deviceId || !amount) {
      return res.status(400).json({ error: 'deviceId and amount are required' });
    }
    const result = microgridService.rechargeWallet(deviceId, amount, paymentMethod);
    res.json(result);
  } catch (err) {
    console.error('[MicrogridController] rechargeWallet error:', err);
    res.status(400).json({ error: err.message || 'Recharge failed' });
  }
};

const getCurrentPricing = async (req, res) => {
  try {
    const pricing = microgridService.getPricing();
    res.json(pricing);
  } catch (err) {
    console.error('[MicrogridController] getCurrentPricing error:', err);
    res.status(500).json({ error: 'Failed to fetch pricing' });
  }
};

const getPricingHistory = async (req, res) => {
  try {
    const history = microgridService.getPricingHistory();
    res.json(history);
  } catch (err) {
    console.error('[MicrogridController] getPricingHistory error:', err);
    res.status(500).json({ error: 'Failed to fetch pricing history' });
  }
};

const executeTrade = async (req, res) => {
  try {
    const { sellerDeviceId, buyerDeviceId, energyKwh, customRate } = req.body;
    if (!sellerDeviceId || !buyerDeviceId || !energyKwh) {
      return res.status(400).json({ error: 'sellerDeviceId, buyerDeviceId, and energyKwh are required' });
    }
    const trade = microgridService.executeTrade({ sellerDeviceId, buyerDeviceId, energyKwh, customRate });
    res.status(201).json(trade);
  } catch (err) {
    console.error('[MicrogridController] executeTrade error:', err);
    res.status(400).json({ error: err.message || 'Trade execution failed' });
  }
};

const getTrades = async (req, res) => {
  try {
    const deviceId = req.query.deviceId;
    const trades = microgridService.getTrades(deviceId);
    res.json({ trades });
  } catch (err) {
    console.error('[MicrogridController] getTrades error:', err);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
};

const controlRelay = async (req, res) => {
  try {
    const { deviceId, command, reason } = req.body;
    if (!deviceId || !command) {
      return res.status(400).json({ error: 'deviceId and command (CUTOFF|RESTORE) are required' });
    }
    const result = microgridService.controlRelay(deviceId, command, reason);
    res.json(result);
  } catch (err) {
    console.error('[MicrogridController] controlRelay error:', err);
    res.status(400).json({ error: err.message || 'Relay control failed' });
  }
};

const getAgreement = async (req, res) => {
  try {
    const deviceId = req.params.deviceId || 'flat_101';
    const agreement = microgridService.getAgreement(deviceId);
    res.json(agreement);
  } catch (err) {
    console.error('[MicrogridController] getAgreement error:', err);
    res.status(500).json({ error: 'Failed to fetch agreement' });
  }
};

const acceptAgreement = async (req, res) => {
  try {
    const { deviceId, digitalSignature } = req.body;
    if (!deviceId || !digitalSignature) {
      return res.status(400).json({ error: 'deviceId and digitalSignature are required' });
    }
    const agreement = microgridService.acceptAgreement(deviceId, digitalSignature);
    res.json({ message: 'Agreement accepted successfully', agreement });
  } catch (err) {
    console.error('[MicrogridController] acceptAgreement error:', err);
    res.status(400).json({ error: err.message || 'Failed to accept agreement' });
  }
};

const getEvents = async (req, res) => {
  try {
    const deviceId = req.query.deviceId;
    const events = microgridService.getEvents(deviceId);
    res.json({ events });
  } catch (err) {
    console.error('[MicrogridController] getEvents error:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

module.exports = {
  getSummary,
  getDevices,
  getLiveTelemetry,
  ingestTelemetry,
  getWallet,
  rechargeWallet,
  getCurrentPricing,
  getPricingHistory,
  executeTrade,
  getTrades,
  controlRelay,
  getAgreement,
  acceptAgreement,
  getEvents
};
