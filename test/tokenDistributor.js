const DummyToken = artifacts.require("./DummyToken.sol");
const TokenDistributor = artifacts.require("./TokenDistributor.sol");

contract('TokenDistributor', (accounts) => {
  let token;
  let tokenDistributor;
  const me = accounts[0];
  const stakeHoldersCount = Math.floor((accounts.length-3) * Math.random()) + 1;
  const stakeHolders = accounts.filter( (account, index) => {
    return index > 0 && index < (stakeHoldersCount+1);
  })
  console.log('Total StakeHolders: ', stakeHoldersCount)
  console.log('StakeHolders: ', stakeHolders)

  before(async () => {
    await DummyToken.new().then((_instance) => {
      token = _instance;
    }).then( async () => {
      await TokenDistributor.new(
        token.address,
        stakeHoldersCount,
        stakeHolders
      ).then((_instance) => {

        tokenDistributor = _instance;
      })
    })

    const targetToken = await tokenDistributor.targetToken.call();
    assert.strictEqual(
        targetToken,
        token.address,
        "Wrong targetToken was set in the TOken Distributor."
    );

    console.log('Web3: ', web3.version.api ? web3.version.api : web3.version);
    console.log('Token: ', token.address)
    console.log('TokenDistributor: ',tokenDistributor.address)
  })

  it('Should fail to access setHolder', () => {
    assert.strictEqual(tokenDistributor._setStakeHolder, undefined, 'setStakeHolder function could be accessed');
  })

  it('Should fail to access _distribute', () => {
    assert.strictEqual(tokenDistributor.__distribute, undefined, '__distribute function could be accessed');
  })

  it('Correctly returns the stakeHolders array', async () => {
      const expectedStakeHolders = stakeHolders.map(() => true);
      const returnedStakeHolders = [];

      for ( let s = 0; s < stakeHolders.length; s++) {
        returnedStakeHolders.push(
          (await tokenDistributor.stakeHolders.call(s)) === stakeHolders[s]
        )
      }
      assert.deepEqual(
          returnedStakeHolders,
          expectedStakeHolders,
          "Wrong expected stakeHolders array was returned from the Token Distributor."
      );
  })

  it("Correctly returns the maxStakeHolders", async () => {
      const returnedMaxStakeHolders = await tokenDistributor.maxStakeHolders();

      const expectedMaxStakeHolders = stakeHoldersCount;
      assert.strictEqual(
          returnedMaxStakeHolders.toNumber(),
          expectedMaxStakeHolders,
          "Wrong expected maxStakeHolders was returned from the Token Distributor."
      );
  })

  it('Correctly counts stakeHolders', async () => {
      const returnedCount = await tokenDistributor.countStakeHolders();

      const expectedCount = stakeHolders.filter( stakeholder => Number(stakeholder) > 0).length;

      assert.strictEqual(
          returnedCount.toNumber(),
          expectedCount,
          "Wrong expected count was returned from the Token Distributor."
      );
  })

  it('Correctly calculates the portion split by providing total avaialble tokens', async () => {
    //Use weightedTokenDistributor.contract to access overloaded functions
      const expectedCount = stakeHolders.filter( stakeholder => Number(stakeholder) > 0).length;
      const total = Math.floor(256 ** (10 * Math.random()));
      const returnedPortion = await tokenDistributor.getPortion(total);

      const expectedPortion = Math.floor( total /  expectedCount );

      assert.strictEqual(
          returnedPortion.toNumber(),
          expectedPortion,
          "The expected portion was returned from the Weighted Token Distributor."
      );
  })

  it("Correctly detects isDistributionDue", async () => {
    const falseisDistributionDue = await tokenDistributor.contract.isDistributionDue[''].call();
    assert.isFalse(falseisDistributionDue, 'TokenHandler should have no tokens');

    const tokensToMint = Math.floor(10 ** (50 * Math.random()));
    await token.mint(tokenDistributor.address, tokensToMint);

    const isDistributionDue = await tokenDistributor.contract.isDistributionDue[''].call();
    assert.isTrue(isDistributionDue, 'Failed to detect isDistributionDue');
  })

  it("Correctly distributes tokens", async () => {
    const balance = await tokenDistributor.getTokenBalance.call(token.address);
    assert.isAbove(balance.toNumber(), 0, 'Token Distributor should have allocated tokens');

    const portion = await tokenDistributor.getPortion.call(balance.toFixed());
    const expectedBalance = stakeHolders.map( () => true );

    await tokenDistributor.distribute();
    const returnedBalance = await Promise.all(stakeHolders.map( async (stakeHolder) => (await token.balanceOf(stakeHolder)).toFixed() === portion.toFixed() ));

    assert.deepEqual(
        returnedBalance,
        expectedBalance,
        "The expected tokens were not distriuted by the Token Distributor."
    );
  })

})
