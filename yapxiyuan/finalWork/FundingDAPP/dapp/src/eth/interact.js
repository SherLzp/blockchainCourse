import { fundingCompanyInstance, newFundingInstance } from './fundingCompanyInstance';
import web3 from '../utils/initWeb3';

let getFundingDetails = async ( index ) => {
    let accounts = await web3.eth.getAccounts()
    let currentFunding = []
    //index == 1 is all web page , can see all funding
    //index == 2 is the current account who launch the funding page
    //index == 3 is the current account who participate in the funding page
    if(index === 1){
        currentFunding = await fundingCompanyInstance.methods.getAllFundings().call({
            from : accounts[0]
        })
    }else if(index === 2){
        currentFunding = await fundingCompanyInstance.methods.getCreatorFundings().call({
            from : accounts[0]
        })
    }else if(index === 3){
        currentFunding = await fundingCompanyInstance.methods.getInvestorFunding().call({
            from : accounts[0]
        })
    }

    let detailsPromises = currentFunding.map(function (fundingAddress){
        console.log(fundingAddress)

        return new Promise(async (resolve, reject) => {
            try{
                let newInstance = newFundingInstance()
                newInstance.options.address = fundingAddress
                //调用
                let manager = await newInstance.methods.manager().call()
                let projectName = await newInstance.methods.projectName().call()
                let investBalance = await newInstance.methods.investBalance().call()
                let targetBalance = await newInstance.methods.targetBalance().call()
                let projectDescrip = await newInstance.methods.projectDescrip().call()
                let deadline = await newInstance.methods.deadline().call()
                let balance = await newInstance.methods.getBalance().call()
                let investorsCount = await newInstance.methods.getInvestorsCount().call()
                let detail = { fundingAddress, manager, projectName, investBalance, targetBalance, projectDescrip,deadline, balance, investorsCount}
                resolve(detail)
            }catch(error){
                reject(error)
            }
        })
    })

    let detailInfo = Promise.all(detailsPromises)
    return detailInfo

} 

let createFunding = (projectName, investMoney, targetMoney, projectDescrip, duration) => {
    return new Promise(async (resolve,reject) => {
        try {
            let accounts = await web3.eth.getAccounts();
            let res = await fundingCompanyInstance.methods.createFunding(projectName, investMoney, targetMoney, projectDescrip,duration).send({
                from:accounts[0],
            })
            resolve(res)

        } catch (error) {
            reject(error)
        }
    })
}

let handleInvestFunc = (fundingAddress, investBalance) => {
    return new Promise(async (resolve,reject) => {
        try {
            //创建合约实例
            let fundingInstance = newFundingInstance()
            //填充地址
            fundingInstance.options.address = fundingAddress
            //获取投资人地址
            let accounts = await web3.eth.getAccounts()

            let res = await fundingInstance.methods.invest().send({
                from:accounts[0],
                value:investBalance,
            })
            resolve(res)
        } catch (error) {
            reject(error)
        }

    })
}

let createRequest = (fundingAddress, purpose, cost, seller) => {
    return new Promise (async (resolve,reject) => {
        try {
            let fundingContract = newFundingInstance()
            fundingContract.options.address = fundingAddress

            let accounts = await web3.eth.getAccounts()
            let result = await fundingContract.methods.createRequest(purpose,cost,seller).send({
                from:accounts[0]

            })
            resolve(result)

        } catch (error) {
            reject(error)
        }

    })
}

let showRequests = (fundingAddress) => {
    return new Promise( async (resolve,reject) => {
        try {
            //获取账户和合约实例
            let accounts = web3.eth.getAccounts()
            let fundingInstance = newFundingInstance()
            fundingInstance.options.address = fundingAddress
            //获取话费请求数量
            let requestsCount = await fundingInstance.methods.getRequestsCount().call({
                from:accounts[0]
            })

            let requestsDetails = []
            //遍历请求数量，依次获取每一个请求的详情，添加到数组中，最后使用promise返回
            for (let i = 0; i < requestsCount; i++) {

                let requestsDetail = await fundingInstance.methods.getRequestDetail(i).call({
                    from:accounts[0]
                })
                requestsDetails.push(requestsDetail)
            }
            resolve(requestsDetails)

        } catch (error) {
            reject(error)
        }

    })

}

let approveRequest = (fundingAddress, index)=>{
    return new Promise(async (resolve,reject) => {
        try {
            let accounts = await web3.eth.getAccounts()
            let fundingInstance = newFundingInstance()
            fundingInstance.options.address = fundingAddress

            let res = await fundingInstance.methods.approveRequest(index).send({
                from:accounts[0]
            })

            resolve(res)
        } catch (error) {
            reject(error)
        }

    })
}

let finalizeRequest = (fundingAddress,index) => {
    return new Promise(async (resolve,reject) => {
        try {
            let accounts = await web3.eth.getAccounts()
            let fundingInstance = newFundingInstance()
            fundingInstance.options.address = fundingAddress

            let res = await fundingInstance.methods.finalizeRequest(index).send({
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
    handleInvestFunc,
    createRequest,
    showRequests,
    approveRequest,
    finalizeRequest,
}