const FundingCompany = artifacts.require("FundingCompany");

module.exports = function (deployer) {
  deployer.deploy(FundingCompany);
};
