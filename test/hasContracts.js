const Ownable = artifacts.require("./Ownable.sol");
const HasContracts = artifacts.require("./HasContracts.sol");
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

contract('HasContracts', (accounts) => {
  let hasContracts;
  const [owner] = accounts;

  const DummyOwnable = async(_owner) => {
    const ownable = await Ownable.new({
      from: owner
    });
    assert.isNotNull(ownable, 'Failed to deploy DummyOwnable');
    await ownable.transferOwnership(_owner, {
      from: owner
    });
    const newOwner = await ownable.owner.call();
    assert.strictEqual(newOwner, _owner, 'Unable to set owner of DummyOwnale');
    return ownable;
  }

  const randRecipient = () => accounts[Math.floor(Math.random()*(accounts.length-1))+1];

  before(async () => {
    hasContracts = await HasContracts.new({
      from: owner
    });
    assert.isNotNull(hasContracts, 'Failed to deploy hasContracts');
  })

  it('Should fail to renounceOwnedOwnership from random address', async () => {
    const dummyOwned = await DummyOwnable(hasContracts.address);
    const recipient = randRecipient();
    try {
      await hasContracts.renounceOwnedOwnership(dummyOwned.address, {
        from: recipient
      });
      assert.fail('Random address illegally renounceOwnedOwnership');
    } catch (e) {
      assert.exists(e, 'Should have thrown an error');
    }
  })

  it('Should successfully renounceOwnedOwnership', async () => {
    const dummyOwned = await DummyOwnable(hasContracts.address);
    await hasContracts.renounceOwnedOwnership(dummyOwned.address,{
      from: owner
    });
    const newOwner = await dummyOwned.owner.call();
    assert.strictEqual(newOwner, NULL_ADDRESS,'Failed to renounceOwnedOwnership');
  })

  it('Should fail to transferOwnedOwnership from random address', async () => {
    const dummyOwned = await DummyOwnable(hasContracts.address);
    const recipient = randRecipient();
    try {
      await hasContracts.transferOwnedOwnership(
        dummyOwned.address, recipient, {
          from: accounts[0]
        });
      assert.fail('Random address illegally transferOwnedOwnership');
    } catch (e) {
      assert.exists(e, 'Should have thrown an error');
    }
  })

  it('Should successfully transferOwnedOwnership', async () => {
    const dummyOwned = await DummyOwnable(hasContracts.address);
    const recipient = randRecipient();
    await hasContracts.transferOwnedOwnership(
      dummyOwned.address, recipient, {
        from: owner
      })
    const newOwner = await dummyOwned.owner.call();
    assert.strictEqual(newOwner, recipient,'Failed to transferOwnedOwnership');

    try {
      await dummyOwned.transferOwnership(owner, {
          from: recipient
        })
      const newOwner = await dummyOwned.owner.call();
      assert.strictEqual(newOwner, owner,'Failed to transferOwnedOwnership to correct adress');
    } catch (e) {
      assert.notExists(e, 'New owner does not have permission on transferred Ownable')
    }
  })
})
