//导入web3实例
import web3 from "../utils/initWeb3"
import data from "../contracts/Crowdfunding.json"

let abi = data.abi
let address = '0xDfEB44E7ea13094b7883f7b23A3f9c3Eaf034458'
let contract = new web3.eth.Contract(abi,address)

let getAllFunding = async () => {
    let currentFunding = []
    let total = await contract.methods.totalFunding().call();

    for(let i=0; i<total; i++){
        currentFunding.push(await getOneFunding(i));
    }
    return currentFunding;
}
 
let getOneFunding= async (index) =>{
    const data = await contract.methods.allFundings(index).call();
    data.targetMoney = web3.utils.fromWei(data.targetMoney, 'ether')
    data.tempMoney = web3.utils.fromWei(data.tempMoney, 'ether')
    data.totalMoney = web3.utils.fromWei(data.totalMoney, 'ether')
    var nowTime = Math.round(new Date() / 1000);
    data.showButton = true
    if(nowTime >= data.endTime){
        data.tags = ["end"]
        data.showButton = false
    }
    else{
        data.tags = ["ongoing"]
    }

    if(data.totalMoney - data.targetMoney >= 0) {
        data.tags.push("success")
    }

    data.endTime = timestampToTime(data.endTime)
    return {index, ...data}
}

let getMyFunding = async() => {
    let currentFunding = []    
    let total = await contract.methods.totalFunding().call();

    for(let i=0; i<total; i++){
        let res = await getOneMyFunding(i);
        if(res){
            currentFunding.push(res);
        }
    }

    return currentFunding;
}

let getOneMyFunding = async(index) => {
    let account = (await web3.eth.getAccounts())[0];
    const data = await contract.methods.allFundings(index).call();
    if(account === data.sponsor){
        const data = await contract.methods.allFundings(index).call();
        data.targetMoney = web3.utils.fromWei(data.targetMoney, 'ether')
        data.tempMoney = web3.utils.fromWei(data.tempMoney, 'ether')
        data.totalMoney = web3.utils.fromWei(data.totalMoney, 'ether')
        var nowTime = Math.round(new Date() / 1000);
        data.newRequest = true;
        data.refund = true;
        if(nowTime >= data.endTime && data.totalMoney >= data.targetMoney){
            data.status = "众筹结束"
            data.newRequest = false;
        }
        else if (nowTime >= data.endTime && data.totalMoney < data.targetMoney){
            data.status = "众筹失败"
            data.refund = false;
        }else{
            data.status = "众筹中"
        }

        data.endTime = timestampToTime(data.endTime)
        data.index = index
        data.requests = await getRequests(index)
    
        return {index, ...data}
    }
    else return null
}

let createFunding = async (title, detail, targetMoney, endTime) =>{
    let account = (await web3.eth.getAccounts())[0];
    return await contract.methods.newFunding(title, detail, web3.utils.toWei(targetMoney.toString(10), 'ether'), endTime).send({
        from: account,
        gas: 1000000
    });       
}

let investFunding = async (index, money) =>{
    let account = (await web3.eth.getAccounts())[0];
    return await contract.methods.invest(index).send({
        from: account,
        value: web3.utils.toWei(money.toString(10), 'ether')
    });       
}

//将时间戳转换成正常时间格式
function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
}

let createRequest = async (index, purpose, cost) => {
    let account = (await web3.eth.getAccounts())[0];
    return await contract.methods.newRequest(index, purpose, web3.utils.toWei(cost.toString(10), 'ether')).send({
        from: account,
        gas: 1000000
    });
}

let getRequests = async (fundingID) => {
    const total = await contract.methods.getRequestsCount(fundingID).call();
    let currentRequest = []
    let account = (await web3.eth.getAccounts())[0];

    for(let i=0; i<total; i++){
        let res = await getOneRequest(fundingID, i, account)
        if(res){
            currentRequest.push(res);
        }
    }
    console.log(currentRequest)
    return currentRequest
}

let getOneRequest = async (fID, rID, account) => {
    var status = ["投票中" ,"已批准" , "不批准", "已执行"]
    var voteStatus = ["未投票", "同意", "不同意"]
    
    const res = await contract.methods.getRequest(fID, rID, account).call();
    res.purpose = res[0]
    res.cost = web3.utils.fromWei(res[1], 'ether')
    res.isVoted = voteStatus[res[2]]
    res.agree = web3.utils.fromWei(res[3], 'ether')
    res.disagree = web3.utils.fromWei(res[4], 'ether')
    res.status = res[5]
    res.tag = status[res[5]]
    res.votes = res[6]
    res.showButton = true;
    if( res[5] === 0){
        res.showButton = false;
    }
    res.excute = true;
    if(res[5] === 1){
        res.excute = false;
    }

    return {rID, ...res}
}

let getMyInvest = async () => {
    let currentFunding = []
    let total = await contract.methods.totalFunding().call();

    for(let i=0; i<total; i++){
        let res = await getOneMyInvest(i);
        if(res){
            currentFunding.push(res);
        }
    }

    return currentFunding;
}

let getOneMyInvest = async (index) => {
    let account = (await web3.eth.getAccounts())[0];
    let isInvested = await contract.methods.isInvested(index, account).call();   // 是否投资
    console.log(account)
    console.log(isInvested)
    
    if(isInvested){
        const data = await contract.methods.allFundings(index).call();
        data.targetMoney = web3.utils.fromWei(data.targetMoney, 'ether')
        data.tempMoney = web3.utils.fromWei(data.tempMoney, 'ether')
        data.totalMoney = web3.utils.fromWei(data.totalMoney, 'ether')
        
        data.index = index
        var nowTime = Math.round(new Date() / 1000);
        if(nowTime >= data.endTime && data.totalMoney >= data.targetMoney){
            data.status = "众筹结束"
        }
        else if (nowTime >= data.endTime && data.totalMoney < data.targetMoney){
            data.status = "众筹失败"
        }else{
            data.status = "众筹中"
        }

        data.endTime = timestampToTime(data.endTime)
        data.requests = await getRequests(index)
    
        return {index, ...data}
    }
    else return null
}

let voteRequest = async (fID, rID, agree) => {
    let account = (await web3.eth.getAccounts())[0];
    await contract.methods.approveRequest(fID, rID, agree).send({
        from: account,
        gas: 1000000
    });
}

let refund = async (index) => {
    let account = (await web3.eth.getAccounts())[0];
    await contract.methods.refund(index).send({
        from: account,
        gas: 1000000
    });
}

let finishRequest = async(fID, rID) => {
    let account = (await web3.eth.getAccounts())[0];
    await contract.methods.finishRequest(fID, rID).send({
        from: account,
        gas: 1000000
    });
}

export {
    getAllFunding,
    createFunding,
    investFunding,
    getMyFunding,
    createRequest,
    getRequests,
    getMyInvest,
    voteRequest,
    refund,
    finishRequest
}