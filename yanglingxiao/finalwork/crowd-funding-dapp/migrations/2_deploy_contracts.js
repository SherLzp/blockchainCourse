var Adoption = artifacts.require("Adoption");
var Like = artifacts.require("Like");

module.exports = function(deployer) {
  deployer.deploy(Adoption);
  deployer.deploy(Like);
};