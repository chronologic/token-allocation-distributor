pragma solidity ^0.4.24;

contract ITokenDistributor {

    address public targetToken;
    address[] public stakeHolders;
    uint256 public maxStakeHolders;
    event InsufficientTokenBalance( address indexed _token, uint256 _time );
    event TokensDistributed( address indexed _token, uint256 _total, uint256 _time );

    function isDistributionDue (address _token) public view returns (bool);
    function isDistributionDue () public view returns (bool);
    function countStakeHolders () public view returns (uint256);
    function getTokenBalance(address _token) public view returns (uint256);
    function getPortion (uint256 _total) public view returns (uint256);
    function setTargetToken (address _targetToken) public returns (bool);
    function distribute (address _token) public returns (bool);
    function distribute () public returns (bool);
}
