var path = require('path');
var fs = require('fs');
var web3 = require('./connector');
var factoryABI = fs.readFileSync(path.join(__dirname, '../Solidity/build/contracts/FundingFactory.json')).toString();
var FactoryContract = web3.eth.contract(JSON.parse(factoryABI).abi);
var fundingABI = fs.readFileSync(path.join(__dirname,'../Solidity/build/contracts/Funding.json')).toString();
var fundingContract = web3.eth.contract(JSON.parse(fundingABI).abi);
const contractAddr = 'ac815f28575c518A88816f46A23839A940d10e14';
var myContractInstance = FactoryContract.at(contractAddr);
web3.eth.defaultAccount = web3.eth.coinbase;


module.exports = {
    //获取所有账号
    async get_accounts() {
        return web3.eth.accounts;
    },
    async get_cur_account(user){
        return user;
    },
    //创建众筹
    async create_funding(funding,creator) {
        let { name, target, duration } = funding;
        target = web3.toWei(target, 'ether');
        let estimate = myContractInstance.createFunding.estimateGas(name, target, duration,creator, {});
        await myContractInstance.createFunding(name, target, duration,creator, { gas: estimate });
    },
    //将众筹地址转换为具体数据
    async transfer_funding(addr) {
        var fundingInstance = await fundingContract.at(addr);
        let investors = [];
        let support = [];
        let count = fundingInstance.investorCount().toNumber();
        for (let i = 0; i < count; i++){
            investors.push(fundingInstance.investors(i));
            support.push(web3.fromWei(fundingInstance.support(i),'ether').toNumber());
        }
        let present = parseInt(web3.fromWei(fundingInstance.present().toNumber(),'ether'));
        let target = parseInt(web3.fromWei(fundingInstance.target().toNumber(),'ether'));
        let endTime = new Date(fundingInstance.endTime().toNumber() * 1000);
        let now = Date.now();
        let status;
        let balance = parseInt(web3.fromWei(fundingInstance.getBalance(),'ether'));
        if (present >= target) {
            status = 1;
        }
        else if(now < endTime) {
            status = 0;
        }
        else {
            status = -1;
        }
        return {
            address: addr,
            name: fundingInstance.name(),
            creator: fundingInstance.creator(),
            present: present,
            target: target,
            //Date以毫秒计算，endtime以秒计算
            endTime: endTime.toLocaleString(),
            investors: investors,
            support: support,
            investorCount: count,
            status: status,
            balance:balance
        }
    },
    //获取部分数据
    async transfer_funding_part(addr) {
        var fundingInstance = await fundingContract.at(addr);
        let present = parseInt(web3.fromWei(fundingInstance.present().toNumber(),'ether'));
        let target = parseInt(web3.fromWei(fundingInstance.target().toNumber(),'ether'));
        let endTime = new Date(fundingInstance.endTime().toNumber() * 1000);
        let now = Date.now();
        let status;
        if (present >= target) {
            status = 1;
        }
        else if(now < endTime) {
            status = 0;
        }
        else {
            status = -1;
        }
        return {
            address: addr,
            name: fundingInstance.name(),
            present: present,
            target: target,
            endTime: endTime.toLocaleString(),
            status: status,
        }
    },
    //查看所有众筹
    async check_all_funding() {
        let fundings = await myContractInstance.getAllFundings();
        let result = [];
        await fundings.forEach(async element => {
            const res = await this.transfer_funding_part(element);
            result.push(res);
        });
        return result;
    },
    //查看某个众筹项目的所有需求
    async check_request(funding_addr) {
        let fundingInstance = await fundingContract.at(funding_addr);
        let requests = [];
        let length = fundingInstance.requestNum().toNumber();
        for (let i = 0; i < length; i++){
            let temp = await fundingInstance.Requests(i);
            temp[2] = parseInt(web3.fromWei(temp[2],'ether'));   //struct Request{
            temp[3] = parseInt(temp[3]);   //    string purpose;
            temp[4] = parseInt(temp[4]);   //    address seller;
            let request = {                 
                purpose: temp[0],           //    uint cost;
                seller: temp[1],            //    uint approvedCount;
                cost:temp[2],               //    uint status;   //0-投票中，1-已经取得大多数同意，2-已完成
                status:temp[4],
                count: temp[3]
            }                               //    mapping(address => bool) isVoted;
            requests.push(request);         //}
        }
        return requests;
    },
    //查看自己创建的众筹
    async check_created_funding(user) {
        let fundings = await myContractInstance.getAllFundings();
        let result = [];
        await fundings.forEach(async element => {
            const res = await this.transfer_funding(element);
            if(res.creator == user)
                result.push(res);
        });
        return result;
    },
    //查看自己参加的众筹
    async check_attended_funding(user){
        let fundings = await myContractInstance.getAllFundings();
        let result = [];
        await fundings.forEach(async element => {
            const res = await this.transfer_funding(element);
            for (let i = 0; i < res.investorCount; i++) {
                if (res.investors[i] == user) {
                    result.push(res);
                    break;
                }
            }
        });
        return result;
    },
    //判断是否已参与或创建某众筹
    async check_if_attended(user, addr) {
        let funding = await this.transfer_funding(addr);
        if (funding.creator == user)
            return 1;
        else {
            for (let i = 0; i < funding.investorCount; i++){
                if (user == funding.investors[i]) {
                    return 2;
                }
            }
        }
        return 0;
    },
    //参与众筹
    async attend_funding(user, money, funding_addr) {
        var fundingInstance = await fundingContract.at(funding_addr);
        let estimate = fundingInstance.invest.estimateGas(money, user, {});
        await fundingInstance.invest(money, user, { gas: estimate,value:money,from:user });
    },
    //退款给所有人
    async refund(user, funding_addr) {
        funding_addr = funding_addr.substr(2);
        console.log(funding_addr)
        //退款
        let fundingInstance = await fundingContract.at(funding_addr);
        let estimate = fundingInstance.refund_for_all.estimateGas({ from: user });
        await fundingInstance.refund_for_all({ gas: estimate, from: user });
        //删除合约
        await myContractInstance.deleteFunding(funding_addr,{  from: user })
    },
    //创建一个需求
    async create_request(user, request, funding_addr) {
        let { purpose, seller, cost } = request;
        cost = web3.toWei(cost, 'ether');
        let fundingInstance = await fundingContract.at(funding_addr);
        let estimate = fundingInstance.createRequest.estimateGas(purpose, seller, cost, { from: user });
        await fundingInstance.createRequest(purpose, seller, cost, { from: user, gas: estimate });
    },
    //判断一个需求是否可以被执行
    async check_request_status(request_index, funding_addr) {
        let fundingInstance = await fundingContract.at(funding_addr);
        let request = await fundingInstance.Requests(request_index);
        let status = request[4];
        return status == 1;
    },
    //同意一个需求
    async approve_request(user, request_index, funding_addr) {
        let fundingInstance = await fundingContract.at(funding_addr);
        let estimate = fundingInstance.approveRequest.estimateGas(request_index, { from: user });
        await fundingInstance.approveRequest(request_index, { from: user, gas: estimate });
        if (this.check_request_status(request_index, funding_addr)) {
            this.execute_request(user, request_index, funding_addr);
        }
    },
    //拒绝一个需求
    async deny_request(user, request_index, funding_addr) {
        let fundingInstance = await fundingContract.at(funding_addr);
        let estimate = fundingInstance.denyRequest.estimateGas(request_index, { from: user });
        await fundingInstance.denyRequest(request_index, { from: user, gas: estimate });
    },
    //完成一个需求
    async execute_request(user, request_index, funding_addr) {
        let fundingInstance = await fundingContract.at(funding_addr);
        let estimate = fundingInstance.finishRequest.estimateGas(request_index, { from: user });
        await fundingInstance.finishRequest(request_index, { from: user, gas: estimate });
    }
};
