const fundingFactory = artifacts.require("FundingFactory");
module.exports = function (deployer) {
    deployer.deploy(fundingFactory);
};