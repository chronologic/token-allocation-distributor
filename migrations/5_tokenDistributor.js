const TokenDistributor = artifacts.require("./TokenDistributor.sol");
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

module.exports = (deployer, network) => {
  let token = NULL_ADDRESS;
  let stakeHolderCount = 4;
  let stakeHolders = [
    "0x0000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000002",
    "0x0000000000000000000000000000000000000003",
    "0x0000000000000000000000000000000000000004"
  ];
  if (network === 'ropsten') {
    token = "0x7941bc77E1d6BD4628467b6cD3650F20F745dB06";
  }

  deployer.deploy(TokenDistributor, token, stakeHolderCount, stakeHolders);
}