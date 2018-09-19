pragma solidity ^0.4.24;

import "./HasContracts.sol";
import "./VestingHasDistributorHandler.sol";


contract VestingHasDistributorHandlerHasContracts is VestingHasDistributorHandler, HasContracts {

    constructor (distributorContractVersion _distributorVersion, address _tokenDistributor, vestingContractVersion _targetVersion, address _vestingContract, address _targetToken) public
    VestingHasDistributorHandler( _distributorVersion, _tokenDistributor, _targetVersion, _vestingContract, _targetToken )
    HasContracts()
    {
    }
}
