import { useState } from 'react';
import { Search, CheckCircle, XCircle, FileText, ExternalLink, Loader } from 'lucide-react';
import { getContract } from '../utils/contract';
import { getProvider } from '../utils/wallet';

const Verify = () => {
  const [searchType, setSearchType] = useState('id'); // 'id' or 'hash'
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!searchValue.trim()) {
      setError('Please enter a certificate ID or IPFS hash');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const provider = getProvider();
      const contract = getContract(provider);

      let isValid, certificate;

      if (searchType === 'id') {
        [isValid, certificate] = await contract.verifyCertificate(searchValue);
      } else {
        [isValid, certificate] = await contract.verifyCertificateByHash(searchValue);
      }

      setResult({
        isValid,
        id: certificate.id.toString(),
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        ipfsHash: certificate.ipfsHash,
        issueDate: new Date(Number(certificate.issueDate) * 1000).toLocaleDateString(),
        studentAddress: certificate.studentAddress,
        issuedBy: certificate.issuedBy,
      });

    } catch (err) {
      console.error('Verification error:', err);
      setError(err.reason || err.message || 'Certificate not found or verification failed');
    } finally {
      setLoading(false);
    }
  };

  const getIPFSUrl = (hash) => {
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Verify Certificate</h1>
        <p className="text-gray-600">
          Verify the authenticity of a certificate using its ID or IPFS hash
        </p>
      </div>

      {/* Search Form */}
      <div className="card">
        <form onSubmit={handleVerify}>
          {/* Search Type Selection */}
          <div className="mb-4">
            <label className="label">Search By</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value="id"
                  checked={searchType === 'id'}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-4 h-4"
                />
                <span>Certificate ID</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value="hash"
                  checked={searchType === 'hash'}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-4 h-4"
                />
                <span>IPFS Hash</span>
              </label>
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <label className="label">
              {searchType === 'id' ? 'Certificate ID' : 'IPFS Hash'}
            </label>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="input"
              placeholder={searchType === 'id' ? 'Enter certificate ID (e.g., 1)' : 'Enter IPFS hash (e.g., Qm...)'}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Verifying...
              </>
            ) : (
              <>
                <Search size={20} />
                Verify Certificate
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 card bg-red-50 border-2 border-red-200">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-600" size={32} />
            <div>
              <h3 className="font-semibold text-red-900">Verification Failed</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`mt-6 card border-2 ${
          result.isValid 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          {/* Verification Status */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b">
            {result.isValid ? (
              <>
                <CheckCircle className="text-green-600" size={48} />
                <div>
                  <h2 className="text-2xl font-bold text-green-900">Certificate Valid</h2>
                  <p className="text-green-700">This certificate is authentic and verified on the blockchain</p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="text-red-600" size={48} />
                <div>
                  <h2 className="text-2xl font-bold text-red-900">Certificate Revoked</h2>
                  <p className="text-red-700">This certificate has been revoked and is no longer valid</p>
                </div>
              </>
            )}
          </div>

          {/* Certificate Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-3">Certificate Details</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Certificate ID</p>
                <p className="font-semibold">#{result.id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Issue Date</p>
                <p className="font-semibold">{result.issueDate}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Student Name</p>
                <p className="font-semibold">{result.studentName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Course Name</p>
                <p className="font-semibold">{result.courseName}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Student Wallet Address</p>
              <p className="font-mono text-sm break-all">{result.studentAddress}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Issued By (Admin Address)</p>
              <p className="font-mono text-sm break-all">{result.issuedBy}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">IPFS Hash</p>
              <p className="font-mono text-sm break-all">{result.ipfsHash}</p>
            </div>

            {/* View Certificate Button */}
            <div className="pt-4">
              <a
                href={getIPFSUrl(result.ipfsHash)}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn w-full flex items-center justify-center gap-2 ${
                  result.isValid ? 'btn-success' : 'btn-secondary'
                }`}
              >
                <FileText size={20} />
                View Certificate Document
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold mb-2">How to Verify</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Choose whether to search by Certificate ID or IPFS Hash</li>
          <li>Enter the certificate ID (number) or IPFS hash (starts with "Qm...")</li>
          <li>Click "Verify Certificate" to check authenticity</li>
          <li>View the verification result and certificate details</li>
          <li>Click "View Certificate Document" to see the original file on IPFS</li>
        </ol>
      </div>
    </div>
  );
};

export default Verify;
