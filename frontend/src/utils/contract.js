import { ethers } from 'ethers';

/**
 * Get contract ABI
 * @returns {Array} Contract ABI
 */
import contractABI from '../../../contracts/deployments/CertificateVerification-ABI.json';
import contractInfo from '../../../contracts/deployments/sepolia.json';
const SEPOLIA_CHAIN_ID = 11155111;
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
  const address = contractInfo?.contractAddress || contractInfo?.address || "0xc77212B7cb9E0550c6683780C33c6BE34694029B";
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
export const getContract =async (signerOrProvider = false) => {
  try {
    // Get contract address - use contractAddress from JSON
    const contractAddress = contractInfo?.contractAddress || contractInfo?.address || getContractAddress();
    console.log("Using contract address:", contractAddress);
    if (!contractAddress) {
      throw new Error('Contract address not configured');
    }

    // If signerOrProvider is a signer or provider object, use it directly
    if (signerOrProvider && typeof signerOrProvider !== 'boolean') {
      // It's a signer or provider object
      return new ethers.Contract(contractAddress, contractABI, signerOrProvider);
    }

    // Original behavior: if boolean or no argument, use window.ethereum
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    if (signerOrProvider === true) {
      // Return a promise that resolves with connected contract
      return provider.getSigner().then(signer => contract.connect(signer));
    }

    return contract;
  } catch (error) {
    console.error('Contract connection failed:', error);
    throw error;
  }
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
