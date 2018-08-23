pragma solidity^0.4.24;

contract IVestingContract {
  function release() public;
  function release(address token) public;
}
