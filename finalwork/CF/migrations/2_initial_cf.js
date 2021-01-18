const cf  = artifacts.require("cf");

module.exports = function (deployer) {
  deployer.deploy(cf);
};
