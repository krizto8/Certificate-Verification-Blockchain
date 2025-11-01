# API Documentation

Complete API reference for the Blockchain Certificate Verification System backend.

## Base URL

```
Development: http://localhost:5000
Production: https://your-domain.com
```

## Authentication

Most endpoints are public except admin-only operations which require JWT authentication.

### Headers

```http
Content-Type: application/json
Authorization: Bearer <jwt_token>  # For admin endpoints
```

---

## Authentication Endpoints

### POST /api/auth/login

Admin login to obtain JWT token.

**Request:**

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

**Status Codes:**
- `200 OK`: Login successful
- `400 Bad Request`: Missing username or password
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

**Example:**

```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

const data = await response.json();
console.log(data.token);
```

---

### POST /api/auth/verify

Verify JWT token validity.

**Request:**

```http
POST /api/auth/verify
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "valid": true,
  "user": {
    "username": "admin",
    "role": "admin",
    "iat": 1640000000,
    "exp": 1640086400
  }
}
```

**Status Codes:**
- `200 OK`: Token valid
- `400 Bad Request`: Token missing
- `401 Unauthorized`: Invalid or expired token
- `500 Internal Server Error`: Server error

---

## IPFS Endpoints

### POST /api/ipfs/upload

Upload file to IPFS via Pinata. Requires admin authentication.

**Request:**

```http
POST /api/ipfs/upload
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

file: <binary_file_data>
```

**Form Data:**
- `file`: PDF or image file (max 10MB)

**Response:**

```json
{
  "success": true,
  "ipfsHash": "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
  "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
  "fileSize": 524288,
  "fileName": "certificate.pdf",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Status Codes:**
- `200 OK`: Upload successful
- `400 Bad Request`: No file provided
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not authorized as admin
- `500 Internal Server Error`: Upload failed

**Example (JavaScript):**

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/ipfs/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log('IPFS Hash:', data.ipfsHash);
```

**Example (cURL):**

```bash
curl -X POST http://localhost:5000/api/ipfs/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@certificate.pdf"
```

---

### GET /api/ipfs/:hash

Get IPFS URLs for a given hash.

**Request:**

```http
GET /api/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG
```

**Response:**

```json
{
  "ipfsHash": "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
  "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
  "alternativeGateways": [
    "https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    "https://cloudflare-ipfs.com/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    "https://gateway.pinata.cloud/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"
  ]
}
```

**Status Codes:**
- `200 OK`: Success
- `400 Bad Request`: Hash missing
- `500 Internal Server Error`: Server error

---

### POST /api/ipfs/pin-json

Pin JSON data to IPFS. Requires admin authentication.

**Request:**

```http
POST /api/ipfs/pin-json
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "data": {
    "name": "John Doe",
    "course": "Blockchain 101",
    "date": "2025-01-15"
  },
  "name": "certificate-metadata"
}
```

**Response:**

```json
{
  "success": true,
  "ipfsHash": "QmHash123...",
  "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmHash123...",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Status Codes:**
- `200 OK`: Success
- `400 Bad Request`: Missing data
- `401 Unauthorized`: Missing token
- `403 Forbidden`: Not admin
- `500 Internal Server Error`: Pinning failed

---

## Contract Endpoints

### GET /api/contract/info

Get smart contract information.

**Request:**

```http
GET /api/contract/info
```

**Response:**

```json
{
  "success": true,
  "contractAddress": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "owner": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "totalCertificates": "42",
  "network": "sepolia"
}
```

**Status Codes:**
- `200 OK`: Success
- `500 Internal Server Error`: Failed to fetch

---

### GET /api/contract/certificate/:id

Get certificate details by ID.

**Request:**

```http
GET /api/contract/certificate/1
```

**Response:**

```json
{
  "success": true,
  "certificate": {
    "id": "1",
    "studentName": "John Doe",
    "courseName": "Blockchain Development",
    "ipfsHash": "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    "issueDate": "1704096000",
    "studentAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "isValid": true,
    "issuedBy": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  }
}
```

**Status Codes:**
- `200 OK`: Success
- `500 Internal Server Error`: Certificate not found or error

**Example:**

```javascript
const response = await fetch('http://localhost:5000/api/contract/certificate/1');
const data = await response.json();
console.log('Student:', data.certificate.studentName);
```

---

### POST /api/contract/verify

Verify certificate by ID or IPFS hash.

**Request (by ID):**

```http
POST /api/contract/verify
Content-Type: application/json

{
  "certificateId": "1"
}
```

**Request (by Hash):**

```http
POST /api/contract/verify
Content-Type: application/json

{
  "ipfsHash": "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"
}
```

**Response:**

```json
{
  "success": true,
  "isValid": true,
  "certificate": {
    "id": "1",
    "studentName": "John Doe",
    "courseName": "Blockchain Development",
    "ipfsHash": "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    "issueDate": "1704096000",
    "studentAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "isValid": true,
    "issuedBy": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  }
}
```

**Status Codes:**
- `200 OK`: Success
- `400 Bad Request`: Missing certificate ID or hash
- `500 Internal Server Error`: Verification failed

**Example:**

```javascript
// Verify by ID
const response = await fetch('http://localhost:5000/api/contract/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ certificateId: '1' })
});

