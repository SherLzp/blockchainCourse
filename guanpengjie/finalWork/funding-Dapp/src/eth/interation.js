import { fundingFactoryInstance, newFundingInstance } from './fundingFactoryInstance'
import web3 from "../utils/initWeb3";


let getFundingDetails = async (index) => {
    //index=1，所有的页面；index=2，我发起的页面；index=3，我参与的页面
    //整个显示详情的逻辑是可以复用的，唯一的不同就是返回的众筹数组不同
    //所以可以使用if语句进行控制，从而复用代码
    let accounts = await web3.eth.getAccounts();
    let currentFunding = []
    if (index === 1) {
        currentFunding = await fundingFactoryInstance.methods.getAllFundings().call({
            from: accounts[0]
        })
    } else if (index === 2) {
        //我发起的
        currentFunding = await fundingFactoryInstance.methods.getCreatorFundings().call({
            from: accounts[0]
        })
    } else if (index === 3) {
        currentFunding = await fundingFactoryInstance.methods.getSupportorFunding().call({
            from: accounts[0]
        })
    }


    let detailsPromises = currentFunding.map(function (fundingAddress) {
        console.log(fundingAddress)
        //1.拿到合约实例

        return new Promise(async (resolve, reject) => {
            try {
                //2.对实例进行填充，可以使用了
                let newInstance = newFundingInstance()
                newInstance.options.address = fundingAddress
                //3.调用方法，返回合约详情
                let manager = await newInstance.methods.manager().call()
                let projectName = await newInstance.methods.projectName().call()
                let supportBalance = await newInstance.methods.supportBalance().call()
                let targetBalance = await newInstance.methods.targetBalance().call()
                let endTime = await newInstance.methods.endTime().call()
                let balance = await newInstance.methods.getBalance().call()
                let investorsCount = await newInstance.methods.getInvestorsCount().call()

                let detail = { fundingAddress, manager, projectName, supportBalance, targetBalance, endTime, balance, investorsCount }
                resolve(detail)
            } catch (error) {
                reject(error)
            }

        })
    })

    let detailInfo = Promise.all(detailsPromises)

    return detailInfo

}

let createFunding = (projectName, supportMoney, targetMoney, duration) => {
    return new Promise(async (resolve,reject) => {
        try {
            let accounts = await web3.eth.getAccounts();
            let res = await fundingFactoryInstance.methods.createFunding(projectName, supportMoney, targetMoney, duration).send({
                from:accounts[0],
            })
            resolve(res)

        } catch (error) {
            reject(error)
        }
    })


}

let handleInvestFunc = (fundingAddress,supportBalance) => {

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
                value:supportBalance,
            })
            resolve(res)
        } catch (error) {
            reject(error)
        }

    })

}

let createRequest = (fundingAddress,purpose,cost,seller) => {
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

            let requestsDeatils = []
            //遍历请求数量，依次获取每一个请求的详情，添加到数组中，最后使用promise返回
            for (let i = 0; i < requestsCount; i++) {

                let requestsDeatil = await fundingInstance.methods.getRequestDetailByIndex(i).call({
                    from:accounts[0]
                })
                requestsDeatils.push(requestsDeatil)
            }
            resolve(requestsDeatils)

        } catch (error) {
            reject(error)
        }

    })

}

let approveRequest = (fundingAddress,index) => {
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