import CrowdFunding from "./contracts/CrowdFunding.json";

async function getCurrentAddress() {
	await window.ethereum.enable();
	//console.log(window.ethereum.selectedAddress, 'current account');
	ethereum.on('accountsChanged', function () {
		window.location.reload();
	});
	return window.ethereum.selectedAddress;
}

let instrance = null;
async function getInstance() {
	if (instrance) return instrance;

	var provider = window.ethereum;
	var contract = require("truffle-contract");

	var CFContract = contract(CrowdFunding);
	CFContract.setProvider(provider);

	instrance = await CFContract.deployed();
	return instrance;
}

export {
	getCurrentAddress,
	getInstance
};