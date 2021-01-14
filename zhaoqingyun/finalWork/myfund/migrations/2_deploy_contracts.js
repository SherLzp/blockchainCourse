var SimpleStorage = artifacts.require("./Funding.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};
