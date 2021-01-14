import web3 from '../utils/initWeb3';
import {
	factoryContractInstance,
	getFundingContractInstance
} from './instance';

let getFundingDetail = async (fundings) => {
    let details = fundings.map(async function(fundingAddress) {
        let fundingContractInstance = getFundingContractInstance()
        fundingContractInstance.options.address = fundingAddress
        
        let manager = await fundingContractInstance.methods.manager().call()
        let projectName = await fundingContractInstance.methods.projectName().call()
        let targetMoney = await fundingContractInstance.methods.targetMoney().call()
        let requireMoney = await fundingContractInstance.methods.requireMoney().call()
        let leftTime = await fundingContractInstance.methods.getLeftTime().call()
        let balance = await fundingContractInstance.methods.getBalance().call()
        let investorCount = await fundingContractInstance.methods.getInvestorCount().call()

        let detail = {
            fundingAddress,
            manager, 
            projectName, 
            targetMoney, 
            requireMoney, 
            leftTime,
            balance,
            investorCount
        }
        return detail
    })

    let detailsPromise = Promise.all(details)
    return detailsPromise
}

let createFunding = (projectName, targetMoney, requireMoney, time) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accounts = await web3.eth.getAccounts()
            let res = await factoryContractInstance.methods.createFunding(projectName, targetMoney, requireMoney, time).send({
                from: accounts[0],
            })
            resolve(res)
        } catch (e) {
            reject(e)
        }
    })
}


let handleInvestFunc = async (fundingAddress, requireMoney) => {
    let fundingContractInstance = getFundingContractInstance()
    fundingContractInstance.options.address = fundingAddress
    let accounts = await web3.eth.getAccounts()
    let res = await fundingContractInstance.methods.invest().send({
        from: accounts[0],
        value: requireMoney,
    })
    return res
}

let createRequest = (fundingAddress, reason, targetMoney, seller) => {
    return new Promise(async (resolve, reject) => {
        try { 
            let accounts = await web3.eth.getAccounts()
            let fundingInstance = getFundingContractInstance()
            fundingInstance.options.address = fundingAddress
            // function createRequest(string _purpose, uint256 _cost, address _seller) onlyManager public {
            let res = await fundingInstance.methods.createRequest(reason, targetMoney, seller).send({
                from: accounts[0],
            })
            resolve(res)
        } catch (e) {
            reject(e)
        }
    })
}


let showRequests = (fundingAddress) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fundingInstance = getFundingContractInstance()
            fundingInstance.options.address = fundingAddress
            let requestCount = await fundingInstance.methods.getRequestCount().call()
            let requestDetails = []
            for (let i = 0; i < requestCount; i++) {
                let requestDetail = await fundingInstance.methods.getRequest(i).call()
                requestDetails.push(requestDetail)
            }
            resolve(requestDetails)
        } catch (e) {
            reject(e)
        }
    })
}


const agreeRequest = (fundingAddress, index) => {
    return new Promise(async(resolve, reject) => {
        try {
            let accounts = await web3.eth.getAccounts()
            let fundingContractInstance = getFundingContractInstance()
            fundingContractInstance.options.address = fundingAddress
            console.log(fundingAddress)
            let res = await fundingContractInstance.methods.agreeRequest(index).send({
                from : accounts[0]
            })
            resolve(res)
            console.log(res)
        } catch (e) {
            reject(e)
        }
    })
}


const finishRequest = (fundingAddress, index) => {
    return new Promise(async(resolve, reject) => {
        try {
            let accounts = await web3.eth.getAccounts()
            let fundingContractInstance = getFundingContractInstance()
            fundingContractInstance.options.address = fundingAddress
            let res = await fundingContractInstance.methods.finishRequest(index).send({
                from : accounts[0]
            })
            resolve(res)
        } catch (e) {
            reject(e)
        }
    })
}

export {
    getFundingDetail,
    createFunding,
    handleInvestFunc,
    createRequest,
    showRequests,
    agreeRequest,
    finishRequest
}