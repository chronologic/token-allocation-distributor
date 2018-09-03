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
    assert.strictEqual(TokenHandler._transfer, undefined, '_transfer function could be accessed');
  })

  it('Should fail to set targetToken from random address', async () => {
    try {
      await tokenHandler.setTargetToken( token.address, {
        from: accounts[2]
      })
      assert.fail('Set targetToken without permission');
    } catch (e) {
      assert.isOk(e);
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
          "The expected token was returned from the Weighted Token Distributor."
      );
  })

  it("Correctly returns the targetToken", async () => {
      const returnedToken = await tokenHandler.targetToken();

      const expectedToken = token.address;
      assert.strictEqual(
          returnedToken,
          expectedToken,
          "The expected token was returned from the Weighted Token Distributor."
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
            "The expected token was not returned from the Weighted Token Distributor."
        );
      } catch (e) {
        assert.exists(e)
      }
  })
})
