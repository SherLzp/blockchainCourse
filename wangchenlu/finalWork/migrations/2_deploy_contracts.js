var Crowdfunding = artifacts.require("./Crowdfunding.sol");

module.exports = function(deployer) {
  deployer.deploy(Crowdfunding);
};
