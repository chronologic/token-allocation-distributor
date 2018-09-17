const DistributorHasVestingHandler = artifacts.require("./DistributorHasVestingHandler");
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

module.exports = (deployer) => {
  deployer.deploy(DistributorHasVestingHandler, NULL_ADDRESS, NULL_ADDRESS, 0, [], []);
}