var Funding = artifacts.require("./Funding.sol");

module.exports = function(deployer) {
  deployer.deploy(Funding);
};
