const express = require('express');
const router = express.Router();
const technicianController = require('../controllers/technicianController');

router.get('/jobs/available', technicianController.getAvailableJobs);
router.post('/jobs/:jobId/accept', technicianController.acceptJob);
router.post('/jobs/:jobId/complete', technicianController.completeJob);

module.exports = router;
