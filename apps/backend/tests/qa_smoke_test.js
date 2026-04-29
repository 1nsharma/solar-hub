/**
 * QA Smoke Test Suite - SolarHub
 * Verifies core business flows: API health, ecommerce orders, service bookings, and revenue model.
 */
const axios = require('axios');

const BASE_URL = process.env.STAGING_URL || 'http://localhost:5000';

async function runSmokeTests() {
  console.log('--- Starting QA Smoke Tests ---');

  try {
    console.log('[QA] Checking API health...');
    await axios.get(`${BASE_URL}/api/health`);
    await axios.get(`${BASE_URL}/api/products`);
    console.log('OK API is healthy');

    console.log('[QA] Verifying Order & Payment Flow...');
    const orderPayload = {
      user_id: 'u1',
      total_amount: 280000,
      address_id: 1,
      items: [{ id: 101, quantity: 1, price: 280000 }]
    };
    const orderRes = await axios.post(`${BASE_URL}/api/orders`, orderPayload);
    if (!orderRes.data.shipment_details) {
      throw new Error('Order did not return shipment tracking');
    }
    console.log('OK Order placed successfully with shipment tracking');

    console.log('[QA] Verifying Service Booking...');
    const bookingPayload = {
      user_id: 'u1',
      service_id: 501,
      booking_date: '2026-05-10',
      time_slot: '10:00 AM',
      address_id: 1
    };
    const bookingRes = await axios.post(`${BASE_URL}/api/bookings`, bookingPayload);
    if (!bookingRes.data.dispatch_estimate) {
      throw new Error('Booking did not return dispatch estimate');
    }
    console.log('OK Service booked successfully with dispatch estimate');

    console.log('[QA] Verifying Ecommerce Revenue APIs...');
    const revenueRes = await axios.get(`${BASE_URL}/api/revenue-model`);
    if (revenueRes.data.primary_revenue !== 'ecommerce') {
      throw new Error('Revenue model must be ecommerce-first');
    }

    const programsRes = await axios.get(`${BASE_URL}/api/service-programs`);
    if (!Array.isArray(programsRes.data) || programsRes.data.some(program => program.platform_revenue !== false)) {
      throw new Error('Service programs must not be marked as platform revenue');
    }

    const paymentRes = await axios.post(`${BASE_URL}/api/payments/create-order`, {
      user_id: 'u1',
      amount: 280000,
      purpose: 'product_checkout'
    });
    if (paymentRes.data.status !== 'created') {
      throw new Error('Payment order was not created');
    }
    console.log('OK Payment order created successfully');

    console.log('--- All Smoke Tests Passed ---');
  } catch (err) {
    console.error('QA Smoke Test Failed:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runSmokeTests();
}
