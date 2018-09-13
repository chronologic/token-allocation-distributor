const DummyToken = artifacts.require("./DummyToken.sol");
const DummyVesting = artifacts.require("./DummyVesting.sol");
const VestingHandler = artifacts.require("./VestingHandler.sol");
const HasVestingHandler = artifacts.require("./HasVestingHandler.sol");

contract("HasVestingHandler", (accounts) => {
    const owner = accounts[0];

    let dummyToken;
    let dummyVesting;
    let vestingHandler;
    let hasVestingHandler;
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
    const Account = () => accounts[Math.floor(Math.random()*(accounts.length-1))+1];

    before(async () => {
      dummyToken = await DummyToken.new();
      assert(dummyToken.address, "Failed to deploy Dummy Token with an address.");

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
      assert(vestingHandler.address, "Failed to deploy Vesting Handler with an address.");

      dummyVesting = await DummyVesting.new(
        vestingHandler.address,
        vestingConfig._start,
        vestingConfig._cliff,
        vestingConfig._duration,
        true
      );
      assert(dummyVesting.address, "Failed to deploy Dummy Vesting with an address.");

      await vestingHandler.setVestingContract(1, dummyVesting.address, {
        from: owner
      });
      const vestingAddress = await vestingHandler.vestingContract.call();
      assert.strictEqual(vestingAddress, dummyVesting.address, `Invalid Vesting address set`);

      const tokensToMint = 100000 * 1e18;
      await dummyToken.mint(dummyVesting.address, tokensToMint);
      const vestingBalance = await dummyToken.balanceOf.call(dummyVesting.address);
      assert.strictEqual( Number(vestingBalance), tokensToMint, 'Wrong amount of tokens minted');

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

      hasVestingHandler = await HasVestingHandler.new(0, {
        from: owner
      })
      assert.isNotNull(hasVestingHandler.address, 'Failed to deploy HasVestingHandler');
    })

    it('Should fail to setVestingHandler from Random address', async () => {
      try{
        await hasVestingHandler.setVestingHandler(vestingHandler.address, {
          from: Account()
        });
        assert.fail('Random address should not be able to setVestingHandler');
      } catch (e) {
        assert.exists(e, 'Expected setVestingHandler to throw');
      }
    })

    it('Should successfully setVestingHandler', async () => {
        await hasVestingHandler.setVestingHandler(vestingHandler.address, {
          from: owner
        });
        const vestingHandlerAddress = await hasVestingHandler.vestingHandler.call();
        assert.strictEqual(vestingHandlerAddress, vestingHandler.address, `Invalid vestingHandler address set`);
    })

    it('Should fail to overwrite VestingHandler', async () => {
      const newVestingHandler = Account();
      try{
        await hasVestingHandler.setVestingHandler(newVestingHandler, {
          from: owner
        });
        assert.fail('Should not be able to overwrite VestingHandler');
      } catch (e) {
        assert.exists(e, 'Expected setVestingHandler to throw');
      }
    })

    it('Should successfully release tokens with vewithwithwithstingHandler', async () => {
        const balance = await dummyToken.balanceOf.call(vestingHandler.address);
        const releasableAmount = await dummyVesting.releasableAmount.call(dummyToken.address);
        assert.isAbove( releasableAmount.toNumber(), 0, 'Should have allocated tokens');

        await hasVestingHandler.release({
          from: Account()
        });
        const newBalance = await dummyToken.balanceOf.call(vestingHandler.address);

        assert.isAtLeast( Number(newBalance), Number(releasableAmount.add(balance)), 'Wrong amount of tokens released');
    })
})
