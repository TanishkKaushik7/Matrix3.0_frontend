async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const Factory = await ethers.getContractFactory("CertificateRegistry");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  const network = await ethers.provider.getNetwork();

  console.log("----------------------------------------");
  console.log("Contract deployed successfully");
  console.log("Network chainId:", network.chainId.toString());
  console.log("CertificateRegistry address:", contractAddress);
  console.log("Use in frontend .env.local:");
  console.log(`VITE_CERTIFICATE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("----------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
