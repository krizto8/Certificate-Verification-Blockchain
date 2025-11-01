import { Wallet, LogOut } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { formatAddress } from '../utils/wallet';

const WalletConnect = () => {
  const { account, isConnecting, isConnected, connect, disconnect, error } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">{formatAddress(account)}</span>
        </div>
        <button
          onClick={disconnect}
          className="btn btn-secondary flex items-center gap-2"
          title="Disconnect Wallet"
        >
          <LogOut size={18} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="btn btn-primary flex items-center gap-2"
      >
        <Wallet size={20} />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default WalletConnect;
