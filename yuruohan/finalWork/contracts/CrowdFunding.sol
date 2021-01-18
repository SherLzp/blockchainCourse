// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.7.5;

// 众筹合约
contract CrowdFunding {
    // 数据结构：

    // 当前用户
    address public user;

    // 一个众筹项目
    struct Fund {
        uint proID;         // 项目ID
        address initiator;  // 发起人
        string title;       // 项目名
        string description; // 项目描述
        uint goal;          // 众筹目标金额
        uint currentAmount; // 当前金额
        uint totalAmount;   // 总金额
        uint startTime;     // 发起时间
        uint endTime;       // 截止时间
        uint invCount;      // 投资人数
        uint reqCount;      // 请求数
        Investment[10] investments;    // 具体投资数据结构
        Request[10] requests;          // 具体请求数据结构
    }

    // 一笔投资
    struct Investment {
        uint invID;         // 投资号（针对每个项目）
        address investor;   // 投资人
        uint amount;        // 投资数额
        uint time;          // 投资时间
    }

    // 一次请求
    struct Request{
        uint reqID;         // 请求号（针对每个项目）
        string description; // 请求描述
        uint amount;        // 请求数额
        uint supportCount;  // 支持人数
        uint[] supporters;  // 支持人对应的投资号
    }

    uint public fundCount;      // 总众筹项目的数量
    Fund[10] public allfunds;   // 所有众筹项目组成的数组
    mapping(address => uint[][2]) public relations; // 用户address->相关众筹项目、相关投资

    // 新建众筹项目
    function NewProject(string memory title, string memory description, uint goal, uint duration) public {
        require(goal > 0 && duration > 0, "Input Error");
        Fund storage pro = allfunds[fundCount];
        pro.proID = fundCount++;
        pro.initiator = msg.sender;
        pro.title = title;
        pro.description = description;
        pro.goal = goal;
        pro.currentAmount = 0;
        pro.totalAmount = 0;
        pro.startTime = block.timestamp;
        pro.endTime = pro.startTime + duration;
        pro.invCount = 0;
        pro.reqCount = 0;

        // 将项目加入到relation[0]中
        relations[msg.sender][0].push(pro.proID);
    }

    // 新建投资
    function NewInvest(uint proID) public payable{
        require(!ifEnd(proID), "The Fund Has Ended");

        Fund storage pro = allfunds[proID];
        //Check if sender has invested
        bool flag = false;
        uint i;
        for(i = 0; i < pro.invCount; i++){
            if(pro.investments[i].investor == msg.sender){
                flag = true;
                break;
            }
        }

        if(flag){
            //The sender has invested, add to it
            pro.investments[i].amount += msg.value;
            pro.investments[i].time = block.timestamp;
        }
        else{
            //New Investment
            require(pro.invCount < 100);
            Investment storage inv = pro.investments[pro.invCount];
            inv.invID = pro.invCount++;
            inv.investor = msg.sender;
            inv.amount = msg.value;
            inv.time = block.timestamp;

            relations[msg.sender][1].push(proID);
        }

        pro.totalAmount += msg.value;
        pro.currentAmount = pro.totalAmount;
    }

    // 发起请求，只有在成功筹款下才可以
    function NewRequest(uint proID, string memory description, uint amount) public {
        require(ifSuccess(proID) && amount > 0, "Invalid Action");
        Fund storage pro = allfunds[proID];
        require(pro.initiator == msg.sender, "Invalid Account");

        // New Request
        Request storage req = pro.requests[pro.reqCount];
        req.reqID = pro.reqCount++;
        req.description = description;
        req.amount = amount;
        req.supportCount = 0;
        req.supporters = new uint[](0);
    }

   // 投资者支持筹款人请求
    function SupportRequest(uint proID, uint reqID) public {
        Fund storage pro = allfunds[proID];
        bool flag = false;
        uint i;
        for(i = 0; i < pro.invCount; i++){
            if(pro.investments[i].investor == msg.sender){
                flag = true;
                break;
            }
        }
        require(flag, "Unable to Find Your Investment");

        Request storage req = pro.requests[reqID];
        // Check if sender has supported
        flag = true;
        for(uint j = 0; j < req.supportCount; j++){
            if(req.supporters[j] == i){
                flag = false;
                break;
            }
        }
        require(flag, "You have already supported");

        // Support
        req.supporters.push(i);
        req.supportCount++;
    }

    // 获取该用户发起的众筹项目
    function GetMyFunds() public view returns(uint[] memory, uint[] memory){
        return (relations[msg.sender][0], relations[msg.sender][1]);
    }
    
    // 项目是否结束
    function ifEnd(uint proID) public view returns(bool){
        if(ifSuccess(proID)){
            return true;
        }
        return allfunds[proID].endTime < block.timestamp;
    }

    // 项目是否成功
    function ifSuccess(uint proID) public view returns(bool){
        return allfunds[proID].totalAmount >= allfunds[proID].goal;
    }

    // 判断支持是否足够 - 有bug
    function ifSupportEnough(uint proID, uint reqID) public view returns(bool) {
        Fund storage pro = allfunds[proID];
        Request storage req = pro.requests[reqID];
        uint supportAmount = 0;
        for(uint i = 0; i < req.supportCount; i++){
            supportAmount += pro.investments[req.supporters[i]].amount;
        }
        return supportAmount * 2 > pro.totalAmount;
    }

}
