const hre = require("hardhat");

async function main() {
  const EtchV1 = await hre.ethers.getContractFactory("EtchV1");
  const etchV1 = await EtchV1.deploy();

  await etchV1.deployed();

  console.log("EtchV1 deployed to:", etchV1.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
