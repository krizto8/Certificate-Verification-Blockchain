# User Guide - Blockchain Certificate Verification System

Complete step-by-step guide for all users of the system.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Admin Guide](#admin-guide)
3. [Student Guide](#student-guide)
4. [Verifier Guide](#verifier-guide)
5. [Troubleshooting](#troubleshooting)
6. [FAQ](#faq)

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

1. **MetaMask Browser Extension**
   - Download from [metamask.io](https://metamask.io/)
   - Install in Chrome, Firefox, Brave, or Edge
   - Create a wallet and save your seed phrase securely

2. **Test ETH (for testnet)**
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Enter your wallet address
   - Receive 0.5 test ETH

3. **Modern Web Browser**
   - Chrome, Firefox, Brave, or Edge (latest version)
   - JavaScript enabled

### Initial Setup

1. **Install MetaMask**
   - Click "Get Started" in MetaMask
   - Create new wallet or import existing
   - Save seed phrase securely (NEVER share this!)
   - Set a strong password

2. **Connect to Sepolia Network**
   - Open MetaMask
   - Click network dropdown (usually says "Ethereum Mainnet")
   - Select "Sepolia Test Network"
   - If not visible, enable test networks in Settings

3. **Get Test ETH**
   - Copy your wallet address (click on account name)
   - Visit Sepolia faucet
   - Paste address and request ETH
   - Wait 1-2 minutes for confirmation

---

## Admin Guide

### Role: Educational Institution

Admins can issue certificates to students on the blockchain.

### Step 1: Access Admin Dashboard

1. Visit the application URL
2. Click "Admin" in the navigation menu
3. Click "Connect Wallet" button
4. MetaMask popup will appear

### Step 2: Connect Wallet

1. Click "Connect" in MetaMask popup
2. Select your admin account
3. Click "Next" and then "Connect"
4. Your wallet address will appear in the navbar

**Important**: Only authorized admin wallets can issue certificates. Contact the contract owner if you need admin access.

### Step 3: Issue a Certificate

#### Fill in Certificate Details

1. **Student Name**: Enter the full name of the student
   - Example: `John Smith`
   - Cannot be empty

2. **Course Name**: Enter the course or program name
   - Example: `Blockchain Development Certificate Program`
   - Be specific and consistent

3. **Student Wallet Address**: Enter student's Ethereum address
   - Format: `0x...` (42 characters)
   - Example: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
   - Student must provide this address
   - Double-check for accuracy!

#### Upload Certificate PDF

4. **Select File**: Click "Choose File" button
   - Supported formats: PDF, PNG, JPG
   - Maximum size: 10 MB
   - Recommended: High-resolution PDF

5. **Upload to IPFS**: Click "Upload to IPFS" button
   - Wait for upload (may take 10-30 seconds)
   - IPFS hash will appear (starts with "Qm...")
   - Example: `QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG`

#### Issue on Blockchain

6. **Issue Certificate**: Click "Issue Certificate" button
   - MetaMask will popup
   - Review transaction details
   - Click "Confirm" to proceed
   - Transaction submitted message appears

7. **Wait for Confirmation**
   - Blockchain confirmation takes 15-30 seconds
   - Success message shows Certificate ID
   - Example: `Certificate issued successfully! Certificate ID: 1`

8. **Record Certificate ID**
   - Save the Certificate ID
   - Share with student
   - Keep for your records

### Step 4: Verify Issuance

1. Go to "Verify" page
2. Enter the Certificate ID
3. Click "Verify Certificate"
4. Confirm details are correct

### Common Admin Tasks

#### Issue Multiple Certificates

Repeat Steps 3 for each student. Tips:
- Prepare all student data in advance
- Upload PDFs in batch to IPFS
- Issue certificates one by one
- Keep a spreadsheet of Certificate IDs

#### Check Transaction Status

1. Click on MetaMask extension
2. Go to "Activity" tab
3. View recent transactions
4. Click transaction to view on Etherscan

#### View All Issued Certificates

Currently not available in UI. To track:
- Keep a spreadsheet of issued certificates
- Record: Certificate ID, Student Name, Date, Transaction Hash

---

## Student Guide

### Role: Certificate Recipient

Students can view and download their certificates.

### Step 1: Receive Your Certificate

Your institution will:
1. Issue certificate with your wallet address
2. Provide you with:
   - Certificate ID (e.g., `1`)
   - Transaction hash (optional)
   - Link to verify certificate

### Step 2: View Your Certificates

#### Option A: Connect Wallet

1. Visit the application
2. Click "Student" in navigation
3. Click "Connect Wallet"
4. Select your account in MetaMask
5. Click "Next" and "Connect"
6. All your certificates will display automatically

#### Option B: Use Verify Page

If you don't want to connect wallet:
1. Go to "Verify" page
2. Enter your Certificate ID
3. Click "Verify Certificate"
4. View certificate details

### Step 3: Download Your Certificate

1. On Student Dashboard or Verify page
2. Click "View Certificate" button
3. PDF opens in new tab
4. Right-click → "Save As" to download
5. Save to your computer

### Step 4: Share Your Certificate

To share with employers or verifiers:

**Share Certificate ID**:
```
My Certificate ID: 1
Verify at: https://your-app-url.com/verify
```

**Share IPFS Hash**:
```
IPFS Hash: QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG
Verify at: https://your-app-url.com/verify
```

**Share Direct Link**:
```
https://your-app-url.com/verify?id=1
```

### What You'll See

Each certificate card shows:
- ✅ **Certificate ID**: Unique number
- 📅 **Issue Date**: When it was issued
- 👤 **Student Name**: Your name
- 📚 **Course Name**: Course/program
- 🔗 **IPFS Hash**: File identifier
- ✔️ **Status**: Valid or Revoked
- 👨‍💼 **Issued By**: Institution's wallet address

---

## Verifier Guide

### Role: Employer, Recruiter, or Anyone

Verify certificate authenticity without needing a wallet.

### Step 1: Obtain Certificate Information

Request from the certificate holder:
- Certificate ID, OR
- IPFS Hash, OR
- Both (for cross-verification)

### Step 2: Access Verification Page

1. Visit the application
2. Click "Verify" in navigation menu
3. No wallet connection needed!

### Step 3: Choose Verification Method

#### Method 1: Verify by Certificate ID

1. Select "Certificate ID" radio button
2. Enter the ID number
   - Example: `1`
   - Must be a number
3. Click "Verify Certificate"

#### Method 2: Verify by IPFS Hash

1. Select "IPFS Hash" radio button
2. Enter the hash
   - Starts with `Qm...`
   - Example: `QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG`
3. Click "Verify Certificate"

### Step 4: Review Results

#### ✅ Valid Certificate

Green checkmark appears with:
- **Status**: "Certificate Valid"
- **Message**: "This certificate is authentic and verified on the blockchain"
- **Certificate Details**:
  - Certificate ID
  - Student Name
  - Course Name
  - Issue Date
  - Student Wallet Address
  - Issuer Wallet Address
  - IPFS Hash

#### ❌ Revoked Certificate

Red X appears with:
- **Status**: "Certificate Revoked"
- **Message**: "This certificate has been revoked and is no longer valid"
- Details still visible but marked invalid

#### ⚠️ Not Found

Error message:
- "Certificate not found"
- Either doesn't exist or wrong ID/hash entered

### Step 5: View Certificate Document

1. Click "View Certificate Document" button
2. PDF opens in new browser tab
3. Review the actual certificate file
4. Compare details with blockchain data

### Verification Checklist

Verify the following match:
- [ ] Student name matches ID/resume
- [ ] Course name is relevant
- [ ] Issue date is reasonable
- [ ] Certificate status is "Valid"
- [ ] PDF document looks authentic
- [ ] Issuer address is recognized institution

### Red Flags

Be cautious if:
- ❗ Certificate is marked "Revoked"
- ❗ Details don't match resume/ID
- ❗ Issue date is suspicious
- ❗ PDF looks unprofessional
- ❗ IPFS link doesn't work
- ❗ Certificate not found

### Advanced Verification

For additional confidence:

1. **Check Issuer Address**
   - Copy issuer wallet address
   - Verify it's the institution's official address
   - Check institution's website

2. **View on Blockchain Explorer**
   - Go to [sepolia.etherscan.io](https://sepolia.etherscan.io)
   - Search for contract address
   - View all transactions
   - Find certificate issuance event

3. **Contact Institution**
   - Call/email the issuing institution
   - Provide Certificate ID
   - Confirm authenticity

---

## Troubleshooting

### Common Issues

#### "MetaMask is not installed"

**Solution**:
1. Install MetaMask from [metamask.io](https://metamask.io/)
2. Restart browser
3. Try connecting again

#### "Wrong Network"

**Solution**:
1. Open MetaMask
2. Click network dropdown
3. Select "Sepolia Test Network"
4. Refresh page

#### "Insufficient Funds"

**Solution**:
1. You need ETH for gas fees
2. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
3. Request test ETH
4. Wait for confirmation
5. Try transaction again

#### "Transaction Failed"

**Possible causes**:
- Not enough gas
- Network congestion
- Wrong parameters

**Solution**:
1. Check MetaMask for error message
2. Increase gas limit
3. Wait and try again
4. Verify all inputs are correct

#### "Not Authorized as Admin"

**Solution**:
- Only authorized wallets can issue certificates
- Contact contract owner
- Provide your wallet address
- Owner must call `setAdmin(yourAddress, true)`

#### "IPFS Upload Failed"

**Possible causes**:
- File too large (>10MB)
- Wrong file type
- Network issues
- Pinata API key issues

**Solution**:
1. Check file size and type
2. Try smaller/different file
3. Check internet connection
4. Verify Pinata configuration

#### "Certificate Not Found"

**Solution**:
1. Double-check Certificate ID
2. Ensure it's been issued
3. Try verifying by IPFS hash instead
4. Contact certificate issuer

### Browser Issues

#### MetaMask Not Detecting

1. Disable other crypto wallets
2. Try in incognito mode
3. Clear browser cache
4. Reinstall MetaMask

#### Page Not Loading

1. Check internet connection
2. Clear browser cache
3. Try different browser
4. Disable browser extensions

---

## FAQ

### General Questions

**Q: What is blockchain certificate verification?**  
A: It's a system that stores certificate information on the Ethereum blockchain, making certificates tamper-proof and instantly verifiable by anyone.

**Q: Do I need cryptocurrency to verify a certificate?**  
A: No! Verification is free and doesn't require a wallet or ETH. Only issuing certificates requires ETH for gas fees.

**Q: Is my personal data public on the blockchain?**  
A: Yes, certificate details (name, course, dates) are publicly visible on the blockchain. Don't include sensitive information like ID numbers or grades.

**Q: Can certificates be deleted?**  
A: No, blockchain data is immutable. Certificates can be revoked (marked invalid) but not deleted.

**Q: How long do certificates last?**  
A: Forever! Once on the blockchain, certificates are permanent (as long as Ethereum exists).

### Admin Questions

**Q: How much does issuing a certificate cost?**  
A: On Sepolia testnet: Free (test ETH)  
On mainnet: ~$2-10 per certificate (varies with gas prices)

**Q: Can I issue certificates in batch?**  
A: Not currently in the UI. Each certificate requires a separate transaction. Batch issuance can be added as a future feature.

**Q: Can I edit a certificate after issuing?**  
A: No, blockchain data is immutable. You can revoke an invalid certificate and issue a new one.

**Q: How do I become an admin?**  
A: The contract owner must authorize your wallet address by calling `setAdmin(yourAddress, true)`.

**Q: What if I make a mistake?**  
A: If you haven't confirmed the transaction, cancel in MetaMask. If already confirmed, revoke the certificate and issue a new one.

### Student Questions

**Q: Do I need to pay for my certificate?**  
A: No, viewing and downloading your certificate is completely free.

**Q: What if I lose my Certificate ID?**  
A: Connect your wallet on the Student Dashboard - all your certificates will appear automatically.

**Q: Can I transfer my certificate to a new wallet?**  
A: No, certificates are permanently linked to the wallet address provided during issuance.

**Q: Will my certificate work on all networks?**  
A: The certificate exists on the specific network it was issued on (e.g., Sepolia testnet or Ethereum mainnet).

### Verifier Questions

**Q: How do I know the certificate is real?**  
A: If verification shows "Valid" status, the certificate authentically exists on the blockchain and hasn't been revoked.

**Q: Can certificates be faked?**  
A: No, blockchain ensures authenticity. Only authorized admins can issue certificates, and all issuance is recorded permanently.

**Q: What if the IPFS link doesn't work?**  
A: IPFS is decentralized - try alternative gateway URLs. The blockchain record remains valid even if one gateway is down.

**Q: Should I trust a revoked certificate?**  
A: No, if status shows "Revoked", the certificate is no longer valid. Contact the issuer for clarification.

### Technical Questions

**Q: What is IPFS?**  
A: InterPlanetary File System - a decentralized storage network for files. Certificate PDFs are stored here.

**Q: What is an IPFS hash?**  
A: A unique identifier for a file on IPFS (starts with "Qm..."). It's like a fingerprint for your certificate file.

**Q: What is a wallet address?**  
A: A 42-character identifier (0x...) that represents your Ethereum account. It's like a bank account number for crypto.

**Q: What are gas fees?**  
A: Transaction costs paid to Ethereum miners/validators. Required for writing data to the blockchain.

**Q: What is a smart contract?**  
A: Self-executing code on the blockchain that automatically enforces certificate rules and verification.

---

## Best Practices

### For Admins

✅ **Do**:
- Double-check student wallet addresses
- Keep records of Certificate IDs
- Test on testnet before mainnet
- Use high-quality PDFs
- Verify certificates after issuance
- Keep private keys secure

❌ **Don't**:
- Share your private key or seed phrase
- Issue duplicate certificates
- Use wrong network
- Include sensitive personal data
- Rush through verification

### For Students

✅ **Do**:
- Save your Certificate ID
- Download and backup your PDF
- Verify your certificate after receiving
- Use a secure wallet
- Share verification instructions with employers

❌ **Don't**:
- Lose your wallet access
- Share private keys
- Delete certificate information
- Expect instant issuance (blockchain takes time)

### For Verifiers

✅ **Do**:
- Verify both ID and hash if available
- Check the actual PDF document
- Confirm issuer is legitimate
- Contact institution if suspicious
- Keep verification records

❌ **Don't**:
- Accept revoked certificates
- Trust without verification
- Skip checking the PDF
- Ignore red flags

---

## Getting Help

### Support Channels

1. **Documentation**
   - README.md
   - ARCHITECTURE.md
   - API.md
   - This USER_GUIDE.md

2. **Technical Support**
   - GitHub Issues
   - Email: support@your-domain.com
   - Discord/Telegram community

3. **Institution Support**
   - Contact your educational institution
   - Provide Certificate ID
   - Include transaction hash if available

### Reporting Issues

When reporting problems, include:
1. What you were trying to do
2. What happened instead
3. Error messages (screenshot)
4. Browser and MetaMask version
5. Network you're using
6. Your wallet address (if relevant)

---

## Glossary

**Blockchain**: Distributed ledger technology that stores data across multiple computers

**Certificate ID**: Unique number assigned to each certificate (e.g., 1, 2, 3...)

**Ethereum**: Blockchain platform that runs smart contracts

**Gas**: Fee paid for transactions on Ethereum

**IPFS**: Decentralized file storage system

**MetaMask**: Browser extension wallet for Ethereum

**Smart Contract**: Self-executing code on blockchain

**Testnet**: Test version of blockchain (free, for testing)

**Mainnet**: Main Ethereum network (real money)

**Wallet Address**: Your Ethereum account identifier (0x...)

**Transaction Hash**: Unique identifier for blockchain transaction

---

**User Guide Version**: 1.0.0  
**Last Updated**: 2025
