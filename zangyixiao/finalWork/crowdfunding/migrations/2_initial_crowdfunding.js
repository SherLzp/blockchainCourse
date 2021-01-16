/* eslint-disable no-undef */
const CrowdFunding = artifacts.require("CrowdFunding");

module.exports = function (deployer) {
  deployer.deploy(CrowdFunding);
};
