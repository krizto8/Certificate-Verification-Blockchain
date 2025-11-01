# 🚀 Quick Start Guide

Get the Blockchain Certificate Verification System running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MetaMask browser extension
- Git installed

## 5-Minute Setup

### 1. Clone & Install (2 minutes)

```bash
# Clone the repository
cd "c:\Users\dell\Downloads\Blockchain"

# Install all dependencies
npm run install:all
```

This installs dependencies for:
- Root project
- Smart contracts (Hardhat)
- Backend (Express)
- Frontend (React + Vite)

### 2. Configure Environment (1 minute)

```bash
# Copy environment template
copy .env.example .env

# Edit .env with your text editor
notepad .env
```

**Minimum required for local development:**
```env
VITE_CONTRACT_ADDRESS=will_be_updated_after_deployment
VITE_BACKEND_URL=http://localhost:5000
```

### 3. Start Local Blockchain (30 seconds)

Open **Terminal 1**:
```bash
cd contracts
npx hardhat node
```

Keep this running! Copy one of the private keys shown.

### 4. Deploy Contract (30 seconds)

Open **Terminal 2**:
```bash
cd contracts
npx hardhat run scripts\deploy.js --network localhost
```

Copy the contract address from output and update `.env`:
```env
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 5. Start Backend (30 seconds)

Open **Terminal 3**:
```bash
cd backend
npm run dev
```

Backend starts on `http://localhost:5000`

### 6. Start Frontend (30 seconds)

Open **Terminal 4**:
```bash
cd frontend
npm run dev
```

Frontend starts on `http://localhost:3000`

## First Use

### Connect MetaMask

1. Open browser: `http://localhost:3000`
2. Click "Connect Wallet"
3. Import the account from Hardhat (Step 3)
4. Approve connection

### Issue Test Certificate

1. Go to Admin Dashboard
2. Fill in:
   - Student Name: `Test Student`
   - Course: `Test Course`
   - Student Address: Use another Hardhat address
3. Upload any PDF file
4. Click "Upload to IPFS" (will fail without Pinata - OK for now)
5. Or directly issue with a test hash: `QmTestHash123`

### Verify Certificate

1. Go to Verify page
2. Enter Certificate ID: `1`
3. Click "Verify Certificate"
4. See the verification result!

## Next Steps

- ✅ [Read full README](../README.md)
- ✅ [Deploy to Sepolia testnet](DEPLOYMENT.md#testnet-deployment-sepolia)
- ✅ [Configure Pinata for IPFS](../README.md#4-get-required-api-keys)
- ✅ [Run tests](../README.md#run-tests)

## Common Issues

**"Cannot find module"**: Run `npm install` in the specific directory

**"Port already in use"**: Change port in `.env` or kill the process

**"Transaction failed"**: Make sure you're using the correct Hardhat account

**"MetaMask error"**: Add Hardhat network to MetaMask (localhost:8545, chainId: 31337)

## Testing Checklist

Quick tests to verify everything works:

- [ ] Backend responds at `http://localhost:5000/health`
- [ ] Frontend loads at `http://localhost:3000`
- [ ] MetaMask connects successfully
- [ ] Admin page loads without errors
- [ ] Contract interaction works (read function)
- [ ] Can view Student dashboard

## Clean Restart

If something goes wrong:

```bash
# Stop all terminals (Ctrl+C in each)

# Clean and reinstall
cd contracts
del /s /q node_modules package-lock.json
npm install

cd ..\backend
del /s /q node_modules package-lock.json
npm install

cd ..\frontend
del /s /q node_modules package-lock.json
npm install

# Restart from Step 3
```

## Production Deployment

For production setup, see:
- [Deployment Guide](DEPLOYMENT.md)
- [Sepolia Testnet Deployment](DEPLOYMENT.md#testnet-deployment-sepolia)

---

**Need help?** Check [USER_GUIDE.md](USER_GUIDE.md) or [README.md](../README.md)
