pragma solidity ^0.4.24;

import "./HasDistributorHandler.sol";
import "./HasVestingHandler.sol";

/**
* Allows using one call to both release and Distribute tokens from
* Handler and distributor in cases where separate contracts
* Presently does not support re-use
*/
contract VestingDistributorHandler is HasVestingHandler, HasDistributorHandler {

    constructor ( address _vestingHandler, distributorContractVersion _distributorVersion, address _tokenDistributor) public
    HasDistributorHandler (distributorContractVersion _distributorVersion, address _tokenDistributor)
    HasVestingHandler ( address _vestingHandler)
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
