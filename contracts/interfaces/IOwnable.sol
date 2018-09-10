pragma solidity ^0.4.23;

contract IOwnable {
  address public owner;

  event OwnershipRenounced(address indexed previousOwner);
  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );

  function renounceOwnership() public;
  function transferOwnership(address _newOwner) public;
}
