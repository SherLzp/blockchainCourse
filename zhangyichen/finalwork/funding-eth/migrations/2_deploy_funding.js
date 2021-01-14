const factory = artifacts.require("FundingFactory")
// const funding = artifacts.require("Funding");

module.exports = function (deployer) {
  deployer.deploy(factory);
  // deployer.deploy(funding);
};
