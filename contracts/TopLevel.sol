pragma solidity ^0.4.24;

contract VestingModule {
    function release() public returns (bool success);
}

contract DistributionModule {
    function distribute() public returns (bool suucess);
}

contract TopLevel {
    address vestingModule;
    address distributionModule;

    constructor(
        address _vestingModule,
        address _distributionModule,
        uint256 _accessLevel
    ) public {
        vestingModule = _vestingModule;
        distributionModule = _distributionModule;
        accessLevel = AccessLevel(_accessLevel);
    }

    function releaseAndDistribute()
        public returns (bool success)
    {
        return (
            VestingModule(vestingModule).release()
            && DistributionModule(distributionModule).distribute()
        );
    }

    function setVestingModule(
        address _newVestingModule
    )   public
        accessControl(msg.sender)
        returns (bool success)
    {
        vestingModule = _newVestingModule;
        return true;
    }

    function setDistributionModule(
        address _newDistributionModule
    )   public
        accessControl(msg.sender)
        returns (bool success)
    {
        distributionModule = _newDistributionModule;
        return true;
    }
}