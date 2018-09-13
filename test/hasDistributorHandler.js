const DummyToken = artifacts.require("./DummyToken.sol")
const HasDistributorHandler = artifacts.require("./HasDistributorHandler.sol")
const WeightedTokenDistributor = artifacts.require("./WeightedTokenDistributor.sol")

contract("HasDistributorHandler", (accounts) => {
    const owner = accounts[0];

    let dummyToken;
    let weightedTokenDistributor;
    let hasDistributorHandler;

    const totalStakeholders = 3;
    const initialStakeholderCount = 3;

    const initialStakeholders = accounts.slice(1, initialStakeholderCount+1);
    const initialWeights = [
        3,
        2,
        5,
    ];
    const Account = () => accounts[Math.floor(Math.random()*(accounts.length-1))+1];

    before(async () => {
        dummyToken = await DummyToken.new();
        assert(dummyToken.address, "Dummy Token was not deployed with an address.");

        weightedTokenDistributor = await WeightedTokenDistributor.new(
            0,
            totalStakeholders,
            initialStakeholders,
            initialWeights,
        );
        assert(weightedTokenDistributor.address, "Weighted Token Distributor was not deployed with an address.");


        await weightedTokenDistributor.setTargetToken(dummyToken.address,
          {
              from: owner,
          });
        const returnedToken = await weightedTokenDistributor.targetToken();
        const expectedToken = dummyToken.address;
        assert.strictEqual(
            returnedToken,
            expectedToken,
            "An unexpected token was returned from the Weighted Token Distributor."
        );

        await dummyToken.mint(
            weightedTokenDistributor.address,
            100, {
                from: owner,
            }
        );

        const returnedBalance = await weightedTokenDistributor.getTokenBalance(dummyToken.address);
        assert.strictEqual(
            returnedBalance.toNumber(),
            100,
            "Failed to mint 100 dummyTokens to Weighted Token Distributor."
        );

        // Check the balances of the stakeHolders and assert they === 0, before the transfers take place.
        await initialStakeholders.map(async (stakeholder) => {
            assert.strictEqual(
                (await dummyToken.balanceOf(stakeholder)).toNumber(),
                0,
                `${stakeholder} balance === 0`
            );
        });

        hasDistributorHandler = await HasDistributorHandler.new(0, 0, {
          from: owner
        });
        assert(hasDistributorHandler.address, "Failed to deploy hasDistributorHandler with an address.");
    })

    it('Should fail to setTokenDistributor from Random address', async () => {
      try{
        await hasDistributorHandler.setTokenDistributor(0, weightedTokenDistributor.address, {
          from: Account()
        });
        assert.fail('Random address should not be able to setTokenDistributor');
      } catch (e) {
        assert.exists(e, 'Expected setTokenDistributor to throw');
      }
    })

    it('Should successfully setTokenDistributor', async () => {
        await hasDistributorHandler.setTokenDistributor(1, weightedTokenDistributor.address, {
          from: owner
        });
        const hasDistributorHandlerAddress = await hasDistributorHandler.tokenDistributor.call();
        assert.strictEqual(hasDistributorHandlerAddress, weightedTokenDistributor.address, `Invalid weightedTokenDistributor address set`);
    })

    it('Correctly distributes tokens from random address', async () => {
        const expectedBalances = [
            30,
            20,
            50,
        ];

        await hasDistributorHandler.distribute({
          from: owner
        });

        await initialStakeholders.map(async (stakeholder, idx) => {
            assert.strictEqual(
                (await dummyToken.balanceOf(stakeholder)).toNumber(),
                expectedBalances[idx],
                "Each stakeholder was given the correct weighted balance."
            );
        });
    })
})
