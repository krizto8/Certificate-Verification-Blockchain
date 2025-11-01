const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

/**
 * Get contract instance
 * @returns {Object} Contract instance and provider
 */
function getContract() {
  try {
    // Load contract ABI
    const abiPath = path.join(__dirname, '../../../contracts/deployments/CertificateVerification-ABI.json');
    
    if (!fs.existsSync(abiPath)) {
      throw new Error('Contract ABI not found. Please deploy the contract first.');
    }

    const contractABI = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    const contractAddress = process.env.VITE_CONTRACT_ADDRESS;

    if (!contractAddress) {
      throw new Error('Contract address not configured');
    }

    // Setup provider (default to localhost if not specified)
    const rpcUrl = process.env.SEPOLIA_RPC_URL || 'http://127.0.0.1:8545';
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    return { contract, provider, contractAddress };
  } catch (error) {
    console.error('Contract initialization error:', error);
    throw error;
  }
}

/**
 * @route GET /api/contract/info
 * @desc Get contract information
 * @access Public
 */
router.get('/info', async (req, res) => {
  try {
    const { contract, contractAddress } = getContract();
    
    const totalCertificates = await contract.getTotalCertificates();
    const owner = await contract.owner();

    res.json({
      success: true,
      contractAddress,
      owner,
      totalCertificates: totalCertificates.toString(),
      network: process.env.NETWORK || 'localhost'
    });

  } catch (error) {
    console.error('Contract info error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch contract info',
      details: error.message
    });
  }
});

/**
 * @route GET /api/contract/certificate/:id
 * @desc Get certificate details by ID
 * @access Public
 */
router.get('/certificate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { contract } = getContract();

    const certificate = await contract.getCertificateDetails(id);

    res.json({
      success: true,
      certificate: {
        id: certificate.id.toString(),
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        ipfsHash: certificate.ipfsHash,
        issueDate: certificate.issueDate.toString(),
        studentAddress: certificate.studentAddress,
        isValid: certificate.isValid,
        issuedBy: certificate.issuedBy
      }
    });

  } catch (error) {
    console.error('Certificate fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch certificate',
      details: error.message
    });
  }
});

/**
 * @route POST /api/contract/verify
 * @desc Verify certificate by ID or IPFS hash
 * @access Public
 */
router.post('/verify', async (req, res) => {
  try {
    const { certificateId, ipfsHash } = req.body;
    const { contract } = getContract();

    let isValid, certificate;

    if (certificateId) {
      [isValid, certificate] = await contract.verifyCertificate(certificateId);
    } else if (ipfsHash) {
      [isValid, certificate] = await contract.verifyCertificateByHash(ipfsHash);
    } else {
      return res.status(400).json({ error: 'Certificate ID or IPFS hash required' });
    }

    res.json({
      success: true,
      isValid,
      certificate: {
        id: certificate.id.toString(),
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        ipfsHash: certificate.ipfsHash,
        issueDate: certificate.issueDate.toString(),
        studentAddress: certificate.studentAddress,
        isValid: certificate.isValid,
        issuedBy: certificate.issuedBy
      }
    });

  } catch (error) {
    console.error('Certificate verification error:', error);
    res.status(500).json({ 
      error: 'Verification failed',
      details: error.message
    });
  }
});

/**
 * @route GET /api/contract/student/:address
 * @desc Get all certificates for a student address
 * @access Public
 */
router.get('/student/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { contract } = getContract();

    // Validate address
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const certificateIds = await contract.getStudentCertificates(address);
    
    // Fetch details for each certificate
    const certificates = [];
    for (let id of certificateIds) {
      const cert = await contract.getCertificateDetails(id);
      certificates.push({
        id: cert.id.toString(),
        studentName: cert.studentName,
        courseName: cert.courseName,
        ipfsHash: cert.ipfsHash,
        issueDate: cert.issueDate.toString(),
        studentAddress: cert.studentAddress,
        isValid: cert.isValid,
        issuedBy: cert.issuedBy
      });
    }

    res.json({
      success: true,
      studentAddress: address,
      totalCertificates: certificates.length,
      certificates
    });

  } catch (error) {
    console.error('Student certificates fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch student certificates',
      details: error.message
    });
  }
});

/**
 * @route GET /api/contract/admin/:address
 * @desc Check if address is an admin
 * @access Public
 */
router.get('/admin/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { contract } = getContract();

    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const isAdmin = await contract.isAdmin(address);

    res.json({
      success: true,
      address,
      isAdmin
    });

  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ 
      error: 'Failed to check admin status',
      details: error.message
    });
  }
});

module.exports = router;
