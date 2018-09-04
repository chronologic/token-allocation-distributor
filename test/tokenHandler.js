const DummyToken = artifacts.require("./DummyToken.sol");
const TokenHandler = artifacts.require("./TokenHandler.sol");

contract('TokenHandler', (accounts) => {
  let token;
  let tokenHandler;
  const owner = accounts[0];

  before(async () => {
    await DummyToken.new().then((_instance) => {
      token = _instance;
    }).then( async () => {
      await TokenHandler.new(
        0
      ).then((_handlerinstance) => {
        tokenHandler = _handlerinstance;
      })
    })
  })

  it('Should fail to access transfer', () => {
    assert.strictEqual(tokenHandler._transfer, undefined, '_transfer function could be accessed');
  })

  it('correctly returns token Balance from random address', async () => {
    const returnedEmptyBalance = await tokenHandler.getTokenBalance.call(token.address);
    assert.equal(returnedEmptyBalance.toNumber(), 0, 'TokenHandler should have no tokens');

    const tokensToMint = Math.floor(10 ** (50 * Math.random()));
    await token.mint(tokenHandler.address, tokensToMint);

    const returnedBalance = await tokenHandler.getTokenBalance.call(token.address);
    assert.equal(returnedBalance.toNumber(), tokensToMint, 'Wrong balance returned from TokenHandler');
  })

  it('Should fail to set targetToken from random address', async () => {
    try {
      await tokenHandler.setTargetToken( token.address, {
        from: accounts[2]
      })
      assert.fail('Set targetToken without permission');
    } catch (e) {
      assert.exists(e);
    }
  })

  it("Correctly sets the targetToken", async () => {
      await tokenHandler.setTargetToken(token.address,
        {
            from: owner,
        });

      const returnedToken = await tokenHandler.targetToken();
      const expectedToken = token.address;
      assert.strictEqual(
          returnedToken,
          expectedToken,
          "The expected token was returned from the Token Handler."
      );
  })

  it("Correctly returns the targetToken", async () => {
      const returnedToken = await tokenHandler.targetToken();

      const expectedToken = token.address;
      assert.strictEqual(
          returnedToken,
          expectedToken,
          "The expected token was returned from the Token Handler."
      );
  })

  it("Fails to update the targetToken", async () => {
      try {
        await tokenHandler.setTargetToken(accounts[5],{
            from: owner,
        });

        const returnedToken = await tokenHandler.targetToken();
        const unExpectedToken = accounts[5];
        assert.notStrictEqual(
            returnedToken,
            unExpectedToken,
            "The expected token was not returned from the Token Handler."
        );
      } catch (e) {
        assert.exists(e)
      }
  })
})
