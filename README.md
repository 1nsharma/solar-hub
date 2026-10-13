# SolarHub

SolarHub is a solar marketplace and service-network platform exploring workflows for rooftop solar, installation, AMC, technician jobs, vendor orders, partner leads, and customer savings tracking.

## What I built

SolarHub is structured as a monorepo with:

- **Web admin** — React + Vite dashboards
- **Mobile app** — React Native / Expo
- **Backend API** — Express.js
- **Shared packages** — business logic, types, and reusable UI

Recent engineering work includes a canonical calculator flow, lead creation, durable lead-event emission, and automated test coverage around those workflows.

## Architecture

```
Web / Mobile Clients
        ↓
     Backend API
        ↓
Business Services
        ↓
Data + Lead Events
        ↓
Operations / Partner Workflows
```

The implementation is evolving; this repository should be treated as an engineering case study rather than a claim of a completed commercial rollout.

## Repository Structure

```
apps/
├── web-admin/
├── mobile/
└── backend/

packages/
├── shared/
├── types/
└── ui/
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 7+

### Install

```bash
npm install
```

### Development

```bash
npm run dev -ws
```

Or run an individual workspace:

```bash
npm run dev -w @solar-hub/web-admin
npm run dev -w @solar-hub/backend
```

## Documentation

See the `docs/` directory for architecture, deployment, business-model, release, debugging, and local-runbook documentation.

## Status

**Engineering:** Active development  
**Product:** Case-study / development stage  
**Measured commercial outcomes:** Not yet measured

## License and Reuse

This repository is public for demonstration, review, and deployment visibility. It is not presented as an open-source project. See the repository's current licensing terms before reusing code or product assets.
