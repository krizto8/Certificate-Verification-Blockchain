// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CertificateVerification
 * @dev Smart contract for issuing and verifying certificates on the blockchain
 * @notice This contract allows admins to issue certificates and anyone to verify them
 */
contract CertificateVerification is Ownable {
    using Counters for Counters.Counter;
    
    // Counter for certificate IDs
    Counters.Counter private _certificateIdCounter;
    
    /**
     * @dev Certificate structure containing all certificate details
     */
    struct Certificate {
        uint256 id;
        string studentName;
        string courseName;
        string ipfsHash;
        uint256 issueDate;
        address studentAddress;
        bool isValid;
        address issuedBy;
    }
    
    // Mapping from certificate ID to Certificate
    mapping(uint256 => Certificate) public certificates;
    
    // Mapping from student address to their certificate IDs
    mapping(address => uint256[]) public studentCertificates;
    
    // Mapping from IPFS hash to certificate ID (for quick verification)
    mapping(string => uint256) public ipfsHashToCertId;
    
    // Mapping of authorized admins (institutions)
    mapping(address => bool) public authorizedAdmins;
    
    /**
     * @dev Emitted when a new certificate is issued
     */
    event CertificateIssued(
        uint256 indexed certificateId,
        address indexed studentAddress,
        string studentName,
        string courseName,
        string ipfsHash,
        uint256 issueDate,
        address issuedBy
    );
    
    /**
     * @dev Emitted when a certificate is revoked
     */
    event CertificateRevoked(
        uint256 indexed certificateId,
        address revokedBy
    );
    
    /**
     * @dev Emitted when an admin is added or removed
     */
    event AdminUpdated(
        address indexed admin,
        bool authorized
    );
    
    /**
     * @dev Modifier to check if caller is an authorized admin
     */
    modifier onlyAdmin() {
        require(
            authorizedAdmins[msg.sender] || msg.sender == owner(),
            "Not authorized: Admin access required"
        );
        _;
    }
    
    /**
     * @dev Constructor - sets the contract deployer as owner and first admin
     */
    constructor() Ownable(msg.sender) {
        authorizedAdmins[msg.sender] = true;
        emit AdminUpdated(msg.sender, true);
    }
    
    /**
     * @dev Add or remove an admin
     * @param admin Address of the admin
     * @param authorized True to authorize, false to revoke
     */
    function setAdmin(address admin, bool authorized) external onlyOwner {
        require(admin != address(0), "Invalid admin address");
        authorizedAdmins[admin] = authorized;
        emit AdminUpdated(admin, authorized);
    }
    
    /**
     * @dev Issue a new certificate
     * @param studentName Name of the student
     * @param courseName Name of the course
     * @param ipfsHash IPFS hash of the certificate document
     * @param studentAddress Wallet address of the student
     * @return certificateId The ID of the newly issued certificate
     */
    function issueCertificate(
        string memory studentName,
        string memory courseName,
        string memory ipfsHash,
        address studentAddress
    ) external onlyAdmin returns (uint256) {
        require(bytes(studentName).length > 0, "Student name cannot be empty");
        require(bytes(courseName).length > 0, "Course name cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(studentAddress != address(0), "Invalid student address");
        require(ipfsHashToCertId[ipfsHash] == 0, "Certificate with this IPFS hash already exists");
        
        _certificateIdCounter.increment();
        uint256 newCertificateId = _certificateIdCounter.current();
        
        Certificate memory newCertificate = Certificate({
            id: newCertificateId,
            studentName: studentName,
            courseName: courseName,
            ipfsHash: ipfsHash,
            issueDate: block.timestamp,
            studentAddress: studentAddress,
            isValid: true,
            issuedBy: msg.sender
        });
        
        certificates[newCertificateId] = newCertificate;
        studentCertificates[studentAddress].push(newCertificateId);
        ipfsHashToCertId[ipfsHash] = newCertificateId;
        
        emit CertificateIssued(
            newCertificateId,
            studentAddress,
            studentName,
            courseName,
            ipfsHash,
            block.timestamp,
            msg.sender
        );
        
        return newCertificateId;
    }
    
    /**
     * @dev Revoke a certificate
     * @param certificateId ID of the certificate to revoke
     */
    function revokeCertificate(uint256 certificateId) external onlyAdmin {
        require(certificateId > 0 && certificateId <= _certificateIdCounter.current(), "Invalid certificate ID");
        require(certificates[certificateId].isValid, "Certificate already revoked");
        
        certificates[certificateId].isValid = false;
        
        emit CertificateRevoked(certificateId, msg.sender);
    }
    
    /**
     * @dev Verify a certificate by ID
     * @param certificateId ID of the certificate to verify
     * @return isValid True if certificate is valid
     * @return certificate The certificate details
     */
    function verifyCertificate(uint256 certificateId) 
        external 
        view 
        returns (bool isValid, Certificate memory certificate) 
    {
        require(certificateId > 0 && certificateId <= _certificateIdCounter.current(), "Invalid certificate ID");
        
        Certificate memory cert = certificates[certificateId];
        return (cert.isValid, cert);
    }
    
    /**
     * @dev Verify a certificate by IPFS hash
     * @param ipfsHash IPFS hash of the certificate
     * @return isValid True if certificate is valid
     * @return certificate The certificate details
     */
    function verifyCertificateByHash(string memory ipfsHash) 
        external 
        view 
        returns (bool isValid, Certificate memory certificate) 
    {
        uint256 certId = ipfsHashToCertId[ipfsHash];
        require(certId > 0, "Certificate not found");
        
        Certificate memory cert = certificates[certId];
        return (cert.isValid, cert);
    }
    
    /**
     * @dev Get certificate details by ID
     * @param certificateId ID of the certificate
     * @return certificate The certificate details
     */
    function getCertificateDetails(uint256 certificateId) 
        external 
        view 
        returns (Certificate memory certificate) 
    {
        require(certificateId > 0 && certificateId <= _certificateIdCounter.current(), "Invalid certificate ID");
        return certificates[certificateId];
    }
    
    /**
     * @dev Get all certificates for a student
     * @param studentAddress Wallet address of the student
     * @return certificateIds Array of certificate IDs
     */
    function getStudentCertificates(address studentAddress) 
        external 
        view 
        returns (uint256[] memory certificateIds) 
    {
        return studentCertificates[studentAddress];
    }
    
    /**
     * @dev Get total number of certificates issued
     * @return count Total certificate count
     */
    function getTotalCertificates() external view returns (uint256 count) {
        return _certificateIdCounter.current();
    }
    
    /**
     * @dev Check if an address is an authorized admin
     * @param admin Address to check
     * @return authorized True if authorized
     */
    function isAdmin(address admin) external view returns (bool authorized) {
        return authorizedAdmins[admin] || admin == owner();
    }
}
