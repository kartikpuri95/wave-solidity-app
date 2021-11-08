
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const wavecontract = await waveContractFactory.deploy();
  await wavecontract.deployed();
  console.log("contract deployed", wavecontract.address);
  console.log("Contract deployed by:", owner.address);
  let waveCount;
  waveCount = await wavecontract.getTotalWaves();

  // Self transaction
  let waveTxn = await wavecontract.wave('Some message');
  await waveTxn.wait();

  waveCount = await wavecontract.getTotalWaves();
  // Random person transaction
  waveTxn = await wavecontract.connect(randomPerson).wave('Another message!');
  await waveTxn.wait();

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