import Web3 from "web3"
// import { address, ABI } from "./constants/crowdfundingContract"
import CrowdFunding from "./constants/Crowdfunding.json";

// let getContract = function () {
//     let web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')
//     let web3 = new Web3(web3Provider)
//     let crowdfundingContract = web3.eth.contract(ABI)
//     let crowdfundingContractInstance = crowdfundingContract.at(address)
//     return crowdfundingContractInstance
// }

// export default getContract

// async function getInstance() {
//     if(instance !== null) {
//         return instance
//     }

//     var provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')
//     var contract = require("truffle-contract")
//     var curContract = contract(Crowdfunding)
//     curContract.setProvider(provider)
//     instance = await curContract.deployed()
// }
let instance = null;
async function getContract() {
	if (instance) return instance

	var provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')
	var contract = require("truffle-contract")

	var CFContract = contract(CrowdFunding)
	CFContract.setProvider(provider)

	instance = await CFContract.deployed()
	return instance;
}

export default getContract