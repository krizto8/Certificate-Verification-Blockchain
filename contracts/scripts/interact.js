const hre = require("hardhat");

/**
 * Interaction script for testing contract functions after deployment
 */
async function main() {
  // Get deployed contract address from deployment file
  const deploymentFile = require(`../deployments/${hre.network.name}.json`);
  const contractAddress = deploymentFile.contractAddress;
  
  console.log(`Interacting with contract at: ${contractAddress}`);
  
  // Get contract instance
  const CertificateVerification = await hre.ethers.getContractFactory("CertificateVerification");
  const contract = CertificateVerification.attach(contractAddress);
  
  // Get signers
  const [admin, student] = await hre.ethers.getSigners();
  
  console.log(`\nAdmin address: ${admin.address}`);
  console.log(`Student address: ${student.address}`);
  
  // Check if admin is authorized
  const isAdminAuthorized = await contract.isAdmin(admin.address);
  console.log(`\nIs admin authorized? ${isAdminAuthorized}`);
  
  // Issue a certificate
  console.log("\n=== Issuing Certificate ===");
  const tx = await contract.issueCertificate(
    "John Doe",
    "Blockchain Development",
    "QmTestHash123456789",
    student.address
  );
  
  const receipt = await tx.wait();
  console.log(`Certificate issued! Transaction hash: ${receipt.hash}`);
  
  // Get certificate ID from event
  const event = receipt.logs.find(log => {
    try {
      return contract.interface.parseLog(log).name === "CertificateIssued";
    } catch (e) {
      return false;
    }
  });
  
  const parsedEvent = contract.interface.parseLog(event);
  const certificateId = parsedEvent.args.certificateId;
  console.log(`Certificate ID: ${certificateId}`);
  
  // Verify the certificate
  console.log("\n=== Verifying Certificate ===");
  const [isValid, certificate] = await contract.verifyCertificate(certificateId);
  
  console.log(`Certificate Valid: ${isValid}`);
  console.log(`Student Name: ${certificate.studentName}`);
  console.log(`Course Name: ${certificate.courseName}`);
  console.log(`IPFS Hash: ${certificate.ipfsHash}`);
  console.log(`Issue Date: ${new Date(Number(certificate.issueDate) * 1000).toLocaleDateString()}`);
  console.log(`Student Address: ${certificate.studentAddress}`);
  
  // Get student certificates
  console.log("\n=== Student Certificates ===");
  const studentCerts = await contract.getStudentCertificates(student.address);
  console.log(`Total certificates for student: ${studentCerts.length}`);
  console.log(`Certificate IDs: ${studentCerts.join(", ")}`);
  
  // Get total certificates
  const totalCerts = await contract.getTotalCertificates();
  console.log(`\nTotal certificates issued: ${totalCerts}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
