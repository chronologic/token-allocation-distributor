/*
Supports default zeppelin vesting contract
https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC20/TokenVesting.sol
*/
pragma solidity ^0.4.24;

import "./WeightedTokenDistributor.sol";

contract HasVestedContract is WeightedTokenDistributor {
    using SafeMath for uint;

    address vestingContract;

    function setVestingContract (address _vestingContract) public onlyOwner returns (bool) {
        require(vestingContract == 0x0);
        vestingContract = _vestingContract;
        return true;
    }

    function _releaseVesting (address _vestingContract) internal returns (bool) {
        vestingContract.call(bytes4(keccak256("release(address)")), targetToken);
        return true;
    }

    function releaseVesting (address _vestingContract) public onlyOwner returns (bool) {
        return _releaseVesting(_vestingContract);
    }

    function release () public returns (bool){
        require(vestingContract != 0x0);
        return _releaseVesting(vestingContract);
    }

    function releaseAndDistribute () public {
        require(release());
        distribute(targetToken);
    }
}