// Verify by hash
const response2 = await fetch('http://localhost:5000/api/contract/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ipfsHash: 'QmHash...' })
});
```

---

### GET /api/contract/student/:address

Get all certificates for a student address.

**Request:**

```http
GET /api/contract/student/0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

**Response:**

```json
{
  "success": true,
  "studentAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "totalCertificates": 2,
  "certificates": [
    {
      "id": "1",
      "studentName": "John Doe",
      "courseName": "Blockchain Development",
      "ipfsHash": "QmHash1...",
      "issueDate": "1704096000",
      "studentAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "isValid": true,
      "issuedBy": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    },
    {
      "id": "3",
      "studentName": "John Doe",
      "courseName": "Smart Contracts 101",
      "ipfsHash": "QmHash2...",
      "issueDate": "1704182400",
      "studentAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "isValid": true,
      "issuedBy": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    }
  ]
}
```

**Status Codes:**
- `200 OK`: Success
- `400 Bad Request`: Invalid address
- `500 Internal Server Error`: Failed to fetch

**Example:**

```javascript
const address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
const response = await fetch(`http://localhost:5000/api/contract/student/${address}`);
const data = await response.json();
console.log(`Found ${data.totalCertificates} certificates`);
```

---

### GET /api/contract/admin/:address

Check if address is authorized admin.

**Request:**

```http
GET /api/contract/admin/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

**Response:**

```json
{
  "success": true,
  "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "isAdmin": true
}
```

**Status Codes:**
- `200 OK`: Success
- `400 Bad Request`: Invalid address
- `500 Internal Server Error`: Failed to check

---

## Health Check

### GET /health

Check API health status.

**Request:**

```http
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "service": "Certificate Verification Backend"
}
```

**Status Codes:**
- `200 OK`: Service healthy

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "error": "Error message description",
  "details": "Additional error details (development only)"
}
```

### Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error occurred |

---

## Rate Limiting

**Current limits:**
- No rate limiting implemented in basic version
- Recommended for production:
  - 100 requests per minute per IP
  - 1000 requests per hour per IP

**Implementation example:**

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100
});

app.use('/api/', limiter);
```

---

## CORS Configuration

**Allowed origins:**
- Development: `http://localhost:3000`
- Production: Your frontend domain

**Allowed methods:**
- GET, POST, OPTIONS

**Allowed headers:**
- Content-Type, Authorization

---

## Sample Workflows

### Complete Certificate Issuance Flow

```javascript
// 1. Admin login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});
const { token } = await loginResponse.json();

// 2. Upload certificate PDF
const formData = new FormData();
formData.append('file', pdfFile);

const uploadResponse = await fetch('/api/ipfs/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
const { ipfsHash } = await uploadResponse.json();

// 3. Issue certificate on blockchain (via frontend with MetaMask)
// This happens through Ethers.js directly, not via backend API

// 4. Verify certificate
const verifyResponse = await fetch('/api/contract/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ipfsHash })
});
const { isValid, certificate } = await verifyResponse.json();
```

### Certificate Verification Flow

```javascript
// Verify by ID
const response = await fetch('/api/contract/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ certificateId: '1' })
});

const data = await response.json();

if (data.isValid) {
  console.log('✅ Certificate is valid');
  console.log('Student:', data.certificate.studentName);
  console.log('Course:', data.certificate.courseName);
  console.log('View PDF:', `https://gateway.pinata.cloud/ipfs/${data.certificate.ipfsHash}`);
} else {
  console.log('❌ Certificate is invalid or revoked');
}
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Upload to IPFS
```bash
curl -X POST http://localhost:5000/api/ipfs/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@certificate.pdf"
```

### Verify Certificate
```bash
curl -X POST http://localhost:5000/api/contract/verify \
  -H "Content-Type: application/json" \
  -d '{"certificateId":"1"}'
```

### Get Student Certificates
```bash
curl http://localhost:5000/api/contract/student/0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

---

## Postman Collection

Import this JSON into Postman for easy testing:

```json
{
  "info": {
    "name": "Certificate Verification API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth - Login",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\"username\":\"admin\",\"password\":\"admin123\"}",
          "options": { "raw": { "language": "json" } }
        },
        "url": { "raw": "{{baseUrl}}/api/auth/login" }
      }
    },
    {
      "name": "IPFS - Upload File",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            { "key": "file", "type": "file", "src": "" }
          ]
        },
        "url": { "raw": "{{baseUrl}}/api/ipfs/upload" }
      }
    },
    {
      "name": "Contract - Verify Certificate",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\"certificateId\":\"1\"}",
          "options": { "raw": { "language": "json" } }
        },
        "url": { "raw": "{{baseUrl}}/api/contract/verify" }
      }
    }
  ],
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:5000" },
    { "key": "token", "value": "" }
  ]
}
```

---

**API Documentation Version**: 1.0.0  
**Last Updated**: 2025
