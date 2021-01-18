import {fundingFactoryInstance, newFundingInstance} from "./instance";
import web3 from '../utils/InitWeb3'

let getFundingDetails = async (index) => {

    let accounts = await web3.eth.getAccounts()

    let currentFundings = []
    if (index === 1) {
        //所有的
        currentFundings = await fundingFactoryInstance.methods.getAllFundings().call({
            from: accounts[0]
        })
    } else if (index === 2) {
        //我发起
        currentFundings = await fundingFactoryInstance.methods.getCreatorFundings().call({
            from: accounts[0]
        })

    } else if (index === 3) {
        //我参与的
        currentFundings = await fundingFactoryInstance.methods.getSupportorFunding().call({
            from: accounts[0]
        })

    } else {

    }
    console.log(currentFundings);
    let detailsPromises = currentFundings.map(function (fundingAddress) {
        console.log(fundingAddress)
        //1. 把Funding实例拿过来

        return new Promise(async (resolve, reject) => {
            //2. 对实例进行填充地址，可以使用了
            //这个instance是只有一个，后面的地址把前面的地址覆盖了，导致每次只能获取到最后一个合约的详情
            //解决办法：每一个地址来的时候，都创建一个新的合约实例。
            // fundingInstance.options.address = fundingAddress
            try {
                let newInstance = newFundingInstance()
                newInstance.options.address = fundingAddress


                //3. 调用方法，返回funding合约的详情
                let manager = await newInstance.methods.manager().call()
                let projectName = await newInstance.methods.projectName().call()
                let targetMoney = await newInstance.methods.targetMoney().call()
                let supportMoney = await newInstance.methods.supportMoney().call()
                let leftTime = await newInstance.methods.getLeftTime().call()

                let balance = await newInstance.methods.getBalance().call()

                let investorCount = await newInstance.methods.getInvestorsCount().call()


                let detail = {
                    fundingAddress,
                    manager,
                    projectName,
                    targetMoney,
                    supportMoney,
                    leftTime,
                    balance,
                    investorCount
                }

                // console.table(detail)
                // console.log('00000000')

                resolve(detail)
            } catch (e) {
                reject(e)
            }
        })
    })

    // console.log('11111111111')
    // console.log('details:', detailsPromises)

    //把多个promise处理成一个promise
    let detailInfo = Promise.all(detailsPromises)

    return detailInfo
}

let createFunding = (projectName, targetMoney, supportMoney, duration) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accounts = await web3.eth.getAccounts()
            console.log(accounts);
            console.log(projectName);
            console.log(targetMoney);
            console.log(supportMoney);
            console.log(duration);
            console.log(fundingFactoryInstance);
            let res = await fundingFactoryInstance.methods.createFunding(projectName, targetMoney, supportMoney, duration).send({
                    from: accounts[0],
                }
            )
            console.log(res);
            resolve(res)
        } catch (e) {
            reject(e)
        }
    })
}

const createRequest = (fundingAddress, purpose, cost, seller) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accounts = await web3.eth.getAccounts();

            let fundingContract = newFundingInstance();
            fundingContract.options.address = fundingAddress;

            let result = await fundingContract.methods.createRequest(purpose, cost, seller).send({
                from: accounts[0],
            });

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let handleInvestFunc = (fundingAddress, supportMoney) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fundingInstance = newFundingInstance();
            fundingInstance.options.address = fundingAddress

            let accounts = await web3.eth.getAccounts()

            let res = await fundingInstance.methods.invest().send({
                from: accounts[0],
                value: supportMoney,
            })

            resolve(res)
        } catch (e) {
            reject(e)
        }
    })
}

const showRequests = (fundingAddress) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accounts = await web3.eth.getAccounts();
            let fundingContract = newFundingInstance()
            fundingContract.options.address = fundingAddress;

            //获取花费请求的数量
            let requestCount = await fundingContract.methods.getRequestsCount().call({
                from: accounts[0],
            });

            let requestDetails = [];
            //遍历请求数量，依次获取每一个请求的详情，添加到数组中，最后使用promise返回
            for (let i = 0; i < requestCount; i++) {
                let requestDetail = await fundingContract.methods.getRequestByIndex(i).call({
                    from: accounts[0],
                });

                requestDetails.push(requestDetail);
            }
            resolve(requestDetails);
        } catch (e) {
            reject(e);
        }
    })
}


const approveRequest = (fundingAddress, index) => {

    return new Promise(async (resolve, reject) => {
        try {
            const accounts = await web3.eth.getAccounts();
            const contract = newFundingInstance()
            contract.options.address = fundingAddress;

            const result = await contract.methods.approveRequest(index).send({
                from: accounts[0],
            });

            console.log('result :', result);

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
};

const finalizeRequest = (fundingAddress, index) => {

    return new Promise(async (resolve, reject) => {
        try {
            const accounts = await web3.eth.getAccounts();
            const contract = newFundingInstance()
            contract.options.address = fundingAddress;

            const result = await contract.methods.finalizeRequest(index).send({
                from: accounts[0],
            });

            console.log('result :', result);

            resolve(result);
        } catch (e) {
            reject(e);
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