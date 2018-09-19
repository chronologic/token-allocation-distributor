const HasVestingHandler = artifacts.require("./HasVestingHandler.sol");
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

module.exports = (deployer) => {
  deployer.deploy(HasVestingHandler, NULL_ADDRESS);
}
