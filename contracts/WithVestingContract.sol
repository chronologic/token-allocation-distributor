/*
Supports default zeppelin vesting contract
https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC20/TokenVesting.sol
*/
pragma solidity ^0.4.24;

import "./IvestingContract.sol";
import "./WeightedTokenDistributor.sol";

contract WithVestingContract is WeightedTokenDistributor {

    /**
    *   Allows releasing of tokens from vesting contracts
    *   supports only 2 versions at present
    *   Version1 : release()
    *   version2 : release(address token)
    *
    *   version type has to be passed in to complete the release, default is version1.
    *  0 => version1
    *  1 => version2
    */

    using SafeMath for uint;

    enum vestingContractVersion { v1, v2 }

    address public vestingContract;
    vestingContractVersion public targetVersion;

    constructor ( address _targetToken, uint256 _totalStakeHolders, address[] _stakeHolders, uint256[] _weights) public
    WeightedTokenDistributor(_targetToken, _totalStakeHolders, _stakeHolders, _weights)
    {}

    function setVestingContract (vestingContractVersion _version, address _vestingContract) public onlyOwner returns (bool) {
        require(vestingContract == 0x0);
        vestingContract = _vestingContract;
        targetVersion = _version;
        return true;
    }

    function _releaseVesting (vestingContractVersion _version, address _vestingContract, address _targetToken) internal returns (bool) {
        require(_targetToken != 0x0);
        if (_version == vestingContractVersion.v1) {
            return _releaseVesting (_version, _vestingContract);
        } else if (_version == vestingContractVersion.v2){
            IvestingContract(_vestingContract).release(_targetToken);
            return true;
        }
        return false;
    }

    function _releaseVesting (vestingContractVersion _version, address _vestingContract) internal returns (bool) {
        if (_version != vestingContractVersion.v1) {
            revert('You need to pass in the additional argument(s)');
        }
        IvestingContract(_vestingContract).release();
        return true;
    }

    function releaseVesting (vestingContractVersion _version, address _vestingContract, address _targetToken) public onlyOwner returns (bool) {
        return _releaseVesting(_version, _vestingContract, _targetToken);
    }

    function releaseVesting (vestingContractVersion _version, address _vestingContract) public onlyOwner returns (bool) {
        return _releaseVesting(_version, _vestingContract);
    }

    function release () public returns (bool){
        require(vestingContract != 0x0);
        return _releaseVesting(targetVersion, vestingContract, targetToken);
    }

    function releaseAndDistribute () public {
        require(release());
        distribute(targetToken);
    }
}
