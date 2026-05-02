const db = require('../db');
const { randomUUID } = require('crypto');
const notificationService = require('../services/notification');

const USE_MOCK = process.env.USE_MOCK === 'true';

const getAvailableJobs = async (req, res) => {
  const { region } = req.query;
  try {
    // In a real scenario, this would filter by technician region and 'technician_assigned' status being null
    const result = await db.query(`
      SELECT sb.*, s.title as service_title, a.address_text, a.pincode
      FROM service_bookings sb
      JOIN services s ON sb.service_id = s.id
      JOIN addresses a ON sb.address_id = a.id
      WHERE sb.status = 'confirmed' AND sb.technician_id IS NULL
      ORDER BY sb.booking_date ASC
    `);
    res.json(result.rows);
  } catch (err) {
    if (USE_MOCK) {
      return res.json([
        { 
          id: 'job_1', 
          service_title: '5kW System Installation', 
          address_text: 'Sector 62, Noida', 
          pincode: '201301', 
          booking_date: '2026-05-10', 
          time_slot: '10:00 AM - 02:00 PM',
          payout: 4500
        },
        { 
          id: 'job_2', 
          service_title: 'Annual Maintenance Check', 
          address_text: 'DLF Phase 3, Gurgaon', 
          pincode: '122002', 
          booking_date: '2026-05-11', 
          time_slot: '02:00 PM - 04:00 PM',
          payout: 1200
        }
      ]);
    }
    res.status(500).json({ error: err.message });
  }
};

const acceptJob = async (req, res) => {
  const { jobId } = req.params;
  const { technicianId } = req.body;
  
  try {
    await db.query(
      "UPDATE service_bookings SET technician_id = $1, status = 'technician_assigned' WHERE id = $2",
      [technicianId, jobId]
    );
    
    // Notify User
    await notificationService.sendSMS('USER_PHONE', `Technician has been assigned to your booking #${jobId}.`);
    
    res.json({ success: true, message: 'Job accepted successfully' });
  } catch (err) {
    if (USE_MOCK) {
      return res.json({ success: true, mock: true });
    }
    res.status(500).json({ error: err.message });
  }
};

const completeJob = async (req, res) => {
  const { jobId } = req.params;
  const { notes, attachments } = req.body;
  
  try {
    await db.query(
      "UPDATE service_bookings SET status = 'completed' WHERE id = $1",
      [jobId]
    );
    
    // Trigger Payout Logic (Escrow Release)
    // await paymentService.releaseTechnicianPayout(jobId);
    
    res.json({ success: true, message: 'Job marked as completed' });
  } catch (err) {
    if (USE_MOCK) {
      return res.json({ success: true, mock: true });
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAvailableJobs,
  acceptJob,
  completeJob
};
