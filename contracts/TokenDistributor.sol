pragma solidity ^0.4.24;

import "../installed_contracts/zeppelin-solidity/contracts/math/SafeMath.sol";
import "./TokenHandler.sol";

contract TokenDistributor is TokenHandler {
    using SafeMath for uint;

    address[] public stakeHolders;
    uint256 public maxStakeHolders;
    event InsufficientTokenBalance( address indexed _token );
    event TokensDistributed( address indexed _token, uint256 _total );

    constructor ( address _targetToken, uint256 _totalStakeHolders, address[] _stakeHolders) public
    TokenHandler(_targetToken) {
        maxStakeHolders = _totalStakeHolders;
        if (_stakeHolders.length > 0) {
            for (uint256 count = 0; count < _stakeHolders.length && count < _totalStakeHolders; count++) {
                if (_stakeHolders[count] != 0x0) {
                    _setStakeHolder(_stakeHolders[count]);
                }
            }
        }
    }

    function isDistributionDue (address _token) public view returns (bool) {
        return getTokenBalance(_token) > 1;
    }

    function isDistributionDue () public view returns (bool) {
        return isDistributionDue(targetToken);
    }

    function countStakeHolders () public view returns (uint256) {
        return stakeHolders.length;
    }

    function getPortion (uint256 _total) public view returns (uint256) {
        return _total.div(stakeHolders.length);
    }

    function _setStakeHolder (address _stakeHolder) internal onlyOwner returns (bool) {
        require(countStakeHolders() < maxStakeHolders, "Max StakeHolders set");
        stakeHolders.push(_stakeHolder);
        return true;
    }

    function _distribute (address _token) internal returns (bool) {
        uint256 balance = getTokenBalance(_token);
        uint256 perStakeHolder = getPortion(balance);

        if (balance < 1) {
            emit InsufficientTokenBalance(_token);
            return false;
        } else {
            for (uint256 count = 0; count < stakeHolders.length; count++) {
                _transfer(_token, stakeHolders[count], perStakeHolder);
            }

            uint256 newBalance = getTokenBalance(_token);
            if (newBalance > 0 && getPortion(newBalance) == 0) {
                _transfer(_token, owner, newBalance);
            }

            emit TokensDistributed(_token, balance);
            return true;
        }
    }

    function distributeTokens (address _targetToken) public onlyOwner returns (bool) {
        require(_targetToken != 0x0, 'Target token not set');
        return _distribute(_targetToken);
    }

    function distribute () public returns (bool) {
        require(targetToken != 0x0, 'Target token not set');
        return _distribute(targetToken);
    }

    function () public {
        distribute();
    }
}
