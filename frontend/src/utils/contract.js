import { ethers } from 'ethers';

/**
 * Get contract ABI
 * @returns {Array} Contract ABI
 */
export const getContractABI = () => {
  // This will be loaded from the deployed contract
  // For now, we'll define the essential functions
  return [
    "function issueCertificate(string memory studentName, string memory courseName, string memory ipfsHash, address studentAddress) external returns (uint256)",
    "function verifyCertificate(uint256 certificateId) external view returns (bool isValid, tuple(uint256 id, string studentName, string courseName, string ipfsHash, uint256 issueDate, address studentAddress, bool isValid, address issuedBy) certificate)",
    "function verifyCertificateByHash(string memory ipfsHash) external view returns (bool isValid, tuple(uint256 id, string studentName, string courseName, string ipfsHash, uint256 issueDate, address studentAddress, bool isValid, address issuedBy) certificate)",
    "function getCertificateDetails(uint256 certificateId) external view returns (tuple(uint256 id, string studentName, string courseName, string ipfsHash, uint256 issueDate, address studentAddress, bool isValid, address issuedBy) certificate)",
    "function getStudentCertificates(address studentAddress) external view returns (uint256[] memory certificateIds)",
    "function getTotalCertificates() external view returns (uint256 count)",
    "function isAdmin(address admin) external view returns (bool authorized)",
    "function revokeCertificate(uint256 certificateId) external",
    "function setAdmin(address admin, bool authorized) external",
    "function owner() external view returns (address)",
    "event CertificateIssued(uint256 indexed certificateId, address indexed studentAddress, string studentName, string courseName, string ipfsHash, uint256 issueDate, address issuedBy)",
    "event CertificateRevoked(uint256 indexed certificateId, address revokedBy)"
  ];
};

/**
 * Get contract address from environment
 * @returns {string} Contract address
 */
export const getContractAddress = () => {
  const address = import.meta.env.VITE_CONTRACT_ADDRESS;
  if (!address) {
    throw new Error('Contract address not configured. Please set VITE_CONTRACT_ADDRESS in .env file');
  }
  return address;
};

/**
 * Get contract instance with signer
 * @param {Object} signer - Ethers signer
 * @returns {Object} Contract instance
 */
export const getContract = (signer) => {
  const address = getContractAddress();
  const abi = getContractABI();
  return new ethers.Contract(address, abi, signer);
};

/**
 * Get contract instance with provider (read-only)
 * @param {Object} provider - Ethers provider
 * @returns {Object} Contract instance
 */
export const getContractReadOnly = (provider) => {
  const address = getContractAddress();
  const abi = getContractABI();
  return new ethers.Contract(address, abi, provider);
};
