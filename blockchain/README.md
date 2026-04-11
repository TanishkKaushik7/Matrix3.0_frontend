# Local Contract Deployment (Ganache + Hardhat)

## 1) Prerequisites
- Ganache running on `http://127.0.0.1:8545`
- Chain ID is `1337`
- Optional: copy one Ganache account private key

## 2) Configure env
Create a `.env` file in this `blockchain` folder and paste:

```env
GANACHE_RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=
```

If `PRIVATE_KEY` is left empty, deploy uses Ganache unlocked remote accounts.

## 3) Compile
```bash
npm run compile
```

## 4) Deploy to Ganache
```bash
npm run deploy:ganache
```

Deployment output will print:
- `CertificateRegistry address: 0x...`
- `VITE_CERTIFICATE_CONTRACT_ADDRESS=0x...`

## 5) Wire frontend
Create or edit `.env.local` in the frontend root and set:

```env
VITE_CERTIFICATE_CONTRACT_ADDRESS=0xPASTE_DEPLOYED_ADDRESS
VITE_API_URL=http://localhost:8000
```

Then restart frontend dev server.

## 6) MetaMask alignment
- Import the same Ganache private key into MetaMask
- Use Ganache network (RPC `127.0.0.1:8545`, chain `1337`)
- Minting account in MetaMask should match deploy/issuer account expectations
