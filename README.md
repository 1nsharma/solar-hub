# SolarHub Platform

SolarHub is a hybrid solar ecosystem combining an e-commerce marketplace for solar products with a comprehensive service platform for installation, maintenance, and AMC.

## Project Structure (Monorepo)

This project uses **npm workspaces** to manage multiple applications and shared packages.

### Applications (`apps/`)
- **[web-admin](file:///c:/Users/amits/Desktop/solar-hub/apps/web-admin)**: Dashboards for Admins, Vendors, and Technicians (React + Vite).
- **[mobile](file:///c:/Users/amits/Desktop/solar-hub/apps/mobile)**: Customer-facing mobile application (React Native / Expo).
- **[backend](file:///c:/Users/amits/Desktop/solar-hub/apps/backend)**: Express.js API handling business logic, payments, and orders.

### Shared Packages (`packages/`)
- **[shared](file:///c:/Users/amits/Desktop/solar-hub/packages/shared)**: Core business logic, constants, and validation rules.
- **[types](file:///c:/Users/amits/Desktop/solar-hub/packages/types)**: Shared TypeScript definitions and interfaces.
- **[ui](file:///c:/Users/amits/Desktop/solar-hub/packages/ui)**: Reusable React components shared across web applications.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v7+)

### Installation
```bash
npm install
```

### Running Locally

- **Start all services (Dev)**:
  ```bash
  npm run dev -ws
  ```

- **Start specific app**:
  ```bash
  npm run dev -w @solar-hub/web-admin
  npm run dev -w @solar-hub/backend
  ```

## Deployment

For detailed deployment instructions and architecture, see [docs/deployment_architecture.md](file:///c:/Users/amits/Desktop/solar-hub/docs/deployment_architecture.md).

For launch steps covering APK/AAB builds, API environment setup, ecommerce monetization, and QA, see [docs/release_checklist.md](file:///c:/Users/amits/Desktop/solar-hub/docs/release_checklist.md).

For the product and revenue model, see [docs/business_model.md](file:///c:/Users/amits/Desktop/solar-hub/docs/business_model.md).

For Chrome install, vendor APK, Android Studio, and Play Store launch steps, see [docs/provider_chrome_and_vendor_apk.md](file:///c:/Users/amits/Desktop/solar-hub/docs/provider_chrome_and_vendor_apk.md).

For running everything locally now and switching to real keys later, see [docs/local_runbook.md](file:///c:/Users/amits/Desktop/solar-hub/docs/local_runbook.md).

For debugger setup and GitHub APK release workflow, see [docs/debugging_and_release.md](file:///c:/Users/amits/Desktop/solar-hub/docs/debugging_and_release.md).
