pragma solidity ^0.4.24;

contract VestingHandler is Ownable {

    enum vestingContractVersion { v1, v2 }

    address public targetToken;
    address public vestingContract;
    vestingContractVersion public targetVersion;

    function setVestingContract (vestingContractVersion _version, address _vestingContract) public returns (bool);
    function setTargetToken (address _targetToken) public returns (bool);
    function releaseVesting (vestingContractVersion _version, address _vestingContract, address _targetToken) public returns (bool);
    function releaseVesting (vestingContractVersion _version, address _vestingContract) public returns (bool);
    function release () public returns (bool);
}
