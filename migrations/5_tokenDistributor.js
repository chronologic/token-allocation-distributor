const TokenDistributor = artifacts.require("./TokenDistributor.sol");
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

module.exports = (deployer) => {
  deployer.deploy(TokenDistributor, NULL_ADDRESS, 0, []);
}