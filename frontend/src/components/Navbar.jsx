import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, User, CheckCircle, Settings } from 'lucide-react';
import WalletConnect from './WalletConnect';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Shield className="text-primary" size={32} />
            <div>
              <h1 className="text-xl font-bold text-gray-900">CertChain</h1>
              <p className="text-xs text-gray-500">Blockchain Certificate Verification</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            
            <Link
              to="/admin"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin') 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings size={18} />
              <span>Admin</span>
            </Link>
            
            <Link
              to="/student"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/student') 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User size={18} />
              <span>Student</span>
            </Link>
            
            <Link
              to="/verify"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/verify') 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CheckCircle size={18} />
              <span>Verify</span>
            </Link>
          </div>

          {/* Wallet Connect */}
          <WalletConnect />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              isActive('/') ? 'text-primary' : 'text-gray-600'
            }`}
          >
            <Home size={20} />
            <span className="text-xs">Home</span>
          </Link>
          
          <Link
            to="/admin"
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              isActive('/admin') ? 'text-primary' : 'text-gray-600'
            }`}
          >
            <Settings size={20} />
            <span className="text-xs">Admin</span>
          </Link>
          
          <Link
            to="/student"
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              isActive('/student') ? 'text-primary' : 'text-gray-600'
            }`}
          >
            <User size={20} />
            <span className="text-xs">Student</span>
          </Link>
          
          <Link
            to="/verify"
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              isActive('/verify') ? 'text-primary' : 'text-gray-600'
            }`}
          >
            <CheckCircle size={20} />
            <span className="text-xs">Verify</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
