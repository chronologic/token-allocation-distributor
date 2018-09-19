pragma solidity ^0.4.24;

import "./HasDistributorHandler.sol";
import "./VestingHandler.sol";

/**
* Allows using one call to both release and Distribute tokens from
* Handler and distributor in cases where separate contracts
* Presently does not support re-use
*/
contract VestingHasDistributorHandler is VestingHandler, HasDistributorHandler {

    constructor (distributorContractVersion _distributorVersion, address _tokenDistributor, vestingContractVersion _targetVersion, address _vestingContract, address _targetToken) public
    VestingHandler( _targetVersion, _vestingContract, _targetToken )
    HasDistributorHandler(_distributorVersion, _tokenDistributor)
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
