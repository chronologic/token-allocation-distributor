const TokenHandler = artifacts.require("./TokenHandler.sol");
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

module.exports = (deployer) => {
  deployer.deploy(TokenHandler, NULL_ADDRESS);
}