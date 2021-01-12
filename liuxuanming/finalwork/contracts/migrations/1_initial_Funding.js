const Funding = artifacts.require("Funding");

module.exports = function (deployer) {
  deployer.deploy(Funding);
};
