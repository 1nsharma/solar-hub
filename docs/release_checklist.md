# SolarHub Release Checklist

Use this checklist to move the current prototype toward a public web launch, Android distribution, ecommerce monetization, and service operations.

## 1. Environment

Copy `.env.example` into the environment files used by each app:

- Backend: `apps/backend/.env`
- Web admin: `apps/web-admin/.env`
- Mobile: `apps/mobile/.env`

Required production values:

- `VITE_API_URL=https://api.solarhub.in`
- `EXPO_PUBLIC_API_URL=https://api.solarhub.in`
- PostgreSQL credentials
- Payment gateway keys
- SMS or WhatsApp credentials
- Maps API key
- Storage bucket credentials

## 2. Backend API

Current production-ready API surfaces:

- `GET /api/health`
- `GET /api/products`
- `GET /api/services`
- `POST /api/orders`
- `POST /api/bookings`
- `POST /api/auth/verify-otp`
- `GET /api/revenue-model`
- `GET /api/service-programs`
- `POST /api/payments/create-order`
- `POST /api/leads`
- `POST /api/vendors/apply`
- `GET /api/admin/vendors`

For demos and early QA, set `USE_MOCK=true`. For production, set `USE_MOCK=false` and run `db/schema.sql` against PostgreSQL.

## 3. Business Model

SolarHub has one primary monetization path:

- Ecommerce checkout for solar products, kits, inverters, batteries, panels, and eco-home products.
- Revenue comes from product margin, vendor product commission, or kit checkout payment.
- Payment order creation is handled through `/api/payments/create-order`.

Service flows are operational, not separate platform monetization:

- External product maintenance works like an Urban Company-style booking and technician assignment flow.
- Vendor service fulfillment starts after a vendor receives an order and needs installation, warranty, or support handling.
- Government scheme service helps users with eligibility, documents, and vendor assignment.
- Lead capture through `/api/leads` and booking through `/api/bookings` support these workflows, but service programs are marked as non-platform-revenue.

Before going live, replace the mock payment service with verified Razorpay order creation and webhook signature validation for ecommerce checkout only.

## 4. Web Release

Build:

```bash
npm run build:web
```

Deploy `apps/web-admin/dist` to Vercel, Netlify, Cloudflare Pages, or any static host. Set `VITE_API_URL` in the host dashboard.

## 5. Android Release

Generate an internal APK:

```bash
npm run build:apk
```

Generate a vendor APK:

```bash
npm run build:vendor:apk
```

Generate a Play Store AAB:

```bash
npm run build:aab -w mobile
```

Generate a vendor Play Store AAB:

```bash
npm run build:vendor:aab
```

Before store submission:

- Replace `extra.eas.projectId` in `apps/mobile/app.json`.
- Confirm `android.package` is the final package id.
- Connect EAS credentials.
- Add privacy policy, app content declarations, screenshots, and store listing text.

## 6. QA

Local release check:

```bash
npm run release:check
```

Live smoke test after staging deployment:

```bash
STAGING_URL=https://staging-api.solarhub.in npm run smoke -w @solar-hub/backend
```

## 7. GitHub Actions

The production workflow builds backend, web, and queues an EAS preview Android build. Configure these secrets:

- `EXPO_TOKEN`
- `STAGING_URL`

Store submit/promotion is intentionally manual until Play Console and App Store Connect credentials are connected.
