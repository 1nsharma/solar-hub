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

