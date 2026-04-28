/**
 * Payment Service - Mock Integration for Razorpay/UPI
 */
class PaymentService {
  constructor() {
    this.apiKey = process.env.PAYMENT_GATEWAY_KEY;
  }

  async createOrder(amount, currency = 'INR') {
    console.log(`[PaymentService] Creating payment order for ${amount} ${currency}`);
    // Simulate API call to Razorpay/Stripe
    return {
      id: `pay_${Math.random().toString(36).substr(2, 9)}`,
      amount: amount * 100, // in paise
      currency,
      status: 'created'
    };
  }

  async verifyPayment(paymentId, signature) {
    console.log(`[PaymentService] Verifying payment ${paymentId}`);
    // Simulate signature verification
    return true;
  }
}

module.exports = new PaymentService();
