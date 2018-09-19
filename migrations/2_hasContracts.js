const HasContracts = artifacts.require("./HasContracts.sol");

module.exports = (deployer) => {
  deployer.deploy(HasContracts);
}