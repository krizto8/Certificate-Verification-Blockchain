import { Shield, CheckCircle, Lock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Blockchain Certificate Verification
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Secure, transparent, and immutable certificate verification powered by Ethereum blockchain technology
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/admin" className="btn bg-white text-primary hover:bg-gray-100">
                Issue Certificate
              </Link>
              <Link to="/verify" className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary">
                Verify Certificate
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CertChain?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure</h3>
              <p className="text-gray-600">
                Certificates are stored on the Ethereum blockchain, making them tamper-proof and permanent
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-success" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verifiable</h3>
              <p className="text-gray-600">
                Anyone can instantly verify the authenticity of a certificate using its ID or IPFS hash
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-warning/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="text-warning" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Immutable</h3>
              <p className="text-gray-600">
                Once issued, certificates cannot be altered or forged, ensuring data integrity
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-secondary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast</h3>
              <p className="text-gray-600">
                Instant certificate issuance and verification with no intermediaries required
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <div className="text-4xl font-bold text-primary mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Admin Issues Certificate</h3>
              <p className="text-gray-600">
                Educational institutions upload certificate PDFs to IPFS and issue certificates on the blockchain with student details
              </p>
            </div>

            <div className="card">
              <div className="text-4xl font-bold text-primary mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Certificate Stored On-Chain</h3>
              <p className="text-gray-600">
                Certificate details are permanently recorded on the Ethereum blockchain, creating an immutable record
              </p>
            </div>

            <div className="card">
              <div className="text-4xl font-bold text-primary mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Anyone Can Verify</h3>
              <p className="text-gray-600">
                Students, employers, or anyone can verify certificate authenticity by entering the certificate ID or IPFS hash
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Connect your MetaMask wallet to begin issuing or verifying certificates
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/admin" className="btn bg-white text-primary hover:bg-gray-100">
              Admin Dashboard
            </Link>
            <Link to="/student" className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary">
              View My Certificates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
