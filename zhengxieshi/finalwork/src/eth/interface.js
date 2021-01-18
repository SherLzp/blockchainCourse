import { fundingFactoryInstance, newFundingInstance } from './fundingInstance'
import web3 from "@/utils/InitWeb3";

let getFundingDetails = async (index) => {
    let accounts = await web3.eth.getAccounts();
    let currentFunding = []
    if (index === 1) {
        currentFunding = await fundingFactoryInstance.methods.getAllFundings().call({
            from: accounts[0]
        })
    } else if (index === 2) {
        currentFunding = await fundingFactoryInstance.methods.getCreatorFundings().call({
            from: accounts[0]
        })
    } else if (index === 3) {
        currentFunding = await fundingFactoryInstance.methods.getSupportorFunding().call({
            from: accounts[0]
        })
    }

    let detailsPromises = currentFunding.map(function (fundingAddress) {
        return new Promise(async (resolve, reject) => {
            try {
                let newInstance = newFundingInstance()
                newInstance.options.address = fundingAddress

                let manager = await newInstance.methods.manager().call()
                let projectName = await newInstance.methods.projectName().call()
                let projectDetail = await newInstance.methods.projectDetail().call()
                let targetBalance = await newInstance.methods.targetBalance().call()
                let startTime = await newInstance.methods.startTime().call()
                let endTime = await newInstance.methods.endTime().call()
                let balance = await newInstance.methods.getBalance().call()
                let investorsCount = await newInstance.methods.getInvestorsCount().call()
                let requestBalance = await newInstance.methods.requestBalance().call()
                let isDiscarded = await newInstance.methods.isDiscarded().call()
                let isAchieved = await newInstance.methods.isAchieved().call()

                let detail = { fundingAddress, manager, projectName, projectDetail,targetBalance,
                    startTime, endTime, balance, investorsCount, requestBalance, isDiscarded,
                    isAchieved}
                resolve(detail)
            } catch (error) {
                reject(error)
            }
        })
    })

    let fundDetailPromise = Promise.all(detailsPromises)

    return fundDetailPromise
}

let createFunding = (projectName, projectDetail, targetMoney, startTime, endTime) => {
    return new Promise(async (resolve,reject) => {
        try {
            let accounts = await web3.eth.getAccounts();
            let res = await fundingFactoryInstance.methods.createFunding(projectName,
                projectDetail, targetMoney, startTime, endTime).send({
                from:accounts[0],
            })
            resolve(res)

        } catch (error) {
            reject(error)
        }
    })
}

let investFunding = (fundingAddress,supportBalance) => {

    return new Promise(async (resolve,reject) => {
        try {
            let fundingInstance = newFundingInstance()
            fundingInstance.options.address = fundingAddress
            let accounts = await web3.eth.getAccounts()

            let res = await fundingInstance.methods.invest().send({
                from:accounts[0],
                value:supportBalance,
            })
            resolve(res)
        } catch (error) {
            reject(error)
        }
    })
}

let createRequest = (fundingAddress,purpose,cost) => {
    return new Promise (async (resolve,reject) => {
        try {
            let fundingContract = newFundingInstance()
            fundingContract.options.address = fundingAddress
            let accounts = await web3.eth.getAccounts()

            let result = await fundingContract.methods.createRequest(purpose,cost).send({
                from:accounts[0]

            })
            resolve(result)

        } catch (error) {
            reject(error)
        }

    })
}


let getRequests = (fundingAddress) => {
    return new Promise( async (resolve,reject) => {
        try {
            let accounts = await web3.eth.getAccounts()
            let fundingInstance = newFundingInstance()
            fundingInstance.options.address = fundingAddress
            //获取请求数量
            let requestsCount = await fundingInstance.methods.getRequestsCount().call({
                from:accounts[0]
            })
            let requestsDetails = []
            for (let i = 0; i < requestsCount; i++) {

                let requestsDetail = await fundingInstance.methods.getRequestDetailByIndex(i).call({
                    from:accounts[0]
                })
                console.log(requestsDetail)
                requestsDetails.push(requestsDetail)
            }
            resolve(requestsDetails)

        } catch (error) {
            reject(error)
        }
    })
}

const isManager = (fundingAddress) => {
    return new Promise(async (resolve,reject) => {
        try {
            let accounts = await web3.eth.getAccounts()
            let fundingInstance = newFundingInstance()
            fundingInstance.options.address = fundingAddress

            let flag = await fundingInstance.methods.isManager().call({
                from: accounts[0]
            })
            resolve(flag)
        } catch (error) {
            reject(error)
        }
    })
}

const isInvestor = (fundingAddress) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accounts = await web3.eth.getAccounts()
            let fundingInstance = newFundingInstance()
            fundingInstance.options.address = fundingAddress

            let flag = await fundingInstance.methods.isInvestor().call({
                from: accounts[0]
            })
            resolve(flag)
        } catch (error) {
            reject(error)
        }
    })
}

const getInvestment_web3 = (fundingAddress) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accounts = await web3.eth.getAccounts()
            let fundingInstance = newFundingInstance()
            fundingInstance.options.address = fundingAddress

            let result = await fundingInstance.methods.getInvestment().call({
                from: accounts[0]
            })
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

const drawback_web3 = (fundingAddress) => {
    return new Promise(async (resolve,reject) => {
        try {
            let fundingInstance = newFundingInstance()
            fundingInstance.options.address = fundingAddress
            let accounts = await web3.eth.getAccounts()

            let res = await fundingInstance.methods.drawback().send({
                from:accounts[0],
            })
            resolve(res)
        } catch (error) {
            reject(error)
        }
    })
}

const voteRequest_web3 = (fundingAddress, index, isApproved) => {
    return new Promise(async (resolve,reject) => {
        try {
            let fundingInstance = newFundingInstance()
            fundingInstance.options.address = fundingAddress
            let accounts = await web3.eth.getAccounts()

            let res = await fundingInstance.methods.voteRequest(index, isApproved).send({
                from:accounts[0],
            })
            resolve(res)
        } catch (error) {
            reject(error)
        }
    })
}

const executeRequest_web3 = (fundingAddress,index) => {
    return new Promise(async (resolve,reject) => {
        try {
            let accounts = await web3.eth.getAccounts()
            let fundingInstance = newFundingInstance()
            fundingInstance.options.address = fundingAddress

            let res = await fundingInstance.methods.executeRequest(index).send({
                from:accounts[0]
            })

            resolve(res)
        } catch (error) {
            reject(error)
        }
    })
}

export {
    getFundingDetails,
    createFunding,
    investFunding,
    createRequest,
    getRequests,
    isManager,
    isInvestor,
    getInvestment_web3,
    drawback_web3,
    voteRequest_web3,
    executeRequest_web3,
}