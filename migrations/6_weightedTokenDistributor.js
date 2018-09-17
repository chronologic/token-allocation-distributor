const WeightedTokenDistributor = artifacts.require("./WeightedTokenDistributor.sol");
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

module.exports = (deployer) => {
  deployer.deploy(WeightedTokenDistributor, NULL_ADDRESS, 0, [], []);
}