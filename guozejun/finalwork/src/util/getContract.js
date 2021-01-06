import CrowdFunding from "./constants/Crowdfunding.json"
import Web3 from "web3"

let instance = null;
var address
// 获取并部署众筹智能合约
async function getContract(param) {
	if (instance) return instance

	var provider
	if(window.ethereum) {
		// 获取 provider
		provider = window.ethereum
		try {
			await window.ethereum.enable()
		} catch (error) {
			console.error("User denied account access")
		}
		var web3 = new Web3(provider)
		// 当前授权账号的address
		await web3.eth.getAccounts(function (error, result) {
			if (!error) {
				address = result
			}
		})
		// 获取 contract
		var contract = new web3.eth.Contract(CrowdFunding["abi"])
		console.log(web3)
		// 部署 contract
		var crowdfunding = contract.deploy({
			data: CrowdFunding["bytecode"],
			arguments: param
		})
		.send({
			from: address[0], 
			gas: '4700000'
		}, function (e, contract){
			console.log(e, contract)
		})
		return crowdfunding
	}
	else {
		alert("ERROR! metamask not installed!")
	}
}

export default getContract