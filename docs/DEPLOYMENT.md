# Deployment Guide

Complete guide for deploying the Blockchain Certificate Verification System to various environments.

## Table of Contents

1. [Local Development Deployment](#local-development-deployment)
2. [Testnet Deployment (Sepolia)](#testnet-deployment-sepolia)
3. [Mainnet Deployment](#mainnet-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)

---

## Local Development Deployment

### Step 1: Start Local Blockchain

Open a terminal and start Hardhat node:

```bash
cd contracts
npx hardhat node
```

Keep this terminal open. It will display 20 test accounts with private keys.

Example output:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...
```

### Step 2: Deploy Smart Contract

In a new terminal:

```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

Output:
```
Starting deployment of CertificateVerification contract...
Deploying contract...
CertificateVerification deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Deployed by: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

Copy the contract address and update `.env`:

```env
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Step 3: Configure MetaMask for Local Network

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Add custom network:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH
4. Import test account:
   - Copy private key from Step 1
   - MetaMask → Import Account → Paste private key

### Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

Output:
```
🚀 Certificate Verification Backend Server
📡 Server running on port 5000
🌍 Environment: development
```

### Step 5: Start Frontend

```bash
cd frontend
npm run dev
```

Output:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 6: Test the Application

1. Open browser: `http://localhost:3000`
2. Connect MetaMask wallet
3. Try issuing a certificate (Admin page)
4. Verify the certificate (Verify page)

---

## Testnet Deployment (Sepolia)

### Prerequisites

1. **Get Sepolia ETH**
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Enter your wallet address
   - Receive 0.5 test ETH

2. **Get Infura API Key**
   - Visit [infura.io](https://infura.io/)
   - Create account and project
   - Copy Sepolia endpoint

3. **Get Pinata Keys**
   - Visit [pinata.cloud](https://www.pinata.cloud/)
   - Create account
   - Generate API key and JWT

### Step 1: Configure Environment

Update `.env`:

```env
# Sepolia Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key_without_0x

# Pinata
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key
PINATA_JWT=your_pinata_jwt

# Backend
PORT=5000
JWT_SECRET=your_random_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password_here

# Frontend (update after deployment)
VITE_CONTRACT_ADDRESS=will_be_updated
VITE_BACKEND_URL=http://localhost:5000
```

### Step 2: Deploy to Sepolia

```bash
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
```

Wait for deployment (may take 1-2 minutes):

```
Starting deployment of CertificateVerification contract...
Deploying contract...
CertificateVerification deployed to: 0x1234567890123456789012345678901234567890
Deployed by: 0xYourWalletAddress
Block Number: 4567890

Waiting for block confirmations...
Verifying contract on Etherscan...
Successfully submitted source code for contract
Contract verification success!
```

### Step 3: Update Configuration

Update `.env` with deployed contract address:

```env
VITE_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

### Step 4: Verify on Etherscan

Visit: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS`

You should see:
- ✅ Contract verified
- Source code visible
- Read/Write contract functions

### Step 5: Configure MetaMask for Sepolia

1. MetaMask → Networks → Add Sepolia
2. Ensure you have test ETH
3. Switch to Sepolia network

### Step 6: Test on Sepolia

1. Start backend and frontend locally
2. Connect wallet (Sepolia network)
3. Issue test certificate
4. Verify transaction on Etherscan
5. Check certificate verification

---

## Mainnet Deployment

⚠️ **WARNING**: Mainnet deployment costs real ETH. Ensure thorough testing on testnet first!

### Pre-Deployment Checklist

- [ ] Smart contract fully tested
- [ ] Security audit completed (recommended)
- [ ] Gas optimization reviewed
- [ ] Test deployment successful on testnet
- [ ] Sufficient ETH for deployment (~0.1 ETH)
- [ ] Admin wallet secured with hardware wallet
- [ ] Emergency procedures documented
- [ ] Monitoring systems ready

### Step 1: Final Security Review

```bash
cd contracts
npm run test
npm run coverage
```

Ensure:
- All tests pass (51/51 ✓)
- Coverage > 95%
- No critical vulnerabilities

### Step 2: Update Configuration

Create `.env.production`:

```env
# Mainnet
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_mainnet_wallet_private_key

# Production settings
NODE_ENV=production
```

### Step 3: Deploy to Mainnet

```bash
cd contracts
npx hardhat run scripts/deploy.js --network mainnet
```

Expected cost: ~0.05-0.1 ETH

### Step 4: Verify Contract

The script automatically verifies on Etherscan. If manual verification needed:

```bash
npx hardhat verify --network mainnet CONTRACT_ADDRESS
```

### Step 5: Set Up Admin Accounts

Using the deployed contract:

```javascript
const contract = await ethers.getContractAt("CertificateVerification", CONTRACT_ADDRESS);
await contract.setAdmin(ADMIN_ADDRESS, true);
```

### Step 6: Transfer Ownership (Optional)

For multi-sig security:

```javascript
await contract.transferOwnership(MULTISIG_ADDRESS);
```

---

## Backend Deployment

### Option 1: Heroku Deployment

**Step 1: Prepare for Heroku**

Create `Procfile` in backend directory:
```
web: node src/server.js
```

**Step 2: Deploy**

```bash
cd backend
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set PORT=443
heroku config:set JWT_SECRET=your_secret
heroku config:set PINATA_API_KEY=your_key
heroku config:set PINATA_SECRET_API_KEY=your_secret
heroku config:set VITE_CONTRACT_ADDRESS=your_contract

git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Option 2: AWS EC2 Deployment

**Step 1: Launch EC2 Instance**

- AMI: Ubuntu 22.04 LTS
- Instance Type: t2.micro (free tier)
- Security Group: Allow ports 80, 443, 22

**Step 2: Connect and Setup**

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone your-repo
cd Blockchain/backend
npm install
```

**Step 3: Configure Environment**

```bash
nano .env
# Add all production environment variables
```

**Step 4: Start with PM2**

```bash
pm2 start src/server.js --name cert-backend
pm2 startup
pm2 save
```

**Step 5: Setup Nginx Reverse Proxy**

```bash
sudo apt install nginx

sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

### Option 3: Docker Deployment

**Dockerfile** (backend directory):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

**Build and run**:

```bash
docker build -t cert-backend .
docker run -p 5000:5000 --env-file .env cert-backend
```

---

## Frontend Deployment

### Option 1: Vercel Deployment

**Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

**Step 2: Deploy**

```bash
cd frontend
vercel
```

Follow prompts:
- Set up and deploy? Yes
- Which scope? Your account
- Link to existing project? No
- Project name? cert-verification-frontend
- Directory? ./
- Override settings? No

**Step 3: Set Environment Variables**

In Vercel dashboard:
- Go to Settings → Environment Variables
- Add:
  - `VITE_CONTRACT_ADDRESS`
  - `VITE_BACKEND_URL`

**Step 4: Redeploy**

```bash
vercel --prod
```

### Option 2: Netlify Deployment

**Step 1: Build Production Bundle**

```bash
cd frontend
npm run build
```

**Step 2: Deploy via Netlify CLI**

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Step 3: Configure Environment**

In Netlify dashboard:
- Site Settings → Build & Deploy → Environment
- Add environment variables

### Option 3: AWS S3 + CloudFront

**Step 1: Build**

```bash
cd frontend
npm run build
```

**Step 2: Create S3 Bucket**

```bash
aws s3 mb s3://your-bucket-name
aws s3 website s3://your-bucket-name --index-document index.html
```

**Step 3: Upload Files**

```bash
aws s3 sync dist/ s3://your-bucket-name
```

**Step 4: Setup CloudFront**

- Create CloudFront distribution
- Origin: S3 bucket
- Enable HTTPS
- Custom domain (optional)

---

## Post-Deployment Checklist

### Smart Contract
- [ ] Contract verified on Etherscan
- [ ] Admin addresses configured
- [ ] Test certificate issued
- [ ] Verification working
- [ ] Events emitting correctly

### Backend
- [ ] API endpoints responding
- [ ] IPFS upload working
- [ ] JWT authentication functional
- [ ] CORS configured correctly
- [ ] Error logging enabled

### Frontend
- [ ] Deployed and accessible
- [ ] MetaMask connection working
- [ ] All pages loading correctly
- [ ] Contract interaction successful
- [ ] Mobile responsive

### Security
- [ ] Private keys secured
- [ ] Environment variables protected
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Monitoring alerts set up

### Documentation
- [ ] Deployment info saved
- [ ] Admin credentials documented
- [ ] Emergency procedures ready
- [ ] User guides published

---

## Monitoring & Maintenance

### Smart Contract Monitoring

```bash
# Watch events
npx hardhat run scripts/monitor-events.js --network sepolia
```

### Backend Monitoring

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs cert-backend
```

### Health Checks

Set up monitoring services:
- **UptimeRobot**: Check website availability
- **Sentry**: Error tracking
- **LogRocket**: User session replay
- **Etherscan**: Contract event monitoring

---

## Troubleshooting

### Deployment Issues

**Contract deployment fails**:
```bash
# Check gas price
npx hardhat run scripts/check-gas.js --network sepolia

# Increase gas limit in hardhat.config.js
gas: 5000000
```

**Backend won't start**:
```bash
# Check logs
pm2 logs --err

# Restart
pm2 restart all
```

**Frontend build fails**:
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Network Issues

**Wrong network in MetaMask**:
- Check network selection
- Verify chain ID matches
- Clear cached data

**Transaction fails**:
- Insufficient gas
- Wrong contract address
- Network congestion

---

## Rollback Procedures

### Smart Contract
- Cannot rollback (immutable)
- Deploy new version if needed
- Update frontend contract address

### Backend
```bash
# PM2 rollback
pm2 delete cert-backend
git checkout previous-commit
npm install
pm2 start src/server.js
```

### Frontend
```bash
# Vercel rollback
vercel rollback
```

---

## Cost Estimation

### Testnet (Free)
- Contract deployment: 0 ETH (testnet)
- Transactions: 0 ETH (testnet)
- Hosting: Free tier options available

### Mainnet
- Contract deployment: ~0.05-0.1 ETH (~$100-200)
- Certificate issuance: ~0.001-0.002 ETH per cert
- Hosting: $10-50/month
- IPFS (Pinata): Free tier (1GB)

---

**Deployment Guide Version**: 1.0.0  
**Last Updated**: 2025
