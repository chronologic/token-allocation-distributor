pragma solidity ^0.4.24;

import "./HasVestingHandler.sol";
import "./WeightedTokenDistributor.sol";

/**
* Allows using one call to both release and Distribute tokens from
* Handler and distributor in cases where separate contracts
* Presently does not support re-use
*/
contract DistributorHasVestingHandler is WeightedTokenDistributor, HasVestingHandler {

    constructor (address _vestingHandler, address _targetToken, uint256 _totalStakeHolders, address[] _stakeHolders, uint256[] _weights ) public
    WeightedTokenDistributor ( _targetToken, _totalStakeHolders, _stakeHolders, _weights)
    HasVestingHandler(_vestingHandler)
    {
    }

    function releaseAndDistribute () public {
        release();
        distribute();
    }

    function () {
      releaseAndDistribute();
    }
}
