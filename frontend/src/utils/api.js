import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * API client instance
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Set authentication token
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

/**
 * Get stored auth token
 * @returns {string|null} Stored token
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Initialize auth token from localStorage
 */
const initializeAuth = () => {
  const token = getAuthToken();
  if (token) {
    setAuthToken(token);
  }
};

initializeAuth();

/**
 * Admin login
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} Login response
 */
export const login = async (username, password) => {
  const response = await api.post('/api/auth/login', { username, password });
  if (response.data.token) {
    setAuthToken(response.data.token);
  }
  return response.data;
};

/**
 * Verify token
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Verification response
 */
export const verifyToken = async (token) => {
  const response = await api.post('/api/auth/verify', { token });
  return response.data;
};

/**
 * Upload file to IPFS
 * @param {File} file - File to upload
 * @returns {Promise<Object>} Upload response with IPFS hash
 */
export const uploadToIPFS = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/ipfs/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Get IPFS file URL
 * @param {string} hash - IPFS hash
 * @returns {Promise<Object>} IPFS URLs
 */
export const getIPFSUrl = async (hash) => {
  const response = await api.get(`/api/ipfs/${hash}`);
  return response.data;
};

/**
 * Get contract info
 * @returns {Promise<Object>} Contract information
 */
export const getContractInfo = async () => {
  const response = await api.get('/api/contract/info');
  return response.data;
};

/**
 * Get certificate by ID
 * @param {number} id - Certificate ID
 * @returns {Promise<Object>} Certificate data
 */
export const getCertificate = async (id) => {
  const response = await api.get(`/api/contract/certificate/${id}`);
  return response.data;
};

/**
 * Verify certificate
 * @param {Object} params - Verification parameters
 * @returns {Promise<Object>} Verification result
 */
export const verifyCertificate = async (params) => {
  const response = await api.post('/api/contract/verify', params);
  return response.data;
};

/**
 * Get student certificates
 * @param {string} address - Student wallet address
 * @returns {Promise<Object>} Student certificates
 */
export const getStudentCertificates = async (address) => {
  const response = await api.get(`/api/contract/student/${address}`);
  return response.data;
};

/**
 * Check if address is admin
 * @param {string} address - Wallet address
 * @returns {Promise<Object>} Admin status
 */
export const checkAdmin = async (address) => {
  const response = await api.get(`/api/contract/admin/${address}`);
  return response.data;
};

export default api;
