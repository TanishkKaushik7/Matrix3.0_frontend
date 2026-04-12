# Provectus Frontend 

Provectus is a blockchain-backed academic credential system with role-based workflows for issuers, admins, and public verifiers.

This repository contains:
1. A React + TypeScript + Vite frontend.
2. A local Hardhat workspace for deploying the certificate contract to Ganache.
3. A one-command local developer workflow that can start chain + deploy + frontend.

## Table Of Contents

1. Project Purpose
2. Architecture Overview
3. Tech Stack
4. Prerequisites
5. Quick Start (Clone To Running App)
6. Environment Variables
7. Local Blockchain Workflows
8. MetaMask Setup (Ganache)
9. Application Workflows
10. Folder Structure Explanation
11. Available Scripts
12. API Contract Used By Frontend
13. Production Deployment Guidance
14. Troubleshooting

## Project Purpose

Provectus is designed to issue and verify certificate records with two layers:
1. Off-chain metadata and access control through backend APIs.
2. On-chain immutable proof through a smart contract transaction.

Typical flow:
1. Issuer logs in.
2. Issuer generates certificate payload through backend.
3. Issuer signs blockchain mint transaction in MetaMask.
4. Frontend links resulting tx hash back to backend record.
5. Public verifier checks certificate by transaction hash.

## Architecture Overview

High-level architecture:
1. Frontend: React SPA handles UI, auth session, dashboards, and MetaMask interaction.
2. Backend API: Handles issuer/admin auth, issuer approvals, payload generation, and record storage.
3. Blockchain contract: Stores immutable certificate mint records.
4. Wallet: User-controlled signing through MetaMask.

Transaction responsibility:
1. Issuer wallet pays gas and signs transaction.
2. Transaction is sent to contract address, not to backend.
3. Backend is updated only after tx success.

## Tech Stack

Frontend:
1. React 19
2. TypeScript
3. Vite
4. Tailwind CSS 4
5. Framer Motion
6. Ethers v6

Blockchain tooling:
1. Hardhat
2. Ganache (local chain)
3. Solidity 0.8.24

## Prerequisites

Install before running:
1. Node.js 18 or later (Node.js 20+ recommended)
2. npm 9 or later
3. MetaMask browser extension
4. Backend API running and reachable by `VITE_API_URL`

Optional but recommended:
1. Ganache Desktop for local chain visual UI

## Quick Start (Clone To Running App)

### 1. Clone

```bash
git clone <your-repo-url>
cd Matrix3.0_frontend
```

### 2. Install Dependencies

Install frontend dependencies:

```bash
npm install
```

Install blockchain workspace dependencies:

```bash
npm --prefix blockchain install
```

### 3. Configure Frontend Environment

Create your local env file from template:

```bash
cp .env.example .env
```

Set values in `.env`:
1. `VITE_API_URL` -> your backend URL
2. `VITE_CERTIFICATE_CONTRACT_ADDRESS` -> deployed contract address (you will get this after deploy)

### 4. Run Full Local Workflow (Recommended)

```bash
npm run dev:local
```

What this command does:
1. Starts Ganache on `127.0.0.1:8545` with deterministic accounts.
2. Deploys contract from `blockchain` workspace.
3. Prints first private key and deployed contract address in terminal.
4. Starts frontend dev server.

After command output appears:
1. Copy private key and import into MetaMask.
2. Copy `VITE_CERTIFICATE_CONTRACT_ADDRESS=...` value.
3. Paste it into `.env`.
4. Restart `npm run dev` if you changed `.env` while server was already running.

## Environment Variables

Frontend env file (`.env`):

```env
VITE_API_URL=http://localhost:8000
VITE_CERTIFICATE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

Blockchain env file (`blockchain/.env`):

```env
GANACHE_RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=
```

Notes:
1. `PRIVATE_KEY` can be empty for local unlocked account usage.
2. Each redeploy creates a new contract address; update frontend env accordingly.

## Local Blockchain Workflows

### Workflow A: One-command orchestrated local setup

```bash
npm run dev:local
```

Use this when you want the fastest local setup with deterministic account output.

### Workflow B: Manual step-by-step

Compile contract:

```bash
npm run contracts:compile
```

Deploy contract:

```bash
npm run deploy:ganache
```

Start frontend:

```bash
npm run dev
```

## MetaMask Setup (Ganache)

1. Add network manually:
2. Network Name: Localhost 8545
3. RPC URL: `http://127.0.0.1:8545`
4. Chain ID: `1337`
5. Currency Symbol: ETH
6. Import account using private key printed by terminal.
7. Connect site and choose the intended issuer wallet account.

