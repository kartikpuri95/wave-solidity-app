
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  // Fund our contract with some ether
  const wavecontract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await wavecontract.deployed();
  console.log("contract deployed", wavecontract.address);
  console.log("Contract deployed by:", owner.address);
  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    wavecontract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  let waveCount;
  waveCount = await wavecontract.getTotalWaves();

  // Self transaction
  let waveTxn = await wavecontract.wave('This is wave #1');
  await waveTxn.wait();
  contractBalance = await hre.ethers.provider.getBalance(
    wavecontract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );
  waveCount = await wavecontract.getTotalWaves();
  // Random person transaction
  waveTxn = await wavecontract.connect(randomPerson).wave('This is wave #2');
  await waveTxn.wait();
  contractBalance = await hre.ethers.provider.getBalance(
    wavecontract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );
  waveCount = await wavecontract.getTotalWaves();

  let allWaves = await wavecontract.getAllWaves();
  console.log(allWaves);
}
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();