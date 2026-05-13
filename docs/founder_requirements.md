# SolarHub Founder Requirements

## One-Line Concept

SolarHub is a full-stack solar commerce and fulfillment platform where customers buy verified solar products, vendors receive qualified orders, technicians complete gig-style field work, and partners generate demand.

## Selling Position

SolarHub should be sold as the operating system for distributed solar commerce, not only as an ecommerce storefront. The strongest founder story is:

- Customers need trust, financing, installation, subsidy help, and long-term service.
- Vendors need qualified demand, catalog tools, payout confidence, and reduced operational follow-up.
- Technicians need reliable job allocation, clear checklists, route context, and proof of work.
- Partners and CAs need a simple way to submit leads, support documentation, and earn referral payouts.
- SolarHub captures value mainly through ecommerce order margin or vendor commission, while service workflows protect conversion and retention.

## Core Personas

### Customer

Needs:

- Understand expected system size, cost, savings, and payback.
- Buy kits, panels, inverters, batteries, and eco-home products.
- Track order, dispatch, installation, and service status.
- Book maintenance for both SolarHub purchases and outside products.
- Store system details, warranty, AMC, and support history.

Current app coverage:

- Public marketplace.
- ROI calculator.
- Cart and checkout modal.
- Customer dashboard.
- Order, booking, AMC, and system tabs.

Production gaps:

- Real customer auth and saved addresses.
- Product recommendation based on bill, roof, pincode, subsidy, and load.
- Warranty and ticket system.
- Payment verification and invoice generation.

### Vendor

Needs:

- Apply with business details, GST, documents, serviceable regions, and catalog.
- Add products and bulk inventory.
- Receive orders and qualified quote requests.
- See dispatch status, payment milestones, payout schedule, and SLA.
- Build trust through ratings, GST/KYC verification, fulfillment score, and support record.

Current app coverage:

- Vendor onboarding screen.
- Vendor dashboard with product, order, quote, and payout tabs.
- Vendor health card.
- Pending order workflow.

Production gaps:

- Real product CRUD.
- GST and KYC verification history.
- Vendor payout ledger.
- Regional inventory and dispatch rules.
- Escrow or milestone release logic.

### Technician / Gig Workforce

Needs:

- Receive jobs by pincode, skill, rating, distance, and availability.
- See customer details, job scope, checklist, route, collection amount, and escalation path.
- Upload photos and mark milestones.
- Build technician score, certification, and payout history.

Current app coverage:

- Technician dashboard.
- Job queue and active job detail.
- Checklist and evidence placeholders.
- Start navigation, phone, complete, and issue actions.

Production gaps:

- Real technician assignment engine.
- Photo upload storage.
- Job state transitions.
- Technician payout and attendance.
- Training/certification enforcement.

### Partner / CA / Solopreneur

Needs:

- Submit qualified leads.
- Track status from lead to order.
- Know expected payout.
- Help with subsidy, GST, invoices, and compliance documents.

Current app coverage:

- Partner dashboard.
- Lead form.
- Referral code.
- Lead status and estimated earnings.

Production gaps:

- Partner onboarding and KYC.
- Referral attribution.
- Payout rules.
- Document workflow for subsidy and CA support.

### Admin

Needs:

- See ecommerce revenue, lead funnel, vendor performance, fulfillment SLA, and support issues.
- Approve or reject vendors and technicians.
- Monitor supply chain risk and inventory.
- Manage system configuration and provider integrations.

Current app coverage:

- Admin control center.
- Revenue, users, generation, support, infrastructure cards.
- Partner/KYC queue.
- Supply chain intelligence.
- Training queue.

Production gaps:

- Real authorization on the web client.
- Admin actions wired to backend mutation APIs.
- Support tickets.
- Provider observability.
- Audit trail coverage across all critical actions.

## Required Data Model

Already represented:

- Users, addresses, vendors, vendor verifications.
- Technicians.
- Products and services.
- Orders, order items, payments, and payment milestones.
- Service bookings and service programs.
- Partners, leads, commissions.
- Ecommerce revenue events.
- Audit logs.

Recommended additions:

- Support tickets and ticket messages.
- Warranty claims.
- Technician job evidence.
- Vendor documents.
- Product inventory snapshots.
- Quotes and quote line items.
- Installation projects linked to ecommerce orders.
- Customer solar systems for imported third-party systems.
- Service-area coverage by pincode.

## Revenue Rule

Use this in every dashboard and report:

- Ecommerce order: revenue event.
- Service booking: operational event.
- Lead: sales or support event.
- Technician job: fulfillment event.
- Government scheme assistance: facilitation event.
- CA and compliance work: facilitation event.

This keeps the founder pitch clean: SolarHub monetizes the marketplace, and uses services to increase conversion, trust, retention, and vendor reliability.

## Demo Story

1. Customer enters electricity bill and sees recommended system size.
2. Customer chooses a verified kit and starts checkout.
3. Vendor receives the order, confirms dispatch, and views payout status.
4. Technician receives the installation or service job with checklist and evidence flow.
5. Customer tracks delivery, installation, AMC, and system savings.
6. Partner submits a lead and sees potential referral earnings.
7. Admin monitors revenue, vendor KYC, supply chain risk, and operational health.

## Production Gates

- Auth: role-based login, protected routes, refresh/session handling.
- Payments: real Razorpay order, payment verification, invoice, refund, and escrow milestone support.
- Orders: strict state machine for created, paid, packed, shipped, installed, completed, cancelled, refunded.
- Vendor trust: GST validation, KYC documents, ratings, SLA, and suspension rules.
- Technician dispatch: pincode, skill, availability, rating, distance, SLA, and reassignment.
- Documents: storage for KYC, invoices, photos, subsidy forms, and warranty.
- Notifications: WhatsApp/SMS/email for OTP, order, technician, lead, and payout events.
- Analytics: ecommerce GMV, platform margin, lead conversion, service completion, technician utilization.
- Security: audit logs, input validation, rate limits, secrets management, and admin access controls.
- QA: smoke tests for customer checkout, vendor order, technician job, partner lead, and admin approval.

## Founder Priority

The next product sprint should focus on one complete money path:

Customer ROI calculator -> kit checkout -> payment order -> vendor dispatch -> technician installation -> customer tracking -> admin revenue report.

That path proves the marketplace, vendor value, customer trust, and gig workforce mechanics in one demo.
