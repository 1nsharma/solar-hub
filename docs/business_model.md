# SolarHub Business Model

SolarHub is a main ecommerce-led solar platform with service workflows around it.

## Core Site

The main site sells solar products:

- Solar kits
- Panels
- Inverters
- Batteries
- UPS and eco-home products

This is the only direct platform monetization layer. Revenue should be tracked against ecommerce checkout through product margin, vendor product commission, or kit payment.

## Service Layers

Services exist to support customer conversion, fulfillment, and retention. They should not be treated as separate SolarHub monetization unless that decision changes later.

1. External product services
   - For customers who already own products bought outside SolarHub.
   - Works like an Urban Company-style maintenance booking.
   - Creates service jobs for technicians.

2. Vendor and order-linked services
   - Starts when a vendor receives an ecommerce order.
   - Covers installation, warranty, dispatch coordination, and after-sales support.
   - Helps complete the ecommerce order lifecycle.

3. Government scheme services
   - Helps users understand eligibility, documents, subsidy workflow, and vendor assignment.
   - Supports product purchase conversion.

4. CA and compliance onboarding
   - Helps with GST, invoice support, vendor KYC, and subsidy paperwork review.
   - Supports ecommerce and scheme fulfillment rather than becoming a separate platform revenue line.

## Revenue Rule

Use this rule in product, API, and reporting:

- Ecommerce order: revenue event.
- Service booking: operational event.
- Lead: sales or support event.
- Technician job: fulfillment event.
- Government scheme assistance: facilitation event.
- CA and compliance work: facilitation event.

Payments should be attached to ecommerce checkout first. Service charge collection can be recorded operationally if needed, but it should not be counted as SolarHub platform monetization by default.
