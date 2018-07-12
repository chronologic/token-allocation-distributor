const DummyToken = artifacts.require("./DummyToken.sol");
const DummyVesting = artifacts.require("./DummyVesting.sol");
const WithVestingContract = artifacts.require("./WithVestingContract.sol");

const newDummyToken = () => DummyToken.new();
const newDummyVesting = (_beneficiary, _start, _cliff, _duration, _revocable) => DummyVesting.new(
  _beneficiary,
  _start,
  _cliff,
  _duration,
  _revocable
);
const newDistributor = (_token, _stakeHoldersCount, _stakeHolders, _stakeHoldersWeights) => {
  return WithVestingContract.new(
    _token, _stakeHoldersCount, _stakeHolders, _stakeHoldersWeights
  )
}

const makeBlockchainTime = time => Math.floor(time/1000);

const forceMine = async (time) => {
  await web3.currentProvider.sendAsync({
    jsonrpc: "2.0",
    method: "evm_increaseTime",
    params: [time],
    id: 0x123450
  });
  await web3.currentProvider.sendAsync({
    jsonrpc: "2.0",
    method: "evm_mine",
    id: 0x12345
  });
}

contract('WithVestingContract', (accounts) => {
  let token;
  let distributor;
  let instance;
  const me = accounts[0];
  const stakeHoldersCount = 1;
  const stakeHolders = [me];
  const stakeHoldersWeights = [1];

  const vestingConfig = {
      _start: makeBlockchainTime(new Date().getTime),
      _cliff: makeBlockchainTime(900000),
      _duration: makeBlockchainTime(1800000)
  }

  it('Should deploy the Contract', async () => {
    await newDummyToken().then((_instance) => {
      token = _instance;
      web3 = _instance.constructor.web3
    }).then( async () => {
      return await newDistributor(
        token.address,
        stakeHoldersCount,
        stakeHolders,
        stakeHoldersWeights
      ).then((_instance) => {
        distributor = _instance;
      })
    })
    .then( async () => {
      return await newDummyVesting(
        distributor.address,
        vestingConfig._start,
        vestingConfig._cliff,
        vestingConfig._duration,
        false
      ).then((_instance) => {
        instance = _instance;
      })
    })
    console.log('Web3: ', web3.version.api ? web3.version.api : web3.version);
    console.log('Token: ', token.address)
    console.log('Vesting Contract: ', instance.address)
    console.log('TokenDistributor: ', distributor.address)
  })

  describe.skip('_setStakeHolder()', () => {

    it('Should fail to access setHolder', () => {
      assert.strictEqual(instance._setStakeHolder, undefined, 'setStakeHolder function could be accessed');
    })
  })

  describe.skip('_transfer()', () => {

    it('Should fail to access transfer', () => {
      assert.strictEqual(instance._transfer, undefined, '_transfer function could be accessed');
    })
  })
})
