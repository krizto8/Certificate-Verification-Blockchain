import { useState, useEffect } from 'react';
import { FileText, Download, ExternalLink, Loader } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { getContract } from '../utils/contract';

const Student = () => {
  const { account, signer, isConnected } = useWallet();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isConnected && account && signer) {
      fetchCertificates();
    }
  }, [isConnected, account, signer]);

  const fetchCertificates = async () => {
    setLoading(true);
    setError('');

    try {
      if (!signer) {
        throw new Error('Wallet not connected');
      }
      const contract = await getContract(signer, true); // autoSwitchNetwork = true
      console.log("contract", contract);
      console.log("account", account);
      const certIds = await contract.getStudentCertificates(account);
      console.log("certIds", certIds);
      const certDetails = [];
      for (let id of certIds) {
        const cert = await contract.getCertificateDetails(id);
        certDetails.push({
          id: cert.id.toString(),
          studentName: cert.studentName,
          courseName: cert.courseName,
          ipfsHash: cert.ipfsHash,
          issueDate: new Date(Number(cert.issueDate) * 1000).toLocaleDateString(),
          isValid: cert.isValid,
          issuedBy: cert.issuedBy,
        });
      }

      setCertificates(certDetails);
    } catch (err) {
      console.error('Fetch certificates error:', err);
      setError('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const getIPFSUrl = (hash) => {
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Please connect your MetaMask wallet to view your certificates
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Certificates</h1>
        <p className="text-gray-600">View all certificates issued to your wallet address</p>
      </div>

      {loading ? (
        <div className="card text-center">
          <Loader className="animate-spin mx-auto mb-4" size={40} />
          <p className="text-gray-600">Loading certificates...</p>
        </div>
      ) : error ? (
        <div className="card bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="card text-center">
          <FileText className="mx-auto mb-4 text-gray-400" size={48} />
          <h2 className="text-xl font-semibold mb-2">No Certificates Found</h2>
          <p className="text-gray-600">
            No certificates have been issued to this wallet address yet
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="card border-2 border-primary/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-primary">Certificate #{cert.id}</h3>
                  <p className="text-sm text-gray-500">Issued: {cert.issueDate}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  cert.isValid 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {cert.isValid ? 'Valid' : 'Revoked'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="font-medium">{cert.studentName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Course Name</p>
                  <p className="font-medium">{cert.courseName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">IPFS Hash</p>
                  <p className="font-mono text-sm break-all">{cert.ipfsHash}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Issued By</p>
                  <p className="font-mono text-xs break-all">{cert.issuedBy}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={getIPFSUrl(cert.ipfsHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  View Certificate
                </a>
                <a
                  href={getIPFSUrl(cert.ipfsHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Student;
