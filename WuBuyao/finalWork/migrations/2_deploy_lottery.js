const crowdfunding = artifacts.require("crowdfunding");

module.exports = function (deployer) {
    deployer.deploy(crowdfunding);
}