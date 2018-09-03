const DummyToken = artifacts.require("./DummyToken.sol")
const WeightedTokenDistributor = artifacts.require("./WeightedTokenDistributor.sol")

contract("Weighted Token Distributor", (accounts) => {
    const default_account = accounts[0];

    let dummyToken;
    let weightedTokenDistributor;

    const totalStakeholders = 3;
    const initialStakeholderCount = 3;

    const initialStakeholders = accounts.slice(1, initialStakeholderCount+1);
    const initialWeights = [
        3,
        2,
        5,
    ];

    before(async () => {
        dummyToken = await DummyToken.new();
        assert(dummyToken.address, "Dummy Token was deployed and has an address.");

        weightedTokenDistributor = await WeightedTokenDistributor.new(
            0,
            totalStakeholders,
            initialStakeholders,
            initialWeights,
        );

        assert(weightedTokenDistributor.address, "Weighted Token Distributor was deployed and has an address.");


        await weightedTokenDistributor.setTargetToken(dummyToken.address,
          {
              from: default_account,
          });

        const returnedToken = await weightedTokenDistributor.targetToken();
        const expectedToken = dummyToken.address;
        assert.strictEqual(
            returnedToken,
            expectedToken,
            "The expected token was returned from the Weighted Token Distributor."
        );
    })

    it('Correctly calculates the weight', async () => {
        const returnedWeight = await weightedTokenDistributor.getTotalWeight();

        const expectedWeight = initialWeights.reduce((a,b) => a+b, 0);

        assert.strictEqual(
            returnedWeight.toNumber(),
            expectedWeight,
            "The expected weight was returned from the Weighted Token Distributor."
        );
    })

    it('Reverts on using `getPortion` without a weight param', async () => {
      //Use weightedTokenDistributor.contract to access overloaded functions
      try {
        await weightedTokenDistributor.contract.getPortion['uint256'](3);
        assert.fail('Fethced portion without providing weight')
      } catch {
        assert.ok('Requires weight to getPortion');
      }
    })

    it('Correctly calculates the portion according to the weight passed', async () => {
      //Use weightedTokenDistributor.contract to access overloaded functions
        const returnedPortion = await weightedTokenDistributor.contract.getPortion['uint256,uint256,address'](100, 10, initialStakeholders[0]);

        const expectedPortion = 100 * 3 / 10;

        assert.strictEqual(
            returnedPortion.toNumber(),
            expectedPortion,
            "The expected portion was returned from the Weighted Token Distributor."
        );
    })

    it('Correctly distributes 100 tokens', async () => {
        await dummyToken.mint(
            weightedTokenDistributor.address,
            100,
            {
                from: default_account,
            }
        );

        const returnedBalance = await weightedTokenDistributor.getTokenBalance(dummyToken.address);
        assert.strictEqual(
            returnedBalance.toNumber(),
            100,
            "Created 100 dummyTokens to Weighted Token Distributor."
        );

        // Check the balances of the stakeHolders and assert they === 0
        // before the transfers take place.
        await initialStakeholders.map(async (stakeholder) => {
            assert.strictEqual(
                (await dummyToken.balanceOf(stakeholder)).toNumber(),
                0,
                `${stakeholder} balance === 0`
            );
        });

        const expectedBalances = [
            30,
            20,
            50,
        ];

        await weightedTokenDistributor.distribute();

        await initialStakeholders.map(async (stakeholder, idx) => {
            assert.strictEqual(
                (await dummyToken.balanceOf(stakeholder)).toNumber(),
                expectedBalances[idx],
                "Each stakeholder was given the correct weighted balance."
            );
        });
    })
})
