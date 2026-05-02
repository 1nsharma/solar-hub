const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

router.get('/:partnerId', leadController.getPartnerLeads);
router.post('/', leadController.createLead);

module.exports = router;
