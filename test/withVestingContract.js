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
const newDistributor = (_token, _stakeHoldersCount, _stakeHolders, _stakeHoldersWeights) =>
  WithVestingContract.new(
    _token, _stakeHoldersCount, _stakeHolders, _stakeHoldersWeights
  );

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

const snapShot = async () => {
  return await web3.currentProvider.send({
    jsonrpc: "2.0",
    method: "evm_snapshot",
    id: 0x15f0
  });
}

const revert = async (snapshot) => {
  return await web3.currentProvider.send({
    jsonrpc: "2.0",
    method: "evm_revert",
    param:[snapshot],
    id: 0x12450c
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
      _start: makeBlockchainTime(new Date().getTime()),
      _cliff: makeBlockchainTime(900000),
      _duration: makeBlockchainTime(24000000)
  }

  after( async () => await revert(snapshot))

  before( async () => {
    snapshot = await snapShot();

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
        assert.fail('Random address should not be able to set Vesting detaitargettargettargettargettargettargetls');
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
        await instance.release({
          from: me
        });
        assert.fail('Should be unable to release zero token balance');
      } catch (e) {
        assert.ok('Access denied');
      }
    })

    it('Should fail to release tokens before due time', async () => {
      const tokensToMint = 100000 * 1e18;
      await token.mint(vesting.address, tokensToMint);
      const balance = await token.balanceOf.call(vesting.address);

      assert.strictEqual( Number(balance), tokensToMint, 'Wrong amount of tokens minted');

      const blocktime = (await web3.eth.getBlock('latest')).timestamp;
      const start = await vesting.start.call();
      const cliff = await vesting.cliff.call();

      assert.isBelow( Number(blocktime), Number(start.add(cliff)), 'Cliff time should not have been reached');

      try {
        await instance.release({
          from: me
        });
        assert.fail('Should be unable to release tokens before due time');
      } catch (e) {
        assert.ok('Access denied');
      }
    })

    it('Should successfully release due tokens (v1)', async () => {
      const timeToCliff = vestingConfig._start + vestingConfig._cliff - makeBlockchainTime(new Date().getTime());
      console.log('timetoCliff: ', timeToCliff)
      // forceMine(timeToCliff);

      await vesting.setTargetToken(token.address);
      const targetToken = await vesting.targetToken.call();
      assert.equal(targetToken, token.address, 'Invalid targetToken address set');

      const balance = await token.balanceOf.call(instance.address);
      const releasableAmount = await vesting.releasableAmount.call(token.address);
      console.log( Number(balance), Number(releasableAmount));

      assert.isAbove( Number(releasableAmount), 0, 'Should have allocated tokens');
      console.log('release')

      await instance.releaseVesting( 0, vesting.address, token.address, {
        from: accounts[1]
      });
      const newBalance = await token.balanceOf.call(instance.address);
      console.log( Number(balance), Number(releasableAmount), Number(newBalance))
      assert.isAtLeast( Number(newBalance), Number(releasableAmount.add(balance)), 'Wrong amount of tokens released');
    })

    it('Should successfully release due tokens (v2)', async () => {
      // forceMine(vestingConfig._cliff);

      const balance = await token.balanceOf.call(instance.address);
      const releasableAmount = await vesting.releasableAmount.call(token.address);
      console.log( Number(balance), Number(releasableAmount));

      assert.isAbove( Number(releasableAmount), 0, 'Should have allocated tokens');

      await instance.release({
        from: accounts[2]
      });
      const newBalance = await token.balanceOf.call(instance.address);

      assert.isAtLeast( Number(newBalance), Number(releasableAmount.add(balance)), 'Wrong amount of tokens released');
    })

  })
})
