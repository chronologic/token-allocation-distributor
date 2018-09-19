const VestingHandler = artifacts.require("./VestingHandler.sol");
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

module.exports = (deployer) => {
  deployer.deploy(VestingHandler, 1, NULL_ADDRESS, NULL_ADDRESS);
}