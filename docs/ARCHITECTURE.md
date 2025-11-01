# System Architecture

## Overview

The Blockchain Certificate Verification System is a full-stack decentralized application built on a three-tier architecture:

1. **Frontend Layer** (React + Vite)
2. **Backend Layer** (Express.js)
3. **Blockchain Layer** (Ethereum + IPFS)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    React Application                          │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐             │  │
│  │  │   Admin    │  │  Student   │  │   Verify   │             │  │
│  │  │ Dashboard  │  │ Dashboard  │  │    Page    │             │  │
│  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘             │  │
│  │        │               │               │                     │  │
│  │        └───────────────┴───────────────┘                     │  │
│  │                        │                                      │  │
│  │                ┌───────▼────────┐                            │  │
│  │                │ Wallet Context │                            │  │
│  │                └───────┬────────┘                            │  │
│  │                        │                                      │  │
│  │        ┌───────────────┴───────────────┐                     │  │
│  │        │                               │                     │  │
│  │   ┌────▼─────┐                  ┌──────▼──────┐             │  │
│  │   │ Ethers.js│                  │  API Client │             │  │
│  │   │ Contract │                  │   (Axios)   │             │  │
│  │   │Interface │                  └──────┬──────┘             │  │
│  │   └────┬─────┘                         │                     │  │
│  └────────┼───────────────────────────────┼─────────────────────┘  │
└───────────┼───────────────────────────────┼────────────────────────┘
            │                               │
    ┌───────▼──────────┐           ┌────────▼──────────┐
    │   MetaMask       │           │  Backend API      │
    │   Provider       │           │  (Express.js)     │
    └───────┬──────────┘           └────────┬──────────┘
            │                               │
            │                      ┌────────┴────────┐
            │                      │                 │
    ┌───────▼──────────┐    ┌──────▼────────┐ ┌────▼──────┐
    │   Ethereum       │    │     IPFS      │ │    JWT    │
    │   Blockchain     │    │   (Pinata)    │ │   Auth    │
    │                  │    │               │ │           │
    │  - Smart         │    │  - File       │ │ - Admin   │
    │    Contract      │    │    Storage    │ │   Login   │
    │  - Certificate   │    │  - Pin Files  │ │ - Token   │
    │    Records       │    │  - Retrieve   │ │   Verify  │
    └──────────────────┘    └───────────────┘ └───────────┘
```

## Component Architecture

### Frontend Components

```
src/
├── components/
│   ├── Navbar.jsx                 # Main navigation
│   └── WalletConnect.jsx          # MetaMask connection UI
│
├── pages/
│   ├── Home.jsx                   # Landing page
│   ├── Admin.jsx                  # Certificate issuance
│   ├── Student.jsx                # View certificates
│   └── Verify.jsx                 # Certificate verification
│
├── context/
│   └── WalletContext.jsx          # Global wallet state
│
├── utils/
│   ├── api.js                     # Backend API calls
│   ├── contract.js                # Smart contract interaction
│   └── wallet.js                  # MetaMask utilities
│
└── App.jsx                        # Main app with routing
```

### Backend Architecture

```
backend/
├── routes/
│   ├── auth.js                    # JWT authentication
│   ├── ipfs.js                    # IPFS file operations
│   └── contract.js                # Blockchain queries
│
├── middleware/
│   └── auth.js                    # JWT verification
│
└── server.js                      # Express app entry
```

### Smart Contract Architecture

```solidity
CertificateVerification
├── State Variables
│   ├── _certificateIdCounter      # Auto-increment ID
│   ├── certificates               # ID → Certificate mapping
│   ├── studentCertificates        # Address → IDs mapping
│   ├── ipfsHashToCertId           # Hash → ID mapping
│   └── authorizedAdmins           # Admin whitelist
│
├── Structs
│   └── Certificate                # Certificate data structure
│
├── Events
│   ├── CertificateIssued
│   ├── CertificateRevoked
│   └── AdminUpdated
│
├── Modifiers
│   └── onlyAdmin                  # Access control
│
└── Functions
    ├── Admin Functions
    │   ├── issueCertificate()
    │   ├── revokeCertificate()
    │   └── setAdmin()
    │
    └── Public Functions
        ├── verifyCertificate()
        ├── verifyCertificateByHash()
        ├── getCertificateDetails()
        ├── getStudentCertificates()
        └── isAdmin()
```

## Data Flow

### Certificate Issuance Flow

```
Admin UI
   │
   ├─> 1. Fill certificate form
   │
   ├─> 2. Upload PDF to IPFS
   │      │
   │      └─> Backend API (/api/ipfs/upload)
   │             │
   │             └─> Pinata API
   │                    │
   │                    └─> Returns IPFS hash
   │
   ├─> 3. Call smart contract
   │      │
   │      └─> issueCertificate(name, course, hash, address)
   │             │
   │             └─> MetaMask signs transaction
   │                    │
   │                    └─> Ethereum blockchain
   │                           │
   │                           ├─> Store certificate data
   │                           ├─> Emit CertificateIssued event
   │                           └─> Return certificate ID
   │
   └─> 4. Display success + certificate ID
