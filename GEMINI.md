# SolarHub Platform - Mission & Architecture

## Mission Statement
The SolarHub Platform is an integrated hybrid ecosystem designed to bridge the gap between solar product retail and professional lifecycle services. By combining an e-commerce marketplace with a specialized service platform, it aims to provide a "one-stop" solution for renewable energy adoption.

## Core Objectives
- **Unified Experience**: Centralize the solar value chain into a single customer experience.
- **Stakeholder Collaboration**: Tailored interfaces for Administrators, Vendors, Technicians, and Customers.
- **Operational Scalability**: Monorepo architecture for rapid feature parity across web and mobile via shared logic.

## System Architecture
Managed via npm workspaces:
- `apps/web-admin`: React + Vite (Admin/Vendor Dashboards).
- `apps/mobile`: React Native + Expo (Customer/Technician App).
- `apps/backend`: Express.js (Core API).
- `packages/shared`: Centralized business logic and validation.
- `packages/types`: Unified type definitions.
- `packages/ui`: Reusable React component library.

## Key Functional Modules
- **E-Commerce**: Vendor inventory management, order lifecycle tracking.
- **Service Platform**: Installation scheduling, Technician dispatch, Annual Maintenance Contracts (AMC).
- **Gig-Economy Model**: Flexible technician workforce with "Blinkit-style" job allocation and quality verification.

## Technical Standards
- **Runtime**: Node.js v18+.
- **Package Manager**: npm v7+.
- **Type Safety**: Ensure consistent data structures across all apps using `@solar-hub/types`.
- **Validation**: Centralize rules in `@solar-hub/shared` to prevent bypass and ensure consistency.
