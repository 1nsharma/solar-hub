const db = require('../db');
const { randomUUID } = require('crypto');
const notificationService = require('../services/notification');
const mapsService = require('../services/maps');

const USE_MOCK = process.env.USE_MOCK === 'true';

const getUserBookings = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT sb.*, s.title as service_title, s.icon_name
      FROM service_bookings sb
      JOIN services s ON sb.service_id = s.id
      WHERE sb.user_id = $1
      ORDER BY sb.booking_date DESC
    `, [req.params.userId]);
    res.json(result.rows);
  } catch (err) {
    if (USE_MOCK) {
      return res.json([]);
    }
    res.status(500).json({ error: err.message });
  }
};

const createBooking = async (req, res) => {
  const { user_id, service_id, booking_date, time_slot, address_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO service_bookings (user_id, service_id, booking_date, time_slot, address_id, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, service_id, booking_date, time_slot, address_id, 'confirmed']
    );
    const booking = result.rows[0];

    // Live Flow
    const distanceInfo = await mapsService.calculateDistance('SolarHub Central', 'User Address');
    await notificationService.sendWhatsApp('9876543210', 'booking_confirmed', { 
      booking_id: booking.id, 
      date: booking_date, 
      slot: time_slot 
    });

    res.status(201).json({ 
      ...booking, 
      dispatch_estimate: distanceInfo 
    });

  } catch (err) {
    if (USE_MOCK) {
      const booking = {
        id: `book_${randomUUID()}`,
        user_id,
        service_id,
        booking_date,
        time_slot,
        address_id,
        status: 'confirmed',
        created_at: new Date().toISOString()
      };
      const distanceInfo = await mapsService.calculateDistance('SolarHub Central', 'User Address');
      return res.status(201).json({ ...booking, dispatch_estimate: distanceInfo });
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUserBookings,
  createBooking
};
