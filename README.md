# Blockchain Certificate Verification System

A full-stack decentralized application (DApp) for issuing and verifying academic certificates on the Ethereum blockchain with IPFS storage.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-orange.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![Node](https://img.shields.io/badge/Node-18+-green.svg)

## 🌟 Features

### For Administrators (Institutions)
- ✅ Connect wallet via MetaMask
- ✅ Upload certificate PDFs to IPFS (via Pinata)
- ✅ Issue certificates on the blockchain
- ✅ Manage certificate issuance with admin access control
- ✅ View transaction confirmations and certificate IDs

### For Students
- ✅ Connect wallet to view issued certificates
- ✅ See all certificates linked to their wallet address
- ✅ Download certificate PDFs from IPFS
- ✅ Share certificate IDs for verification

### For Verifiers (Public)
- ✅ Verify certificate authenticity by ID or IPFS hash
- ✅ View complete certificate details on-chain
- ✅ Check validity status (Valid/Revoked)
- ✅ Access certificate documents from IPFS
- ✅ No wallet connection required for verification

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React + Vite)                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Admin     │  │   Student    │  │   Verify     │       │
│  │  Dashboard  │  │  Dashboard   │  │    Page      │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │   Ethers.js    │                        │
│                    │   + MetaMask   │                        │
│                    └───────┬────────┘                        │
└────────────────────────────┼──────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼──────┐
│   Backend      │  │    Ethereum     │  │     IPFS     │
│   (Express)    │  │   Blockchain    │  │   (Pinata)   │
│                │  │                 │  │              │
│  - IPFS API    │  │  - Smart       │  │  - Store     │
│  - JWT Auth    │  │    Contract     │  │    PDFs      │
│  - Contract    │  │  - Certificate  │  │  - Retrieve  │
│    Interaction │  │    Records      │  │    Files     │
└────────────────┘  └─────────────────┘  └──────────────┘
```

## 🛠️ Tech Stack

### Blockchain
- **Ethereum**: Decentralized blockchain platform
- **Solidity**: Smart contract language (v0.8.20)
- **Hardhat**: Development environment, testing, and deployment
- **OpenZeppelin**: Secure smart contract library

### Storage
- **IPFS**: Decentralized file storage
- **Pinata**: IPFS pinning service SDK

### Frontend
- **React.js**: UI library (v18.2)
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Ethers.js**: Ethereum interaction library
- **Lucide React**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **JWT**: Authentication tokens
- **Axios**: HTTP client
- **Multer**: File upload middleware

## 📋 Prerequisites

- **Node.js** v18+ and npm
- **MetaMask** browser extension
- **Git** for version control
- **Ethereum testnet ETH** (Sepolia) for deployment

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Blockchain
```

### 2. Install Dependencies

```bash
# Install all dependencies for all modules
npm run install:all

# Or install individually
cd contracts && npm install
cd ../backend && npm install
cd ../frontend && npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Blockchain Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key_here

# Pinata IPFS Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key
PINATA_JWT=your_pinata_jwt_token

# Backend Configuration
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Frontend Configuration
VITE_CONTRACT_ADDRESS=deployed_contract_address
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Get Required API Keys

#### Infura (Ethereum RPC)
1. Visit [infura.io](https://infura.io/)
2. Create a free account
3. Create a new project
4. Copy the Sepolia endpoint URL

#### Pinata (IPFS)
1. Visit [pinata.cloud](https://www.pinata.cloud/)
2. Create a free account
3. Go to API Keys section
4. Generate new API key and JWT token

### 5. Get Test ETH

For Sepolia testnet:
1. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
2. Enter your wallet address
3. Receive test ETH (0.5 ETH)

## 🔧 Development

### Compile Smart Contracts

```bash
cd contracts
npx hardhat compile
```

### Run Tests

```bash
cd contracts
npx hardhat test
```

Expected output:
```
  CertificateVerification
    Deployment
      ✔ Should set the right owner
      ✔ Should authorize the owner as admin
      ✔ Should start with zero certificates
    ...
  51 passing (2s)
```

### Deploy to Local Network

Terminal 1 - Start Hardhat node:
```bash
cd contracts
npx hardhat node
```

Terminal 2 - Deploy contract:
```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

