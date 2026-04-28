/**
 * Notification Service - Mock Integration for Twilio/WhatsApp
 */
class NotificationService {
  async sendSMS(to, message) {
    console.log(`[NotificationService] Sending SMS to ${to}: ${message}`);
    // Simulate Twilio API call
    return { success: true, sid: `SM${Math.random().toString(36).substr(2, 10)}` };
  }

  async sendWhatsApp(to, templateName, variables) {
    console.log(`[NotificationService] Sending WhatsApp template ${templateName} to ${to}`);
    // Simulate Meta/WhatsApp API call
    return { success: true, message_id: `WA${Math.random().toString(36).substr(2, 10)}` };
  }
}

module.exports = new NotificationService();
