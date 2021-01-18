// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Crowdfunding {
    uint public totalFunding = 0;
    mapping(uint => Funding) public allFundings; // 所有的众筹项目
    
    // 众筹项目结构
    struct Funding{
        address payable sponsor;  // 发起人
        string title;    // 标题
        string detail;   // 项目描述
        uint targetMoney;// 目标金额
        uint tempMoney;  // 当前可用金额
        uint totalMoney; // 最终总金额
        uint endTime;    // 结束时间
        uint totalInvestors; // 参与众筹人数
        uint totalRequests;  // 发起请求数
        bool isSuccess;  // 是否成功 
        
        mapping(uint => address payable) investors;  // 投资者地址
        mapping(address => uint) investments; // 投资人地址与投资金额映射
        mapping(uint => Request) requests;
    }

    // 花费请求结构
    struct Request {
        string purpose;  // 请求内容
        uint cost;      // 申请金额
        uint agreeMoney; // 赞同金额
        uint disagreeMoney; // 反对金额
        uint status; //这个申请的当前状态：投票中/已批准/不批准/已执行：0,1,2,3
        uint votes;  // 投票人数
        mapping(address => uint) investorVoted; //投资人投票情况，0: 还没决定，1：同意，2：不同意
    }

    // 发起新众筹项目
    function newFunding(string memory _title, string memory _detail, uint _targetMoney, uint _endTime)public returns(uint){
        // 结束时间晚于当前时间
        require(_endTime > block.timestamp);
        
        Funding memory f = Funding(msg.sender, _title, _detail, _targetMoney, 0, 0, _endTime, 0, 0, false);
        allFundings[totalFunding] = f;
        totalFunding++;

        return totalFunding;
    }
    
    // 投资一个项目
    function invest(uint index) payable public {
        // 贡献的钱必须大于0
        require(msg.value > 0);
        // 未结束的众筹
        require(allFundings[index].endTime > block.timestamp);

        Funding storage f = allFundings[index];
        f.tempMoney += msg.value;
        
        if(f.investments[msg.sender] == 0){
            f.investors[f.totalInvestors] = msg.sender;
            f.totalInvestors++;
        }

        f.investments[msg.sender] += msg.value;
        
        // 众筹成功，更新最终筹集到的金额
        if(f.tempMoney >= f.targetMoney){
            f.isSuccess = true;
            f.totalMoney = f.tempMoney;
        }
    }

    // 众筹失败，退款
    function refund(uint index) public{
        // 未完成的众筹
        require(allFundings[index].isSuccess == false);

        Funding storage f = allFundings[index];
        for(uint i=0; i < f.totalInvestors; i++){
            f.investors[i].transfer(f.investments[f.investors[i]]);  // 给每个账户退款
        }
    }

    // 发起新请求
    function newRequest(uint index, string memory _purpose, uint _cost) public{
        require(allFundings[index].isSuccess == true);
        // 花费不能超过剩余金额
        require(_cost <= allFundings[index].tempMoney);
        // 众筹发起人
        require(msg.sender == allFundings[index].sponsor);

        Request memory req = Request (_purpose,_cost,0,0,0,0);
        Funding storage f = allFundings[index];
        f.requests[f.totalRequests] = req;
        f.totalRequests++;
    }

    // 批准申请
    function approveRequest(uint index, uint requestID, bool agree) public {
        Funding storage f = allFundings[index];
        require(f.investments[msg.sender] != 0);  // 投资过的人
        Request storage req = f.requests[requestID];
        require(req.investorVoted[msg.sender] == 0); // 没有投过票的人
        require(req.status == 0); // 请求处于投票中的状态

        if(agree){
            req.agreeMoney += f.investments[msg.sender];
            req.investorVoted[msg.sender] = 1;
        }
        else{
            req.disagreeMoney += f.investments[msg.sender];
            req.investorVoted[msg.sender] = 2;
        }

        req.votes ++;

        // 支持率达到50%
        if(req.agreeMoney*2 >= f.totalMoney){
            req.status = 1;
        }
        // 反对率达到50%
        else if (req.disagreeMoney*2 >= f.totalMoney){
            req.status = 2;
        }
    }

    // 当项目被批准，发起人可以选择执行请求
    function finishRequest(uint index, uint requestID) public{
        Funding storage f = allFundings[index];
        Request storage req = f.requests[requestID];
        // 余额充足
        require(req.cost <= allFundings[index].tempMoney);
        require(req.status == 1);

        f.sponsor.transfer(req.cost);  // 将钱转给发起人
        req.status = 3;  // 请求已执行
        f.tempMoney -= req.cost; // 结算余额
    }

    // 请求总数
    function getRequestsCount(uint index) public view returns (uint) {
        Funding storage f = allFundings[index];
        return f.totalRequests;
    }

    // 获取请求详细信息
    function getRequest(uint index, uint requestID, address addr)public view returns(string memory,uint,uint,uint,uint,uint,uint) {
        Funding storage f = allFundings[index];
        Request storage req = f.requests[requestID];

        uint isVoted = req.investorVoted[addr];
        return (req.purpose, req.cost, isVoted, req.agreeMoney, req.disagreeMoney, req.status,req.votes);
    }
    
    // 是否是投资的项目
    function isInvested(uint index, address payable addr) public view returns(bool){
        Funding storage f = allFundings[index];
        
        for(uint i=0; i<f.totalInvestors; i++){
            if(addr == f.investors[i]){
                return true;
            } 
        }
        return false;
    }
}