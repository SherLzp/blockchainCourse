const Crowdfund = artifacts.require("Crowd_fund");

module.exports = function (deployer) {
  deployer.deploy(Crowdfund);
};
