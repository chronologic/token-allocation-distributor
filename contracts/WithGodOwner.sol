pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract WithGodOwner is Ownable {

    function genericCall (address _destination, bytes32 _calldata) public payable onlyOwner returns (bool) {
        _destination.call.value(msg.sender)(_calldata);
        return true;
    }
}
