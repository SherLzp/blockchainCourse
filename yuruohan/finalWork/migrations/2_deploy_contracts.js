// const Funding = artifacts.require("./Funding.sol");
var CrowdFunding = artifacts.require("CrowdFunding");

module.exports = function (deployer) {
	deployer.deploy(CrowdFunding);
};
