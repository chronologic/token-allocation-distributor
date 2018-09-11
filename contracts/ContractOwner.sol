pragma solidity ^0.4.24;

import "../installed_contracts/zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title ContractOwner
 * @dev The ContractOwner contract serves the role of interactng with the functions of Ownable contracts,
 * this simplifies the implementation of "user permissions".
 */
contract ContractOwner is Ownable {

  /**
   * @dev Relinquish control of the owned _contract.
   */
  function renounceOwnedOwnership(address _contract) public onlyOwner {
    Ownable(_contract).renounceOwnership();
  }

  /**
   * @dev Transfer control of the owned _contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function transferOwnedOwnership(address _contract, address _newOwner) public onlyOwner {
    Ownable(_contract).transferOwnership(_newOwner);
  }
}
