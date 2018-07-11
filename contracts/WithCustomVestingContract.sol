pragma solidity ^0.4.24;

import "./WeightedTokenDistributor.sol";

contract WithCustomVestingContract is WeightedTokenDistributor {
    using SafeMath for uint;

    bytes32 releaseCall;

    function setVestingContract (address _vestingContract, bytes4 _releaseCall, bytes32 _releaseArg) public onlyOwner returns (bool) {
        require(vestingContract == 0x0);
        vestingContract = _vestingContract;
        releaseCall = _releaseCall;
        releaseArg = _releaseArg;
        return true;
    }

    /*
    TODO: is the releaseArg check required?
    */
    function _releaseVesting (address _vestingContract, bytes4 _releaseCall, bytes32 _releaseArg) internal returns (bool) {
        if (_releaseArg == 0x0) {
            vestingContract.call(_releaseCall);
        } else {
            vestingContract.call(_releaseCall, _releaseArg);
        }
        return true;
    }

    function releaseVesting (address _vestingContract, bytes4 _releaseCall, bytes32 _releaseArg) public onlyOwner returns (bool) {
        return _releaseVesting(_vestingContract, _releaseCall, _releaseArg);
    }

    function release () public returns (bool){
        require(vestingContract != 0x0);
        return _releaseVesting(vestingContract, releaseCall, releaseArg);
    }

    function releaseAndDistribute () public {
        require(release());
        distribute(targetToken);
    }
}
