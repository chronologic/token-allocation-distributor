const VestingHasDistributorHandler = artifacts.require("./VestingHasDistributorHandler.sol");
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

module.exports = (deployer) => {
  deployer.deploy(VestingHasDistributorHandler, 1, NULL_ADDRESS, 1, NULL_ADDRESS, NULL_ADDRESS);
}