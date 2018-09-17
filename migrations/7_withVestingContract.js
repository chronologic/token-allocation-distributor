const WithVestingContract = artifacts.require("./WithVestingContract.sol");
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

module.exports = (deployer) => {
  deployer.deploy(WithVestingContract, NULL_ADDRESS, 0, [], [], 1, NULL_ADDRESS);
}