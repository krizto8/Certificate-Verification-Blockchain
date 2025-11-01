const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDFs and images
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'));
    }
  }
});

/**
 * @route POST /api/ipfs/upload
 * @desc Upload file to IPFS via Pinata
 * @access Private (Admin only)
 */
router.post('/upload', verifyToken, verifyAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check for Pinata credentials
    const pinataApiKey = process.env.PINATA_API_KEY;
    const pinataSecretKey = process.env.PINATA_SECRET_API_KEY;

    if (!pinataApiKey || !pinataSecretKey) {
      return res.status(500).json({ 
        error: 'IPFS configuration missing. Please set PINATA_API_KEY and PINATA_SECRET_API_KEY' 
      });
    }

    // Prepare form data for Pinata
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Optional metadata
    const metadata = JSON.stringify({
      name: req.file.originalname,
      keyvalues: {
        uploadedBy: req.user.username,
        uploadDate: new Date().toISOString(),
        type: 'certificate'
      }
    });
    formData.append('pinataMetadata', metadata);

    // Upload to Pinata
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretKey
        }
      }
    );

    const ipfsHash = response.data.IpfsHash;
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    res.json({
      success: true,
      ipfsHash,
      ipfsUrl,
      fileSize: req.file.size,
      fileName: req.file.originalname,
      timestamp: response.data.Timestamp
    });

  } catch (error) {
    console.error('IPFS upload error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to upload to IPFS',
      details: error.response?.data?.error || error.message
    });
  }
});

/**
 * @route GET /api/ipfs/:hash
 * @desc Get file URL from IPFS hash
 * @access Public
 */
router.get('/:hash', (req, res) => {
  try {
    const { hash } = req.params;
    
    if (!hash) {
      return res.status(400).json({ error: 'IPFS hash required' });
    }

    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${hash}`;
    
    res.json({
      ipfsHash: hash,
      ipfsUrl,
      alternativeGateways: [
        `https://ipfs.io/ipfs/${hash}`,
        `https://cloudflare-ipfs.com/ipfs/${hash}`,
        `https://gateway.pinata.cloud/ipfs/${hash}`
      ]
    });

  } catch (error) {
    console.error('IPFS retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve IPFS data' });
  }
});

/**
 * @route POST /api/ipfs/pin-json
 * @desc Pin JSON data to IPFS
 * @access Private (Admin only)
 */
router.post('/pin-json', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { data, name } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'JSON data required' });
    }

    const pinataApiKey = process.env.PINATA_API_KEY;
    const pinataSecretKey = process.env.PINATA_SECRET_API_KEY;

    if (!pinataApiKey || !pinataSecretKey) {
      return res.status(500).json({ 
        error: 'IPFS configuration missing' 
      });
    }

    const pinataBody = {
      pinataContent: data,
      pinataMetadata: {
        name: name || 'certificate-metadata',
        keyvalues: {
          uploadedBy: req.user.username,
          uploadDate: new Date().toISOString()
        }
      }
    };

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      pinataBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretKey
        }
      }
    );

    const ipfsHash = response.data.IpfsHash;

    res.json({
      success: true,
      ipfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      timestamp: response.data.Timestamp
    });

  } catch (error) {
    console.error('JSON pinning error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to pin JSON to IPFS',
      details: error.response?.data?.error || error.message
    });
  }
});

module.exports = router;
