pragma solidity ^0.4.24;

import "../installed_contracts/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "../installed_contracts/zeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol";

contract TokenHandler is Ownable {
    address public targetToken;

    constructor (address _targetToken) public Ownable() {
        require(_targetToken != 0x0, "Must specify a target token!");
        setTargetToken(_targetToken);
    }

    function setTargetToken(address _target)
        public
        onlyOwner
        returns (bool success)
    {
        targetToken = _target;
        return true;
    }

    function getTokenBalance(address _token)
        public view returns (uint256 totalBalance)
    {
        ERC20Basic token = ERC20Basic(_token);
        return token.balanceOf(address(this));
    }

    function _transfer (address _token, address _recipient, uint256 _value) internal {
        ERC20Basic token = ERC20Basic(_token);
        token.transfer(_recipient, _value);
    }
}
