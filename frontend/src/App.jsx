import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Student from './pages/Student';
import Verify from './pages/Verify';

function App() {
  return (
    <Router>
      <WalletProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/student" element={<Student />} />
            <Route path="/verify" element={<Verify />} />
          </Routes>
          
          {/* Footer */}
          <footer className="bg-gray-900 text-white py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-gray-400">
                © 2025 CertChain - Blockchain Certificate Verification System
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Powered by Ethereum, IPFS, and React
              </p>
            </div>
          </footer>
        </div>
      </WalletProvider>
    </Router>
  );
}

export default App;
