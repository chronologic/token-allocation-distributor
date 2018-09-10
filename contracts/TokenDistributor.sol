pragma solidity ^0.4.24;

import "../installed_contracts/zeppelin-solidity/contracts/math/SafeMath.sol";
import "./TokenHandler.sol";

contract TokenDistributor is TokenHandler {
    using SafeMath for uint;

    address[] public stakeHolders;
    uint256 public maxStakeHolders;

    event TokensDistributed(address indexed _token, uint256 _total );

    constructor (address _targetToken, uint256 _totalStakeHolders, address[] _stakeHolders)
        public
        TokenHandler(_targetToken)
    {
        require(_stakeHolders.length <= _totalStakeHolders, "The length of stakeholders array exceeds the amount of total stakeholders!");
        maxStakeHolders = _totalStakeHolders;
        if (_stakeHolders.length > 0) {
            for (uint256 count = 0; count < _stakeHolders.length; count++) {
                if (_stakeHolders[count] != 0x0) {
                    // _setStakeHolder(_stakeHolders[count]);
                    stakeHolders.push(_stakeHolders[count]);
                }
            }
        }
    }

    function () public {
        distribute(targetToken);
    }

    function distribute(address _token) 
        internal returns (bool)
    {
        uint256 balance = getTokenBalance(_token);
        uint256 perStakeHolder = getPortion(balance);

        require(balance > 0, "Contract has none of this token!");

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

    function isDistributionDue(address _token)
        public view returns (bool success)
    {
        return getTokenBalance(_token) > 1;
    }

    function isDistributionDueTarget()
        public view returns (bool success)
    {
        return isDistributionDue(targetToken);
    }

    function countStakeHolders()
        public view returns (uint256 numOfStakeHolders)
    {
        return stakeHolders.length;
    }

    function getPortion(uint256 _total)
        public view returns (uint256 portion)
    {
        return _total.div(stakeHolders.length);
    }
}
