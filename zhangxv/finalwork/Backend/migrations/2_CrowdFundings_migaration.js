const CrowdFundings = artifacts.require("CrowdFundings");

module.exports = function (deployer) {
  deployer.deploy(CrowdFundings);
};