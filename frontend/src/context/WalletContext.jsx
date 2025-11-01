import { createContext, useContext, useState, useEffect } from 'react';
import {
  connectWallet,
  getCurrentAccount,
  onAccountsChanged,
  onChainChanged,
  removeAccountsListener,
  removeChainListener,
  isMetaMaskInstalled,
} from '../utils/wallet';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        const currentAccount = await getCurrentAccount();
        if (currentAccount) {
          await handleConnect();
        }
      }
    };
    
    checkConnection();

    // Setup listeners
    onAccountsChanged(handleAccountsChanged);
    onChainChanged(handleChainChanged);

    return () => {
      removeAccountsListener();
      removeChainListener();
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected
      disconnect();
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    // Reload page on chain change
    window.location.reload();
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const walletData = await connectWallet();
      
      setAccount(walletData.account);
      setChainId(walletData.chainId);
      setSigner(walletData.signer);
      setProvider(walletData.provider);
      
      return walletData.account;
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setChainId(null);
    setSigner(null);
    setProvider(null);
    setError(null);
  };

  const value = {
    account,
    chainId,
    signer,
    provider,
    isConnecting,
    isConnected: !!account,
    error,
    connect: handleConnect,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
