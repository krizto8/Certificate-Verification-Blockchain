const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("CertificateVerification", function () {
  /**
   * Fixture to deploy contract and setup initial state
   */
  async function deployCertificateFixture() {
    const [owner, admin1, student1, student2, unauthorized] = await ethers.getSigners();

    const CertificateVerification = await ethers.getContractFactory("CertificateVerification");
    const certificate = await CertificateVerification.deploy();

    return { certificate, owner, admin1, student1, student2, unauthorized };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { certificate, owner } = await loadFixture(deployCertificateFixture);
      expect(await certificate.owner()).to.equal(owner.address);
    });

    it("Should authorize the owner as admin", async function () {
      const { certificate, owner } = await loadFixture(deployCertificateFixture);
      expect(await certificate.isAdmin(owner.address)).to.be.true;
    });

    it("Should start with zero certificates", async function () {
      const { certificate } = await loadFixture(deployCertificateFixture);
      expect(await certificate.getTotalCertificates()).to.equal(0);
    });
  });

  describe("Admin Management", function () {
    it("Should allow owner to add new admin", async function () {
      const { certificate, owner, admin1 } = await loadFixture(deployCertificateFixture);
      
      await expect(certificate.connect(owner).setAdmin(admin1.address, true))
        .to.emit(certificate, "AdminUpdated")
        .withArgs(admin1.address, true);
      
      expect(await certificate.isAdmin(admin1.address)).to.be.true;
    });

    it("Should allow owner to remove admin", async function () {
      const { certificate, owner, admin1 } = await loadFixture(deployCertificateFixture);
      
      await certificate.connect(owner).setAdmin(admin1.address, true);
      await certificate.connect(owner).setAdmin(admin1.address, false);
      
      expect(await certificate.isAdmin(admin1.address)).to.be.false;
    });

    it("Should reject non-owner trying to add admin", async function () {
  const { certificate, admin1, unauthorized } = await loadFixture(deployCertificateFixture);
  
  await expect(
    certificate.connect(unauthorized).setAdmin(admin1.address, true)
  ).to.be.revertedWith("Ownable: caller is not the owner");
});

    it("Should reject zero address as admin", async function () {
      const { certificate, owner } = await loadFixture(deployCertificateFixture);
      
      await expect(
        certificate.connect(owner).setAdmin(ethers.ZeroAddress, true)
      ).to.be.revertedWith("Invalid admin address");
    });
  });

  describe("Certificate Issuance", function () {
    it("Should allow admin to issue certificate", async function () {
      const { certificate, owner, student1 } = await loadFixture(deployCertificateFixture);
      
      const tx = await certificate.connect(owner).issueCertificate(
        "Alice Smith",
        "Ethereum Development",
        "QmTestHash123",
        student1.address
      );

      await expect(tx)
        .to.emit(certificate, "CertificateIssued")
        .withArgs(
          1,
          student1.address,
          "Alice Smith",
          "Ethereum Development",
          "QmTestHash123",
          await ethers.provider.getBlock("latest").then(b => b.timestamp),
          owner.address
        );
      
      expect(await certificate.getTotalCertificates()).to.equal(1);
    });

    it("Should increment certificate ID correctly", async function () {
      const { certificate, owner, student1, student2 } = await loadFixture(deployCertificateFixture);
      
      await certificate.connect(owner).issueCertificate(
        "Alice",
        "Course 1",
        "QmHash1",
        student1.address
      );
      
      await certificate.connect(owner).issueCertificate(
        "Bob",
        "Course 2",
        "QmHash2",
        student2.address
      );
      
      expect(await certificate.getTotalCertificates()).to.equal(2);
    });

    it("Should reject unauthorized user trying to issue certificate", async function () {
      const { certificate, unauthorized, student1 } = await loadFixture(deployCertificateFixture);
      
      await expect(
        certificate.connect(unauthorized).issueCertificate(
          "Alice",
          "Course",
          "QmHash",
          student1.address
        )
      ).to.be.revertedWith("Not authorized: Admin access required");
    });

    it("Should reject empty student name", async function () {
      const { certificate, owner, student1 } = await loadFixture(deployCertificateFixture);
      
      await expect(
        certificate.connect(owner).issueCertificate(
          "",
          "Course",
          "QmHash",
          student1.address
        )
      ).to.be.revertedWith("Student name cannot be empty");
    });

    it("Should reject empty course name", async function () {
      const { certificate, owner, student1 } = await loadFixture(deployCertificateFixture);
      
      await expect(
        certificate.connect(owner).issueCertificate(
          "Alice",
          "",
          "QmHash",
          student1.address
        )
      ).to.be.revertedWith("Course name cannot be empty");
    });

    it("Should reject empty IPFS hash", async function () {
      const { certificate, owner, student1 } = await loadFixture(deployCertificateFixture);
      
      await expect(
        certificate.connect(owner).issueCertificate(
          "Alice",
          "Course",
          "",
          student1.address
        )
      ).to.be.revertedWith("IPFS hash cannot be empty");
    });

    it("Should reject invalid student address", async function () {
      const { certificate, owner } = await loadFixture(deployCertificateFixture);
      
      await expect(
        certificate.connect(owner).issueCertificate(
          "Alice",
          "Course",
          "QmHash",
          ethers.ZeroAddress
        )
      ).to.be.revertedWith("Invalid student address");
    });

    it("Should reject duplicate IPFS hash", async function () {
      const { certificate, owner, student1, student2 } = await loadFixture(deployCertificateFixture);
      
      await certificate.connect(owner).issueCertificate(
        "Alice",
        "Course 1",
        "QmDuplicateHash",
        student1.address
      );
      
      await expect(
        certificate.connect(owner).issueCertificate(
          "Bob",
          "Course 2",
          "QmDuplicateHash",
          student2.address
        )
      ).to.be.revertedWith("Certificate with this IPFS hash already exists");
    });

    it("Should add certificate to student's list", async function () {
      const { certificate, owner, student1 } = await loadFixture(deployCertificateFixture);
      
      await certificate.connect(owner).issueCertificate(
        "Alice",
        "Course",
        "QmHash",
        student1.address
      );
      
      const studentCerts = await certificate.getStudentCertificates(student1.address);
      expect(studentCerts.length).to.equal(1);
      expect(studentCerts[0]).to.equal(1);
    });
  });

  describe("Certificate Verification", function () {
    it("Should verify certificate by ID", async function () {
      const { certificate, owner, student1 } = await loadFixture(deployCertificateFixture);
      
      await certificate.connect(owner).issueCertificate(
        "Alice Smith",
        "Blockchain 101",
        "QmVerifyHash",
        student1.address
      );
      
      const [isValid, cert] = await certificate.verifyCertificate(1);
      
      expect(isValid).to.be.true;
      expect(cert.studentName).to.equal("Alice Smith");
      expect(cert.courseName).to.equal("Blockchain 101");
      expect(cert.ipfsHash).to.equal("QmVerifyHash");
      expect(cert.studentAddress).to.equal(student1.address);
    });

    it("Should verify certificate by IPFS hash", async function () {
      const { certificate, owner, student1 } = await loadFixture(deployCertificateFixture);
      
      await certificate.connect(owner).issueCertificate(
        "Alice",
        "Course",
        "QmHashVerify",
        student1.address
      );
      
      const [isValid, cert] = await certificate.verifyCertificateByHash("QmHashVerify");
      
      expect(isValid).to.be.true;
      expect(cert.id).to.equal(1);
    });

    it("Should reject invalid certificate ID", async function () {
      const { certificate } = await loadFixture(deployCertificateFixture);
      
      await expect(
        certificate.verifyCertificate(999)
      ).to.be.revertedWith("Invalid certificate ID");
    });

    it("Should reject non-existent IPFS hash", async function () {
      const { certificate } = await loadFixture(deployCertificateFixture);
      
      await expect(
        certificate.verifyCertificateByHash("QmNonExistent")
      ).to.be.revertedWith("Certificate not found");
    });

    it("Should get certificate details", async function () {
      const { certificate, owner, student1 } = await loadFixture(deployCertificateFixture);
      
      await certificate.connect(owner).issueCertificate(
        "Alice",
        "Course",
        "QmHash",
        student1.address
      );
      
      const cert = await certificate.getCertificateDetails(1);
      
      expect(cert.id).to.equal(1);
      expect(cert.studentName).to.equal("Alice");
      expect(cert.isValid).to.be.true;
      expect(cert.issuedBy).to.equal(owner.address);
    });
  });

  describe("Certificate Revocation", function () {
    it("Should allow admin to revoke certificate", async function () {
      const { certificate, owner, student1 } = await loadFixture(deployCertificateFixture);
      
      await certificate.connect(owner).issueCertificate(
        "Alice",
        "Course",
        "QmHash",
        student1.address
      );
      
      await expect(certificate.connect(owner).revokeCertificate(1))
        .to.emit(certificate, "CertificateRevoked")
        .withArgs(1, owner.address);
      
      const [isValid] = await certificate.verifyCertificate(1);
      expect(isValid).to.be.false;
    });

    it("Should reject revoking non-existent certificate", async function () {
      const { certificate, owner } = await loadFixture(deployCertificateFixture);
      
      await expect(
        certificate.connect(owner).revokeCertificate(999)
      ).to.be.revertedWith("Invalid certificate ID");
    });

    it("Should reject revoking already revoked certificate", async function () {
      const { certificate, owner, student1 } = await loadFixture(deployCertificateFixture);
      
      await certificate.connect(owner).issueCertificate(
        "Alice",
        "Course",
        "QmHash",
        student1.address
      );
      
      await certificate.connect(owner).revokeCertificate(1);
      
      await expect(
        certificate.connect(owner).revokeCertificate(1)
      ).to.be.revertedWith("Certificate already revoked");
    });

    it("Should reject unauthorized user trying to revoke", async function () {
      const { certificate, owner, student1, unauthorized } = await loadFixture(deployCertificateFixture);
      
      await certificate.connect(owner).issueCertificate(
        "Alice",
        "Course",
        "QmHash",
        student1.address
      );
      
      await expect(
        certificate.connect(unauthorized).revokeCertificate(1)
      ).to.be.revertedWith("Not authorized: Admin access required");
    });
  });

  describe("Student Certificates", function () {
    it("Should return all certificates for a student", async function () {
      const { certificate, owner, student1 } = await loadFixture(deployCertificateFixture);
      
      await certificate.connect(owner).issueCertificate(
        "Alice",
        "Course 1",
        "QmHash1",
        student1.address
      );
      
      await certificate.connect(owner).issueCertificate(
        "Alice",
        "Course 2",
        "QmHash2",
        student1.address
      );
      
      const studentCerts = await certificate.getStudentCertificates(student1.address);
      expect(studentCerts.length).to.equal(2);
      expect(studentCerts[0]).to.equal(1);
      expect(studentCerts[1]).to.equal(2);
    });

    it("Should return empty array for student with no certificates", async function () {
      const { certificate, student1 } = await loadFixture(deployCertificateFixture);
      
      const studentCerts = await certificate.getStudentCertificates(student1.address);
      expect(studentCerts.length).to.equal(0);
    });
  });

  describe("Multiple Admins", function () {
    it("Should allow multiple admins to issue certificates", async function () {
      const { certificate, owner, admin1, student1, student2 } = await loadFixture(deployCertificateFixture);
      
      await certificate.connect(owner).setAdmin(admin1.address, true);
      
      await certificate.connect(owner).issueCertificate(
        "Alice",
        "Course 1",
        "QmHash1",
        student1.address
      );
      
      await certificate.connect(admin1).issueCertificate(
        "Bob",
        "Course 2",
        "QmHash2",
        student2.address
      );
      
      expect(await certificate.getTotalCertificates()).to.equal(2);
    });
  });
});
