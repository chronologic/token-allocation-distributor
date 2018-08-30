const DummyToken = artifacts.require("./DummyToken.sol");
const DummyVesting = artifacts.require("./DummyVesting.sol");
const WithVestingContract = artifacts.require("./WithVestingContract.sol");

contract('WithVestingContract', (accounts) => {

  let token;
  let vesting;
  let instance;
  let vestingConfig;
  const me = accounts[0];
  const stakeHoldersCount = 5;
  const stakeHolders = accounts.slice(1, stakeHoldersCount);
  const stakeHoldersWeights = [10,15,2,30,34];
  const tokensToMint = 100000 * 1e18;

  const makeBlockchainTime = time => Math.floor(time/1000);

  const forceMine = async (time) => {
  await web3.currentProvider.send({
    jsonrpc: "2.0",
    method: "evm_increaseTime",
    params: [time],
    id: 0x1a0
  });
  await web3.currentProvider.send({
    jsonrpc: "2.0",
    method: "evm_mine",
    id: 0x12345
  });
}

contract('WithVestingContract', (accounts) => {
  let token;
  let vesting;
  let instance;
  let snapshot;
  const me = accounts[0];
  const stakeHoldersCount = 1;
  const stakeHolders = [me];
  const stakeHoldersWeights = [1];

  const vestingConfig = {
      _cliff: makeBlockchainTime(900000),
      _duration: makeBlockchainTime(24000000)
  }

  before( async () => {
    token = await newDummyToken();
    assert(token.address, "Dummy Token was not deployed or does not have an address.");
    web3 = token.constructor.web3;

    const blocktime = (await web3.eth.getBlock('latest')).timestamp;
    vestingConfig._start = blocktime;

    instance = await newDistributor(
      token.address,
      stakeHoldersCount,
      stakeHolders,
      stakeHoldersWeights,
      0,
      0
    );
    assert(instance.address, "Distributor was not deployed or does not have an address.");

    vesting = await newDummyVesting(
      instance.address,
      vestingConfig._start,
      vestingConfig._cliff,
      vestingConfig._duration,
    );
    assert(vesting.address, "Vesting contract was deployed and has an address.");

    const vestingBalance = await token.balanceOf(vesting.address);
    const distributorBalance = await token.balanceOf(instance.address);

    console.log('Token: ', token.address)
    console.log('Vesting Contract: ', vesting.address)
    console.log('TokenDistributor: ', instance.address)

    assert.equal(Number(vestingBalance), 0, 'Vesting contract aleady has tokens');
    assert.equal(Number(distributorBalance), 0, 'Distributor contract contract aleady has tokens');
  })

  it('Should fail to set Vesting Contract from Random address', async () => {
    try{
      await instance.setVestingContract(1, vesting.address, {
        from: accounts[1]
      });
      assert.fail('Random address should not be able to set Vesting details');
    } catch (e) {
      assert.ok('Access denied');
    }
  })
})
