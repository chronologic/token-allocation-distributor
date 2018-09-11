pragma solidity ^0.4.24;

import "./interfaces/IVestingHandler.sol";
import "../installed_contracts/zeppelin-solidity/contracts/ownership/Ownable.sol";

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
      require(vestingHandler == 0x0, 'Vesting Handler already set');
      vestingHandler = _vestingHandler;
      return true;
    }

    function release () public returns (bool){
        require(vestingHandler != 0x0, 'Vesting Handler not set');
        IVestingHandler(vestingHandler).release();
    }

    function () public {
      release();
    }
}
