/* eslint-disable no-undef */
const chouDapp = artifacts.require("chouDapp");

module.exports = function (deployer) {
  deployer.deploy(chouDapp);
};
