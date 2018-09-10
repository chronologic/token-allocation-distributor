pragma solidity ^0.4.24;

import "./interfaces/IVestingContract.sol";
import "./TokenHandler.sol";

/**
 * @title VestingHandler
 * @dev Supports default zeppelin vesting contract:
 * https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC20/TokenVesting.sol
*/
contract VestingHandler is TokenHandler {

    /**
    *   Allows releasing of tokens from vesting contracts
    *   supports only 2 versions at present
    *   Version1 : release()
    *   version2 : release(address token)
    *
    *   version type has to be passed in to complete the release, default is version1.
    *   0 => version1
    *   1 => version2
    */

    enum vestingContractVersion { v1, v2 }

    address public vestingContract;
    vestingContractVersion public targetVersion;

    constructor(
        vestingContractVersion _targetVersion,
        address _vestingContract,
        address _targetToken
    )   public
        TokenHandler(_targetToken)
    {
        require(_vestingContract != address(0x0), "Please specifity address of vesting contract!");
        setVestingContract(_targetVersion, _vestingContract);
    }

    function () public {
      release();
    }

    function release() public returns (bool success){
        require(vestingContract != 0x0, 'Vesting Contract not set');
        return _releaseVesting(targetVersion, vestingContract, targetToken);
    }

    function _releaseVesting(
        vestingContractVersion _version,
        address _vestingContract,
        address _targetToken
    )   internal 
        returns (bool success)
    {
        require(_targetToken != 0x0, "Target token must be specified!");
        if (_version == vestingContractVersion.v1) {
            return releaseVestingV1(_vestingContract);
        } else if (_version == vestingContractVersion.v2){
            IVestingContract(_vestingContract).release(_targetToken);
            return true;
        }
        return false;
    }

    function releaseVestingV1(
        address _vestingContract
    )   internal 
        returns (bool success)
    {
        IVestingContract(_vestingContract).release();
        return true;
    }

    function setVestingContract(
        vestingContractVersion _version,
        address _vestingContract
    )   public
        onlyOwner
        returns (bool success)
    {
        vestingContract = _vestingContract;
        targetVersion = _version;
        return true;
    }

    // function releaseVesting (vestingContractVersion _version, address _vestingContract, address _targetToken) public onlyOwner returns (bool) {
    //     return _releaseVesting(_version, _vestingContract, _targetToken);
    // }

    // function releaseVesting (vestingContractVersion _version, address _vestingContract) public onlyOwner returns (bool) {
    //     return _releaseVesting(_version, _vestingContract);
    // }
}
