const DummyToken = artifacts.require("./DummyToken.sol");
const TokenDistributor = artifacts.require("./TokenDistributor.sol");

const newDummy = () => DummyToken.new();
const newDistributor = (_token, _stakeHoldersCount, _stakeHolders) => {
  return TokenDistributor.new(
    _token, _stakeHoldersCount, _stakeHolders
  )
}

contract('TokenDistributor', (accounts) => {
  let token;
  let instance;
  const me = accounts[0];
  const stakeHoldersCount = Math.floor((accounts.length-3) * Math.random()) + 1;
  const stakeHolders = accounts.filter( (account, index) => {
    return index > 0 && index < (stakeHoldersCount+1);
  })
  console.log('Total StakeHolders: ', stakeHoldersCount)
  console.log('StakeHolders: ', stakeHolders)

  before(async () => {
    await newDummy().then((_instance) => {
      token = _instance;
    }).then( async () => {
      await newDistributor(
        token.address,
        stakeHoldersCount,
         stakeHolders
      ).then((_instance) => {

        instance = _instance;
      })
    })
    console.log('Web3: ', web3.version.api ? web3.version.api : web3.version);
    console.log('Token: ', token.address)
    console.log('TokenDistributor: ',instance.address)
  })

  it('Should fail to access setHolder', () => {
    assert.strictEqual(instance._setStakeHolder, undefined, 'setStakeHolder function could be accessed');
  })

  it('Should fail to access transfer', () => {
    assert.strictEqual(instance._transfer, undefined, '_transfer function could be accessed');
  })
})
