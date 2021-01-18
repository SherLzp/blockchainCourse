//const CrowdfundingFactory = artifacts.require('CrowdfundingFactory')
var Crowdfunding = artifacts.require("./Crowdfunding.sol");
module.exports = function (deployer) {
    deployer.deploy(Crowdfunding);
};