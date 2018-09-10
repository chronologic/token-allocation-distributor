pragma solidity ^0.4.24;

import "../installed_contracts/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "../interfaces/ITokenDistributor.sol";

/**
* A secondary contract which can interact directly with tokenDistributor
* and can ultimately be made Owner to acheieve full `Code is Law` state
*/
contract HasDistributorHandler is Ownable {
    /**
    *   Allows distributing of tokens from tokenDistributor contracts
    *   supports only 2 versions at present
    *   Version1 : distribute()
    *   version2 : distribute(address token) ( fallback() ) : for backward compatibility
    *
    *   version type has to be passed in to complete the release, default is version1.
    *  0 => version1
    *  1 => version2
    *
    */

    enum distributorContractVersion { v1, v2 }

    address public distributorVersion;
    address public tokenDistributor;

    constructor (distributorContractVersion _distributorVersion, address _tokenDistributor) public Ownable() {
        setTokenDistributor(_distributorVersion, _tokenDistributor);
    }

    function setTokenDistributor (distributorContractVersion _distributorVersion, address _tokenDistributor) public onlyOwner returns (bool) {
      require(tokenDistributor == 0x0);
      distributorVersion = _distributorVersion;
      tokenDistributor = _tokenDistributor;
      return true;
    }

    function distribute () public returns (bool) {
        require(tokenDistributor != 0x0);

        if (distributorVersion == distributorContractVersion.v2) {
            return ITokenDistributor(tokenDistributor).distribute();
        } else {
          /* TODO Check functionaliy and optimize  */
            tokenDistributor.transfer(0);
            return true;
        }
        return false;
    }

    function () {
      distribute();
    }
}
