import { ethers } from 'ethers';

/**
 * Check if MetaMask is installed
 * @returns {boolean} True if MetaMask is installed
 */
export const isMetaMaskInstalled = () => {
  return typeof window.ethereum !== 'undefined';
};

/**
 * Get Ethereum provider
 * @returns {Object} Ethers provider
 */
export const getProvider = () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }
  return new ethers.BrowserProvider(window.ethereum);
};

/**
 * Request account access
 * @returns {Promise<string[]>} Array of account addresses
 */
export const requestAccounts = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }
  
  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    return accounts;
  } catch (error) {
    if (error.code === 4001) {
      throw new Error('User rejected the connection request');
    }
    throw error;
  }
};

/**
 * Get current account
 * @returns {Promise<string|null>} Current account address or null
 */
export const getCurrentAccount = async () => {
  if (!isMetaMaskInstalled()) {
    return null;
  }
  
  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    });
    return accounts[0] || null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
};

/**
 * Connect wallet
 * @returns {Promise<Object>} Object containing account and signer
 */
export const connectWallet = async () => {
  try {
    const accounts = await requestAccounts();
    const provider = getProvider();
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    
    return {
      account: accounts[0],
      signer,
      provider,
      chainId: Number(network.chainId)
    };
  } catch (error) {
    console.error('Wallet connection error:', error);
    throw error;
  }
};

/**
 * Get account balance
 * @param {string} address - Account address
 * @returns {Promise<string>} Balance in ETH
 */
export const getBalance = async (address) => {
  const provider = getProvider();
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
};

/**
 * Switch to correct network
 * @param {number} chainId - Target chain ID
 * @returns {Promise<void>}
 */
export const switchNetwork = async (chainId) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      throw new Error('Please add this network to MetaMask');
    }
    throw error;
  }
};

/**
 * Format address for display
 * @param {string} address - Full address
 * @returns {string} Shortened address
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Setup account change listener
 * @param {Function} callback - Callback function
 */
export const onAccountsChanged = (callback) => {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', callback);
  }
};

/**
 * Setup chain change listener
 * @param {Function} callback - Callback function
 */
export const onChainChanged = (callback) => {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('chainChanged', callback);
  }
};

/**
 * Remove account change listener
 */
export const removeAccountsListener = () => {
  if (isMetaMaskInstalled()) {
    window.ethereum.removeAllListeners('accountsChanged');
  }
};

/**
 * Remove chain change listener
 */
export const removeChainListener = () => {
  if (isMetaMaskInstalled()) {
    window.ethereum.removeAllListeners('chainChanged');
  }
};
