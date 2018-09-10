const DummyToken = artifacts.require("./DummyToken.sol");
const DummyVesting = artifacts.require("./DummyVesting.sol");
const WithVestingContract = artifacts.require("./WithVestingContract.sol");

contract("WithVestingContract", (accounts) => {

    let token;
    let vesting;
    let instance;
    let vestingConfig;
    const me = accounts[0];
    const stakeHoldersCount = 5;
    const stakeHolders = accounts.slice(1, stakeHoldersCount);
    const stakeHoldersWeights = [10,15,2,30,34];
    const tokensToMint = 100000 * 1e18;

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
    };

    before( async () => {
        token = await DummyToken.new();
        assert(token.address, "Dummy Token was not deployed or does not have an address.");

        vestingConfig = {
            _cliff: makeBlockchainTime(900000),
            _duration: makeBlockchainTime(24000000),
            _start: (await web3.eth.getBlock("latest")).timestamp
        };

        instance = await WithVestingContract.new(
            token.address,
            stakeHoldersCount,
            stakeHolders,
            stakeHoldersWeights,
            0,
            0
        );
        assert(instance.address, "Distributor was not deployed or does not have an address.");
        const instanceTargetToken = await instance.targetToken.call();
        assert.strictEqual(instanceTargetToken, token.address, "Invalid targetToken address set for Distributor.");

        vesting = await DummyVesting.new(
            instance.address,
            vestingConfig._start,
            vestingConfig._cliff,
            vestingConfig._duration,
            true
        );
        assert(vesting.address, "Vesting contract was deployed and has an address.");

        await vesting.setTargetToken(token.address);
        const targetToken = await vesting.targetToken.call();
        assert.strictEqual(targetToken, token.address, "Invalid targetToken address set for Vesting contract.");

        console.log("Token: ", token.address);
        console.log("Vesting Contract: ", vesting.address);
        console.log("TokenDistributor: ", instance.address);

        await instance.setVestingContract(1, vesting.address, {
            from: me
        });
        const vestingAddress = await instance.vestingContract.call();
        assert.strictEqual(vestingAddress, vesting.address, "Invalid Vesting address set");

        await token.mint(vesting.address, tokensToMint);
        const balance = await token.balanceOf.call(vesting.address);
        assert.strictEqual( Number(balance), tokensToMint, "Wrong amount of tokens minted");
    });

    it("successfully releases and distributes tokens from Random address", async () => {
        const expectedBeforeBalances = [0,0,0,0];
        const beforeBalances = [];

        const blocktime = (await web3.eth.getBlock("latest")).timestamp;
        const timeToCliff = vestingConfig._start + vestingConfig._cliff - blocktime;
        forceMine(timeToCliff);

        const balances = (result) => {
            return stakeHolders.map( async stakeHolder => {
                result.push(Number(await token.balanceOf.call(stakeHolder)));
            });
        };
        await Promise.all(balances(beforeBalances));
        assert.deepEqual(beforeBalances, expectedBeforeBalances, "Address should have no balances before distribution");

        const releasableAmount = await vesting.releasableAmount.call(token.address);
        assert.isAbove( Number(releasableAmount), 0, "Should have allocated tokens");

        const expectedAfterBalancesPromises = stakeHolders.map( async stakeHolder => {
            return Number(await instance.getPortion.call(releasableAmount.toFixed(), stakeHolder));
        });
        const expectedAfterBalances = await Promise.all(expectedAfterBalancesPromises);

        await instance.releaseAndDistribute({
            from: me
        });
        const afterBalances = [];
        await Promise.all(balances(afterBalances));
        assert.deepEqual( afterBalances, expectedAfterBalances, "Wrong number of Tokens distributed");
    });
});