## Application Workflows

### Public verification flow

1. User opens `/verify`.
2. User enters transaction hash.
3. Frontend calls public verify endpoint.
4. UI shows verification and metadata integrity status.

### Issuer flow

1. Register issuer at `/signup`.
2. Login at `/login` once approved.
3. Connect wallet in dashboard.
4. Generate payload and mint certificate.
5. Link transaction hash to backend certificate record.

### Admin flow

1. Login as admin.
2. Review issuer requests.
3. Approve or reject issuer.
4. Manage wallet whitelist/address mapping.

## Folder Structure Explanation

```text
Matrix3.0_frontend/
  blockchain/              # Hardhat workspace for local contract deployment
    contracts/             # Solidity contracts
    scripts/               # Deployment scripts
    hardhat.config.js      # Hardhat network/compiler config
  scripts/                 # Repo-level utility scripts (dev-local orchestrator)
  src/
    components/
      admin/               # Admin-specific UI components
      auth/                # Login and signup step components
      dashboard/           # Issuer dashboard components (mint, registry)
      home/                # Landing page components
      layouts/             # Shared page layout wrappers
      ui/                  # Reusable low-level UI primitives
    context/               # Global React context (auth/session)
    hooks/                 # Feature hooks (auth flow, wallet connection)
    pages/                 # Route-level page components
    services/              # API client modules for admin/issuer/public endpoints
    styles/                # Global styles and design tokens
    types/                 # Shared type declarations
  .env.example             # Frontend env template
  package.json             # Frontend scripts and dependencies
```

## Available Scripts

Root scripts:

1. `npm run dev` -> Start Vite dev server.
2. `npm run build` -> Type-check and build production bundle.
3. `npm run lint` -> Run ESLint.
4. `npm run preview` -> Preview built bundle.
5. `npm run contracts:compile` -> Compile Solidity contract from root.
6. `npm run deploy:ganache` -> Deploy contract from root via blockchain workspace.
7. `npm run dev:local` -> Start Ganache + deploy + start frontend.

Blockchain scripts:

1. `npm run compile` (inside `blockchain`) -> Hardhat compile.
2. `npm run deploy:ganache` (inside `blockchain`) -> Deploy to local Ganache network.

## API Contract Used By Frontend

Frontend expects these backend routes:

Auth:
1. `POST /auth/login`

Issuer:
1. `POST /issuer/register`
2. `POST /issuer/connect-wallet`
3. `GET /issuer/wallet-status`
4. `GET /issuer/me`
5. `GET /issuer/issued-certificate-count`

Certificate:
1. `POST /certificate/create`
2. `POST /certificate/link-token`
3. `GET /certificate/history`
4. `GET /certificate/verify/{token_id}`

Admin:
1. `GET /admin/issuers`
2. `PATCH /admin/issuers/{issuer_id}/status`
3. `POST /admin/whitelist-wallet`

## Production Deployment Guidance

Use this sequence for staging/production:

1. Deploy smart contract to target chain (Amoy/Mainnet) from secured deploy wallet.
2. Store deployed address in environment management system.
3. Set frontend `VITE_CERTIFICATE_CONTRACT_ADDRESS` per environment.
4. Set frontend `VITE_API_URL` to production backend URL.
5. Build and host frontend bundle:

```bash
npm ci
npm run build
```

6. Serve `dist` through your chosen static hosting/CDN.

Recommended hardening before production:
1. Move on-chain authorization checks into contract (issuer allowlist/roles).
2. Add CI checks for lint + typecheck + tests.
3. Use secrets manager for backend and deployment keys.
4. Enable monitoring and API rate limiting.
5. Use HTTPS and strict CORS policy.

## Troubleshooting

### 1) `HH108: Cannot connect to network ganache`

Cause:
1. RPC endpoint mismatch or Ganache not running.

Fix:
1. Ensure local RPC is `http://127.0.0.1:8545`.
2. Ensure chain ID is `1337`.

### 2) Transaction not visible on Amoy PolygonScan

Cause:
1. Transaction was executed on local Ganache, not Amoy.

Fix:
1. Check transaction in Ganache UI or local RPC logs.
2. Use Amoy explorer only for Amoy chain transactions.

### 3) Wrong wallet connected during mint

Cause:
1. MetaMask active account does not match issuer wallet expected by backend.

Fix:
1. Use wallet selection flow in dashboard.
2. Switch account in MetaMask and reconnect.

### 4) Logged out on refresh

Status:
1. Auth context persists session state in browser storage.
2. If issue reappears, clear storage and login again.

## License

Add your license terms here before public distribution.
