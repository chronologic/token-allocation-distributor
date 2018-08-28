pragma solidity ^0.4.24;

import "../installed_contracts/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "../interfaces/IVestingHandler.sol";
import "../interfaces/ITokenDistributor.sol";

/**
* Allows using one call to both release and Distribute tokens from
* Handler and distributor in cases where separate contracts
* Presently does not support re-use
*/
contract VestingDistributorHandler is Ownable {

    address public vestingHandler;
    address public tokenDistributor;

    constructor ( address _vestingHandler, address _tokenDistributor) public Ownable() {
        setVestingHandler(_vestingHandler);
        setTokenDistributor(_tokenDistributor);
    }

    function setVestingHandler (address _vestingHandler) public onlyOwner returns (bool) {
      require(vestingHandler == 0x0);
      vestingHandler = _vestingHandler;
      return true;
    }

    function setTokenDistributor (address _tokenDistributor) public onlyOwner returns (bool) {
      require(tokenDistributor == 0x0);
      tokenDistributor = _tokenDistributor;
      return true;
    }

    function release () public returns (bool){
        require(vestingHandler != 0x0);
        vestingHandler.release();
    }

    function distribute () public returns (bool) {
        require(tokenDistributor != 0x0);
        tokenDistributor.distribute();
    }

    function releaseAndDistribute () public {
        release();
        distribute();
    }

    function () {
      releaseAndDistribute();
    }
}
