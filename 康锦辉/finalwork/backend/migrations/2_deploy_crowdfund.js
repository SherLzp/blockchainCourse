const MyContract = artifacts.require('Crowdfund');

module.exports = function(deployer) {
  deployer.deploy(MyContract);
};