```

### Certificate Verification Flow

```
Verify UI
   │
   ├─> 1. Enter certificate ID or IPFS hash
   │
   ├─> 2. Query smart contract
   │      │
   │      └─> verifyCertificate(id) or verifyCertificateByHash(hash)
   │             │
   │             └─> Ethereum blockchain (read-only)
   │                    │
   │                    └─> Returns certificate data + validity
   │
   ├─> 3. Display verification result
   │      │
   │      ├─> ✅ Valid certificate
   │      └─> ❌ Revoked/Invalid certificate
   │
   └─> 4. Option to view PDF on IPFS
          │
          └─> Construct IPFS gateway URL
                 │
                 └─> https://gateway.pinata.cloud/ipfs/{hash}
```

### Student View Flow

```
Student UI
   │
   ├─> 1. Connect MetaMask wallet
   │      │
   │      └─> Get wallet address
   │
   ├─> 2. Query smart contract
   │      │
   │      └─> getStudentCertificates(address)
   │             │
   │             └─> Returns array of certificate IDs
   │
   ├─> 3. Fetch details for each ID
   │      │
   │      └─> getCertificateDetails(id)
   │             │
   │             └─> Returns full certificate data
   │
   └─> 4. Display all certificates
          │
          └─> Show name, course, date, IPFS link
```

## Security Architecture

### Smart Contract Security

1. **Access Control**
   - OpenZeppelin's Ownable for owner management
   - Custom admin whitelist
   - Modifier-based function protection

2. **Input Validation**
   - Non-empty string checks
   - Valid address verification
   - Duplicate hash prevention

3. **State Management**
   - Immutable certificate records
   - Revocation flag (no deletion)
   - Comprehensive event logging

### Backend Security

1. **Authentication**
   - JWT token-based auth
   - Bcrypt password hashing
   - Admin-only routes

2. **File Upload Security**
   - File type validation
   - Size limits (10MB)
   - Multer memory storage

3. **API Security**
   - CORS configuration
   - Input sanitization
   - Error handling

### Frontend Security

1. **Wallet Security**
   - MetaMask signature verification
   - Network validation
   - Secure transaction signing

2. **Data Validation**
   - Client-side form validation
   - Ethereum address format checks
   - Error boundary handling

## Scalability Considerations

### Current Architecture
- Supports unlimited certificate issuance
- Linear gas cost per certificate
- IPFS ensures scalable file storage
- Read operations are free

### Optimization Strategies

1. **Gas Optimization**
   - Efficient struct packing
   - Minimal storage writes
   - Batch operations possible

2. **IPFS Optimization**
   - CDN-like gateway distribution
   - Multiple gateway fallbacks
   - Pinata's global network

3. **Frontend Optimization**
   - React code splitting
   - Lazy loading routes
   - Efficient re-rendering

4. **Backend Optimization**
   - Caching strategies
   - Rate limiting
   - Load balancing ready

## Deployment Architecture

### Development Environment
```
Local Machine
├── Hardhat Node (localhost:8545)
├── Backend Server (localhost:5000)
└── Vite Dev Server (localhost:3000)
```

### Testnet Deployment
```
Sepolia Testnet
├── Smart Contract (verified on Etherscan)
├── Backend (cloud hosting)
└── Frontend (Vercel/Netlify)
```

### Production Deployment
```
Ethereum Mainnet
├── Smart Contract (verified on Etherscan)
├── Backend (AWS/GCP/Azure)
│   ├── Load Balancer
│   ├── Multiple instances
│   └── Database (optional)
└── Frontend (CDN)
    ├── Global edge locations
    └── SSL/TLS encryption
```

## Technology Integration

### Ethereum Integration
- **Provider**: Infura/Alchemy RPC endpoints
- **Library**: Ethers.js v6
- **Network**: Sepolia testnet / Ethereum mainnet
- **Gas**: Dynamic gas pricing

### IPFS Integration
- **Service**: Pinata Cloud
- **API**: REST API with JWT auth
- **Gateways**: Multiple public gateways
- **Redundancy**: Automatic pinning

### MetaMask Integration
- **Detection**: window.ethereum
- **Connection**: eth_requestAccounts
- **Signing**: Personal signatures
- **Events**: accountsChanged, chainChanged

## Monitoring & Logging

### Smart Contract Events
```solidity
event CertificateIssued(
    uint256 indexed certificateId,
    address indexed studentAddress,
    ...
)
```

### Backend Logging
- Request/response logs
- Error tracking
- Transaction monitoring
- IPFS upload logs

### Frontend Analytics
- User interactions
- Wallet connections
- Transaction submissions
- Error tracking

## Future Enhancements

1. **Layer 2 Integration**
   - Deploy on Polygon/Arbitrum
   - Reduce gas costs
   - Faster transactions

2. **Advanced Features**
   - Batch certificate issuance
   - Certificate templates
   - Multi-signature admin
   - Certificate expiration

3. **Analytics Dashboard**
   - Total certificates issued
   - Verification statistics
   - Admin activity logs
   - Student engagement metrics

4. **Mobile Support**
   - Mobile-optimized UI
   - WalletConnect integration
   - Progressive Web App (PWA)

---

**Architecture Version**: 1.0.0  
**Last Updated**: 2025
