const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Main deployment script for CertificateVerification contract
 */
async function main() {
  console.log("Starting deployment of CertificateVerification contract...");

  // Get the contract factory
  const CertificateVerification = await hre.ethers.getContractFactory("CertificateVerification");
  
  // Deploy the contract
  console.log("Deploying contract...");
  const certificateVerification = await CertificateVerification.deploy();
  
  await certificateVerification.waitForDeployment();
  
  const contractAddress = await certificateVerification.getAddress();
  console.log(`CertificateVerification deployed to: ${contractAddress}`);

  // Get deployer address
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployed by: ${deployer.address}`);
  
  // Save deployment information
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  // Save deployment info to file
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`Deployment info saved to: ${deploymentFile}`);
  
  // Save ABI
  const artifactPath = path.join(__dirname, "../artifacts/contracts/CertificateVerification.sol/CertificateVerification.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const abiFile = path.join(deploymentsDir, `CertificateVerification-ABI.json`);
  fs.writeFileSync(abiFile, JSON.stringify(artifact.abi, null, 2));
  console.log(`ABI saved to: ${abiFile}`);
  
  // Verify contract on Etherscan (only on testnets/mainnet)
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("Waiting for block confirmations...");
    await certificateVerification.deploymentTransaction().wait(6);
    
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
  
  console.log("\n=== Deployment Summary ===");
  console.log(`Network: ${hre.network.name}`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Block Number: ${deploymentInfo.blockNumber}`);
  console.log("==========================\n");
  
  return contractAddress;
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
