const HasDistributorHandler = artifacts.require("./HasDistributorHandler.sol");
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

module.exports = (deployer) => {
  deployer.deploy(HasDistributorHandler, 1, NULL_ADDRESS, );
}