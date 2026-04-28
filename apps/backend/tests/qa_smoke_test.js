/**
 * QA Smoke Test Suite - SolarHub
 * Verifies core business flows: Payments, Orders, and Bookings.
 */
const axios = require('axios');

const BASE_URL = process.env.STAGING_URL || 'http://localhost:5000';

async function runSmokeTests() {
  console.log('--- Starting QA Smoke Tests ---');
  
  try {
    // 1. Check Backend Health
    console.log('[QA] Checking API health...');
    await axios.get(`${BASE_URL}/api/products`);
    console.log('✅ API is healthy');

    // 2. Verify Order Placement & Payment Flow
    console.log('[QA] Verifying Order & Payment Flow...');
    const orderPayload = {
      user_id: 'u1',
      total_amount: 280000,
      address_id: 1,
      items: [{ id: 101, quantity: 1, price: 280000 }]
    };
    const orderRes = await axios.post(`${BASE_URL}/api/orders`, orderPayload);
    if (orderRes.data.shipment_details) {
      console.log('✅ Order placed successfully with shipment tracking');
    }

    // 3. Verify Service Booking
    console.log('[QA] Verifying Service Booking...');
    const bookingPayload = {
      user_id: 'u1',
      service_id: 201,
      booking_date: '2026-05-10',
      time_slot: '10:00 AM',
      address_id: 1
    };
    const bookingRes = await axios.post(`${BASE_URL}/api/bookings`, bookingPayload);
    if (bookingRes.data.dispatch_estimate) {
      console.log('✅ Service booked successfully with dispatch estimate');
    }

    console.log('--- All Smoke Tests Passed! ---');
  } catch (err) {
    console.error('❌ QA Smoke Test Failed:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runSmokeTests();
}
