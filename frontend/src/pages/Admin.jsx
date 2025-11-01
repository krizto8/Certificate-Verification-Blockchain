import { useState, useEffect } from 'react';
import { Upload, FileText, Send, Loader } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { getContract } from '../utils/contract';
import { uploadToIPFS, checkAdmin } from '../utils/api';

const Admin = () => {
  const { account, signer, isConnected } = useWallet();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    studentName: '',
    courseName: '',
    studentAddress: '',
    certificateFile: null,
  });
  
  const [ipfsHash, setIpfsHash] = useState('');
  const [uploading, setUploading] = useState(false);

  // Check admin status
  useEffect(() => {
    const verifyAdmin = async () => {
      if (account) {
        try {
          const result = await checkAdmin(account);
          setIsAdmin(result.isAdmin);
          if (!result.isAdmin) {
            setError('Your wallet is not authorized as an admin');
          }
        } catch (err) {
          console.error('Admin check error:', err);
        }
      }
    };
    
    verifyAdmin();
  }, [account]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, certificateFile: file }));
  };

  const handleUploadToIPFS = async () => {
    if (!formData.certificateFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const result = await uploadToIPFS(formData.certificateFile);
      setIpfsHash(result.ipfsHash);
      setSuccess(`File uploaded to IPFS: ${result.ipfsHash}`);
    } catch (err) {
      console.error('IPFS upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload to IPFS');
    } finally {
      setUploading(false);
    }
  };

  const handleIssueCertificate = async (e) => {
    e.preventDefault();
    
    if (!ipfsHash) {
      setError('Please upload the certificate to IPFS first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const contract = getContract(signer);
      
      const tx = await contract.issueCertificate(
        formData.studentName,
        formData.courseName,
        ipfsHash,
        formData.studentAddress
      );

      setSuccess('Transaction submitted. Waiting for confirmation...');
      
      const receipt = await tx.wait();
      
      // Get certificate ID from event
      const event = receipt.logs.find(log => {
        try {
          return contract.interface.parseLog(log).name === 'CertificateIssued';
        } catch (e) {
          return false;
        }
      });

      let certificateId = 'N/A';
      if (event) {
        const parsedEvent = contract.interface.parseLog(event);
        certificateId = parsedEvent.args.certificateId.toString();
      }

      setSuccess(`Certificate issued successfully! Certificate ID: ${certificateId}`);
      
      // Reset form
      setFormData({
        studentName: '',
        courseName: '',
        studentAddress: '',
        certificateFile: null,
      });
      setIpfsHash('');
      
    } catch (err) {
      console.error('Certificate issuance error:', err);
      setError(err.reason || err.message || 'Failed to issue certificate');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Please connect your MetaMask wallet to access the admin dashboard
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin && account) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
          <p className="text-gray-600">
            Your wallet address is not authorized as an admin. Please contact the contract owner.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Issue new certificates on the blockchain</p>
      </div>

      <div className="card">
        <form onSubmit={handleIssueCertificate}>
          {/* Student Name */}
          <div className="mb-4">
            <label className="label">Student Name</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              className="input"
              placeholder="Enter student full name"
              required
            />
          </div>

          {/* Course Name */}
          <div className="mb-4">
            <label className="label">Course Name</label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleInputChange}
              className="input"
              placeholder="Enter course name"
              required
            />
          </div>

          {/* Student Address */}
          <div className="mb-4">
            <label className="label">Student Wallet Address</label>
            <input
              type="text"
              name="studentAddress"
              value={formData.studentAddress}
              onChange={handleInputChange}
              className="input"
              placeholder="0x..."
              required
            />
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label className="label">Certificate File (PDF)</label>
            <div className="flex gap-2">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,image/*"
                className="input flex-1"
                required
              />
              <button
                type="button"
                onClick={handleUploadToIPFS}
                disabled={uploading || !formData.certificateFile}
                className="btn btn-secondary flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload to IPFS
                  </>
                )}
              </button>
            </div>
          </div>

          {/* IPFS Hash Display */}
          {ipfsHash && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-gray-700 mb-1">IPFS Hash:</p>
              <p className="font-mono text-sm break-all">{ipfsHash}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !ipfsHash}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Issuing Certificate...
              </>
            ) : (
              <>
                <Send size={20} />
                Issue Certificate
              </>
            )}
          </button>
        </form>
      </div>

      {/* Instructions */}
      <div className="mt-8 card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold mb-2">Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Fill in all student and course details</li>
          <li>Select the certificate PDF file</li>
          <li>Click "Upload to IPFS" to store the file</li>
          <li>Once uploaded, click "Issue Certificate" to record on blockchain</li>
          <li>Confirm the transaction in MetaMask</li>
          <li>Wait for transaction confirmation</li>
        </ol>
      </div>
    </div>
  );
};

export default Admin;
