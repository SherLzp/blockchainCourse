const Migrations = artifacts.require("Migrations");
const ZC = artifacts.require("ZC");
module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(ZC);
};
