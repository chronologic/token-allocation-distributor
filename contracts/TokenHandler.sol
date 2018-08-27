pragma solidity ^0.4.24;

import "../installed_contracts/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "../installed_contracts/zeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol";

contract TokenHandler is Ownable {

    address public targetToken;

    constructor ( address _targetToken) public Ownable() {
        setTargetToken(_targetToken);
    }

    function getTokenBalance(address _token) public view returns (uint256) {
        ERC20Basic token = ERC20Basic(_token);
        return token.balanceOf(address(this));
    }

    function setTargetToken (address _targetToken) public onlyOwner returns (bool) {
      require(targetToken == 0x0);
      targetToken = _targetToken;
      return true;
    }

    function _transfer (address _token, address _recipient, uint256 _value) internal {
        ERC20Basic token = ERC20Basic(_token);
        token.transfer(_recipient, _value);
    }
}
