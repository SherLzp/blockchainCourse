var Migrations = artifacts.require("./Migrations.sol");
var Like = artifacts.require("./Like.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Like);
};
