const VestingHasDistributorHandler = artifacts.require("./VestingHasDistributorHandler.sol");
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

module.exports = (deployer, network) => {
  let token = NULL_ADDRESS;
  if (network === "ropsten") {
    token = "0x7941bc77E1d6BD4628467b6cD3650F20F745dB06";
  }

  deployer.deploy(VestingHasDistributorHandler, 1, NULL_ADDRESS, 1, NULL_ADDRESS, token);
}
