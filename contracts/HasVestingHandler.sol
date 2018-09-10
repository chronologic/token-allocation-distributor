pragma solidity ^0.4.24;

import "../installed_contracts/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "../interfaces/IVestingHandler.sol";

/**
* A secondary contract which can interact directly with vestingHandler
* and can ultimately be made Owner to acheieve full `Code is Law` state
*/
contract HasVestingHandler is Ownable {

    address public vestingHandler;

    constructor ( address _vestingHandler) public Ownable() {
        setVestingHandler(_vestingHandler);
    }

    function setVestingHandler (address _vestingHandler) public onlyOwner returns (bool) {
      require(vestingHandler == 0x0);
      vestingHandler = _vestingHandler;
      return true;
    }

    function release () public returns (bool){
        require(vestingHandler != 0x0);
        vestingHandler.release();
    }

    function () {
      release();
    }
}
