const DummyToken = artifacts.require("./DummyToken.sol");
const DummyVesting = artifacts.require("./DummyVesting.sol");
const VestingHandler = artifacts.require("./VestingHandler.sol");


contract("Vesting Handler", (accounts) => {
    const me = accounts[0];

    let dummyToken;
    let dummyVesting;
    let vestingHandler;
    let vestingConfig;

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

    before(async () => {
        dummyToken = await DummyToken.new();
        assert(dummyToken.address, "Dummy Token was deployed and has an address.");

        vestingConfig = {
            _cliff: makeBlockchainTime(900000),
            _duration: makeBlockchainTime(24000000),
            _start: (await web3.eth.getBlock('latest')).timestamp
        };

        vestingHandler = await VestingHandler.new(
            0,
            0,
            dummyToken.address
        );
        assert(vestingHandler.address, "Vesting Handler was deployed and has an address.");

        dummyVesting = await DummyVesting.new(
          vestingHandler.address,
          vestingConfig._start,
          vestingConfig._cliff,
          vestingConfig._duration,
          true
        );
        assert(dummyVesting.address, "Dummy Vesting was deployed and has an address.");
    })

    it('Should fail to set Vesting Contract from Random address', async () => {
      try{
        await vestingHandler.setVestingContract(1, dummyVesting.address, {
          from: accounts[1]
        });
        assert.fail('Random address should not be able to set Vesting details');
      } catch (e) {
        assert.ok('Access denied');
      }
    })



    it('Should fail to set invalid Vesting Contract address', async () => {
      try{
        await vestingHandler.setVestingContract(1, 0, {
          from: me
        });
        assert.fail('Should not be able to set null Vesting details');
      } catch (e) {
        assert.ok('Access denied');
      }
    })

    it('Should successfully set Vesting Contract details', async () => {
        await vestingHandler.setVestingContract(1, dummyVesting.address, {
          from: me
        });
        const vestingAddress = await vestingHandler.vestingContract.call();
        assert.strictEqual(vestingAddress, dummyVesting.address, `Invalid Vesting address set`);
    })

    it('Should fail to release unallocated tokens ', async () => {
      const releasableAmount = await dummyVesting.releasableAmount.call(dummyToken.address);
      assert.equal(releasableAmount.valueOf(), 0, 'Should have no allocated dummyToken');
      try {
        await vestingHandler.release({
          from: me
        });
        assert.fail('Should be unable to release zero dummyToken balance');
      } catch (e) {
        assert.ok('Access denied');
      }
    })

    it('Should fail to release tokens before due time', async () => {
      const tokensToMint = 100000 * 1e18;
      await dummyToken.mint(dummyVesting.address, tokensToMint);
      const balance = await dummyToken.balanceOf.call(dummyVesting.address);

      assert.strictEqual( Number(balance), tokensToMint, 'Wrong amount of tokens minted');

      const blocktime = (await web3.eth.getBlock('latest')).timestamp;
      const cliff = await dummyVesting.cliff.call();
      const releasableAmount = await dummyVesting.releasableAmount.call(dummyToken.address);

      assert.isBelow( Number(blocktime), Number(cliff), 'Cliff time should not have been reached');
      assert.strictEqual( Number(releasableAmount), 0, 'Should have no allocated tokens');

      try {
        await vestingHandler.release({
          from: me
        });
        assert.fail('Should be unable to release tokens before due time');
      } catch (e) {
        assert.ok('Access denied');
      }
    })

    it('Should successfully release due tokens (v1)', async () => {

      const blocktime = (await web3.eth.getBlock('latest')).timestamp;
      const timeToCliff = vestingConfig._start + vestingConfig._cliff - blocktime;
      forceMine(timeToCliff);

      try {
        await dummyVesting.setTargetToken(dummyToken.address);
        const targetToken = await dummyVesting.targetToken.call();
        assert.equal(targetToken, dummyToken.address, 'Invalid targetToken address set');
      } catch (e) {
        console.error(e);
        assert.fail('Unable to set dummyVesting target dummyToken')
      }

      const balance = await dummyToken.balanceOf.call(vestingHandler.address);
      const releasableAmount = await dummyVesting.releasableAmount.call(dummyToken.address);

      assert.isAbove( Number(releasableAmount), 0, 'Should have allocated tokens');

      await vestingHandler.releaseVesting( 0, dummyVesting.address, dummyToken.address, {
        from: me
      });
      const newBalance = await dummyToken.balanceOf.call(vestingHandler.address);
      assert.isAtLeast( Number(newBalance), Number(releasableAmount.add(balance)), 'Wrong amount of tokens released');
    })

    it('Should successfully release due tokens (v2)', async () => {
      forceMine(vestingConfig._cliff);

      const balance = await dummyToken.balanceOf.call(vestingHandler.address);
      const releasableAmount = await dummyVesting.releasableAmount.call(dummyToken.address);

      assert.isAbove( Number(releasableAmount), 0, 'Should have allocated tokens');

      await vestingHandler.release({
        from: accounts[2]
      });
      const newBalance = await dummyToken.balanceOf.call(vestingHandler.address);

      assert.isAtLeast( Number(newBalance), Number(releasableAmount.add(balance)), 'Wrong amount of tokens released');
    })
})
