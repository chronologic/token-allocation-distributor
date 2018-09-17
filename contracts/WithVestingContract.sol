/*
Supports default zeppelin vesting contract
https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC20/TokenVesting.sol
*/
pragma solidity ^0.4.24;

import "./VestingHandler.sol";
import "./WeightedTokenDistributor.sol";

/**
* Creates a Distributor that also serves as the vesting COntract VestingHandler
*/
contract WithVestingContract is WeightedTokenDistributor, VestingHandler {

    constructor (address _targetToken, uint256 _totalStakeHolders, address[] _stakeHolders, uint256[] _weights, vestingContractVersion _targetVersion, address _vestingContract) public
    WeightedTokenDistributor(0, _totalStakeHolders, _stakeHolders, _weights) //Do not pass targetToken
    VestingHandler(_targetVersion, _vestingContract, 0) //Do not pass targetToken
    {
      setTargetToken(_targetToken);
    }

    function releaseAndDistribute () public {
        require(release(), 'Failed to release tokens from vesting contract');
        distribute();
    }

    function () public {
        releaseAndDistribute();
    }
}
