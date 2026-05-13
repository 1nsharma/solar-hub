# SolarHub Deployment Architecture

This document describes how SolarHub should be deployed for demos and production.

## App Split

SolarHub is one monorepo with separate deployable surfaces:

- Public website: SEO-first SolarHub marketplace website for customers and search traffic.
- Provider console: installable web/PWA dashboard for vendors, technicians, partners, and admins.
- Backend API: Express API for auth, products, orders, bookings, leads, payments, and platform config.
- Customer APK/AAB: mobile app variant for customers.
- Vendor APK/AAB: mobile app variant for vendors when a native demo is needed.
- Technician APK/AAB: mobile app variant for service workforce demos.

The current Vite web app serves the public website as the default route and dashboard experiences after login/role selection. In production, keep public SEO pages on `solarhub.in` and place private console access behind authenticated routes or a subdomain such as `console.solarhub.in`.

## Repository Structure

```text
solar-hub/
  apps/
    backend/       Express API
    mobile/        Expo mobile app with customer, vendor, and technician variants
    web-admin/     Public website plus role dashboards/PWA
  packages/
    shared/        Business logic and marketplace intelligence
    types/         Shared TypeScript types
    ui/            Shared React UI components
  docs/            Business, release, founder, and deployment documentation
```

## Recommended Hosting

| Surface | Purpose | Recommended Host |
|---|---|---|
| Public website | SEO, customer education, marketplace entry | Vercel, Netlify, or Cloudflare Pages |
| Provider console | Vendor, technician, partner, admin PWA | Vercel, Netlify, or Cloudflare Pages, ideally `console.solarhub.in` |
| Backend API | Business logic and integrations | Cloud Run, AWS App Runner, Railway, Render, or VPS |
| PostgreSQL | Production data | Supabase, RDS, Neon, or managed Postgres |
| Media storage | KYC docs, invoices, job photos | S3, Cloudflare R2, or DigitalOcean Spaces |
| APK releases | Demo and internal distribution | GitHub Releases, Firebase App Distribution, EAS |
| App store builds | Public production mobile | Google Play and Apple App Store |

## SEO Setup

The public website includes:

- `index.html` title, canonical URL, description, keywords, Open Graph, Twitter cards, and JSON-LD.
- `public/robots.txt`
- `public/sitemap.xml`
- `public/manifest.webmanifest`

Before production, update `https://solarhub.in/` in the SEO files if the final domain is different.

## APK Build Strategy

Expo app variants are controlled by `APP_VARIANT` in `apps/mobile/app.config.js`.

| Variant | APP_VARIANT | Android package |
|---|---|---|
| Customer | `customer` | `in.solarhub.app` |
| Vendor | `vendor` | `in.solarhub.vendor` |
| Technician | `technician` | `in.solarhub.technician` |

Root commands:

```bash
npm run build:apk
npm run build:vendor:apk
npm run build:technician:apk
npm run build:vendor:aab
npm run build:technician:aab
```

GitHub Actions also supports APK builds through `.github/workflows/android-apk.yml`.

Tag examples:

```bash
git tag v0.1.1-customer-apk
git push origin v0.1.1-customer-apk

git tag v0.1.1-vendor-apk
git push origin v0.1.1-vendor-apk

git tag v0.1.1-technician-apk
git push origin v0.1.1-technician-apk
```

Manual workflow dispatch can also build `customer`, `vendor`, or `technician`.

## Production Pipeline

1. Push to `master`.
2. Run backend syntax/tests.
3. Build the public web/PWA bundle.
4. Build APKs for demo variants when needed.
5. Deploy backend with production environment variables.
6. Deploy public website and console.
7. Smoke test the money path:
   ROI calculator -> product checkout -> payment order -> vendor dispatch -> technician installation -> customer tracking -> admin revenue report.

## Required Environment Variables

Backend:

- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `STORAGE_BUCKET`
- `USE_MOCK`

Web:

- `VITE_API_URL`

Mobile:

- `EXPO_PUBLIC_API_URL`
- `APP_VARIANT`

## Demo Rules

- Use the public website for customer and investor demos.
- Use vendor APK or provider console for vendor demos.
- Use technician APK for gig workforce demos.
- Keep admin access private.
- Do not present service bookings as the main revenue stream. The clean business model is ecommerce revenue plus service-led trust, conversion, and retention.