Copy the deployed contract address and update `.env`:
```env
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Deploy to Sepolia Testnet

```bash
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
```

Save the contract address and update `.env`.

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📱 Usage Guide

### Admin Workflow

1. **Connect Wallet**
   - Click "Connect Wallet" in the navbar
   - Approve MetaMask connection
   - Ensure you're on the correct network

2. **Issue Certificate**
   - Navigate to Admin Dashboard
   - Fill in student details:
     - Student name
     - Course name
     - Student wallet address
   - Upload certificate PDF
   - Click "Upload to IPFS"
   - Wait for IPFS hash confirmation
   - Click "Issue Certificate"
   - Confirm transaction in MetaMask
   - Wait for blockchain confirmation
   - Note the Certificate ID

### Student Workflow

1. **View Certificates**
   - Connect your wallet
   - Navigate to Student Dashboard
   - View all certificates issued to your address
   - Download certificate PDFs
   - Share certificate ID with verifiers

### Verifier Workflow

1. **Verify Certificate**
   - Navigate to Verify page (no wallet needed)
   - Choose verification method:
     - By Certificate ID (number)
     - By IPFS Hash (Qm...)
   - Enter the ID or hash
   - Click "Verify Certificate"
   - View verification result:
     - ✅ Valid: Certificate is authentic
     - ❌ Revoked: Certificate has been revoked
   - View certificate details
   - Download certificate document

## 🧪 Testing

### Smart Contract Tests

```bash
cd contracts
npx hardhat test
```

### Test Coverage

```bash
cd contracts
npx hardhat coverage
```

### Manual Testing Checklist

- [ ] Connect MetaMask wallet
- [ ] Switch between networks
- [ ] Upload file to IPFS
- [ ] Issue certificate (admin)
- [ ] View student certificates
- [ ] Verify certificate by ID
- [ ] Verify certificate by IPFS hash
- [ ] Check revoked certificate
- [ ] Test error handling
- [ ] Test with unauthorized wallet

## 📊 Smart Contract Functions

### Admin Functions

```solidity
// Issue a new certificate
function issueCertificate(
    string memory studentName,
    string memory courseName,
    string memory ipfsHash,
    address studentAddress
) external onlyAdmin returns (uint256)

// Revoke a certificate
function revokeCertificate(uint256 certificateId) external onlyAdmin

// Add/remove admin
function setAdmin(address admin, bool authorized) external onlyOwner
```

### Public View Functions

```solidity
// Verify certificate by ID
function verifyCertificate(uint256 certificateId) 
    external view returns (bool isValid, Certificate memory)

// Verify by IPFS hash
function verifyCertificateByHash(string memory ipfsHash) 
    external view returns (bool isValid, Certificate memory)

// Get certificate details
function getCertificateDetails(uint256 certificateId) 
    external view returns (Certificate memory)

// Get student's certificates
function getStudentCertificates(address studentAddress) 
    external view returns (uint256[] memory)

// Check admin status
function isAdmin(address admin) external view returns (bool)
```

## 🔒 Security Features

- ✅ **Access Control**: Only authorized admins can issue certificates
- ✅ **Immutable Records**: Blockchain ensures data cannot be altered
- ✅ **Duplicate Prevention**: IPFS hash uniqueness check
- ✅ **Input Validation**: Comprehensive checks on all inputs
- ✅ **Event Logging**: All actions emit events for transparency
- ✅ **OpenZeppelin Security**: Battle-tested contract libraries

## 🌐 API Endpoints

### Authentication

```
POST /api/auth/login
Body: { username, password }
Response: { token, user }

POST /api/auth/verify
Body: { token }
Response: { valid, user }
```

### IPFS

```
POST /api/ipfs/upload
Headers: Authorization: Bearer <token>
Body: FormData with file
Response: { ipfsHash, ipfsUrl }

GET /api/ipfs/:hash
Response: { ipfsHash, ipfsUrl, alternativeGateways }
```

### Contract

```
GET /api/contract/info
Response: { contractAddress, owner, totalCertificates }

GET /api/contract/certificate/:id
Response: { certificate }

POST /api/contract/verify
Body: { certificateId } or { ipfsHash }
Response: { isValid, certificate }

GET /api/contract/student/:address
Response: { certificates[] }
```

## 📁 Project Structure

```
Blockchain/
├── contracts/              # Smart contracts
│   ├── contracts/
│   │   └── CertificateVerification.sol
│   ├── scripts/
│   │   ├── deploy.js
│   │   └── interact.js
│   ├── test/
│   │   └── CertificateVerification.test.js
│   ├── deployments/       # Deployment info
│   ├── hardhat.config.js
│   └── package.json
│
├── backend/               # Express.js backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── ipfs.js
│   │   │   └── contract.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── server.js
│   └── package.json
│
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── WalletConnect.jsx
│   │   ├── context/
│   │   │   └── WalletContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Admin.jsx
│   │   │   ├── Student.jsx
│   │   │   └── Verify.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── contract.js
│   │   │   └── wallet.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEPLOYMENT.md
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🚢 Production Deployment

### Deploy Smart Contract to Mainnet

⚠️ **WARNING**: Deploying to mainnet costs real ETH. Test thoroughly on testnet first!

```bash
cd contracts
npx hardhat run scripts/deploy.js --network mainnet
```

### Build Frontend for Production

```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`

### Deploy Backend

Set environment to production:
```env
NODE_ENV=production
```

Start the server:
```bash
cd backend
npm start
```

The backend will serve the React build files.

## 🐛 Troubleshooting

### MetaMask Connection Issues
- Ensure MetaMask is installed
- Check if you're on the correct network
- Try disconnecting and reconnecting

### Contract Deployment Fails
- Check you have sufficient testnet ETH
- Verify RPC URL is correct
- Ensure private key is set correctly

### IPFS Upload Fails
- Verify Pinata API keys are correct
- Check file size (max 10MB)
- Ensure file type is PDF or image

### Transaction Fails
- Check gas price settings
- Ensure wallet has sufficient ETH
- Verify admin authorization

## 📚 Additional Resources

- [Ethereum Documentation](https://ethereum.org/developers)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [React Documentation](https://react.dev/)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review the troubleshooting section

---

**Built with ❤️ using Ethereum, IPFS, React, and Express**
