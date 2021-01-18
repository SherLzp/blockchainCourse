const fundManager = artifacts.require("fundManager");

module.exports = function (deployer) {
  deployer.deploy(fundManager);
};
