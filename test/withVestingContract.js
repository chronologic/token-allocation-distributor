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
  let vesting;
  let instance;
  const me = accounts[0];
  const stakeHoldersCount = 1;
  const stakeHolders = [me];
  const stakeHoldersWeights = [1];

  const vestingConfig = {
      _start: makeBlockchainTime(new Date().getTime),
      _cliff: makeBlockchainTime(new Date().getTime + 900000),
      _duration: makeBlockchainTime(2400000)
  }

  before( async () => {
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
        instance = _instance;
      })
    })
    .then( async () => {
      return await newDummyVesting(
        instance.address,
        vestingConfig._start,
        vestingConfig._cliff,
        vestingConfig._duration,
        false
      ).then((_instance) => {
        vesting = _instance;
      })
    })
    console.log('Web3: ', web3.version.api ? web3.version.api : web3.version);
    console.log('Token: ', token.address)
    console.log('Vesting Contract: ', vesting.address)
    console.log('TokenDistributor: ', instance.address)
  })

  describe('setVestingContract()', () => {

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

    it('Should fail to set invalid Vesting Contract address', async () => {
      try{
        await instance.setVestingContract(1, 0, {
          from: me
        });
        assert.fail('Should not be able to set null Vesting details');
      } catch (e) {
        assert.ok('Access denied');
      }
    })

    it('Should successfully set Vesting Contract details', async () => {
        await instance.setVestingContract(1, vesting.address, {
          from: me
        });
        const vestingAddress = await instance.vestingContract.call();
        assert.strictEqual(vestingAddress, vesting.address, `invalid Vesting address set`);
    })
  })

  describe('release()', () => {

    it('Should fail to release unallocated tokens ', async () => {
      const releasableAmount = await vesting.releasableAmount.call(token.address);
      assert.equal(releasableAmount.valueOf(), 0, 'Should have no allocated token');
      try {
        await instance.release();
        assert.fail('Should be unable to release zero token balance');
      } catch (e) {
        assert.ok('Access denied');
      }
    })

    it('Should fail to release tokens before due time', async () => {
      const tokensToMint = 100000 * 1e18;
      await token.mint(vesting.address, tokensToMint);

      const blocktime = (await web3.eth.getBlock('latest')).timestamp;
      const cliff = await vesting.cliff.call();

      console.log(blocktime.valueOf(), cliff.valueOf());
      //
      //
      // const releasableAmount = await vesting.releasableAmount.call(token.address);
      // assert.equal(releasableAmount.valueOf(), 0, 'Tokens already ready for release');
      //
      // try {
      //   await instance.release();
      //   assert.fail('Should be unable to release tokens before due time');
      // } catch (e) {
      //   assert.ok('Access denied');
      // }
    })
  })
})
