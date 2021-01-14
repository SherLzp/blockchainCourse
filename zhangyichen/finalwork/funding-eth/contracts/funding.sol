// SPDX-License-Identifier: GPL3.0
pragma solidity ^0.4.25;

contract Funding{

    address public manager;         // 发起人
    string public projectName;      // 项目名
    uint256 public targetMoney;     // 目标金额
    uint256 public requireMoney;    // 参与需要金额
    uint256 public endTime;         // 结束时间
    address[] investors;            // 投资人集合
    // 投资人合集
    mapping(address=>bool) isInvestor;

    enum requestStatus {
        voting, approved, completed
    }

    // 款项申请
    struct Request {
        
        string purpose;         // 花费途径
        uint256 cost;           // 金额
        address seller;         // 转账地址
        uint256 agreeNum;       // 赞成的人数
        requestStatus status;   // 申请状态
        // 投资人投票状态
        mapping(address=>bool) isVoted;
    }

    Request[] request;

    modifier onlyManager {
        require(msg.sender == manager);
        _;
    }

    InvolveFunding involveFunding;

    constructor(string projName, uint256 targMoney, uint256 reqMoney, uint256 time, address creator, InvolveFunding invoFunding) public {
        manager = creator;
        projectName = projName;
        targetMoney = targMoney * 10**18;
        requireMoney = reqMoney * 10**18;
        endTime = now + time;
        involveFunding = invoFunding;
    }

    // 获取所有参与者
    function getInvestors() public view returns(address[]) {
        return investors;
    }

    // 获取当前金额
    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }

    // 获取剩余时间
    function getLeftTime() public view returns(uint256) {
        return endTime - now;
    }
    
    // 获取投资人数量
    function getInvestorCount() public view returns(uint256) {
        return investors.length;
    }
        
    // 获取申请数量
    function getRequestCount() public view returns(uint256) {
        return request.length;
    }
        
    // 获取指定申请的信息
    function getRequest(uint256 i) public view returns(string, uint256, address, uint256, requestStatus) {
        Request memory req = request[i];
        return (req.purpose, req.cost, req.seller, req.agreeNum, req.status);
    }

    // 参与众筹
    function invest() public payable returns(uint256) {
        require(msg.value == requireMoney);
        investors.push(msg.sender);
        isInvestor[msg.sender] = true;
        involveFunding.setFunding(msg.sender, this);
    }

    // 退款
    function reFund() onlyManager public {
        for (uint256 i = 0; i < investors.length; i++) {
            investors[i].transfer(requireMoney);
        }

        delete investors;
    }

    // 发起申请
    function createRequest(string _purpose, uint256 _cost, address _seller) onlyManager public {
        Request memory req = Request({
            purpose : _purpose,
            cost : _cost * 10**18,
            seller : _seller,
            agreeNum : 0,
            status : requestStatus.voting
        });
        request.push(req);
    }

    // 处理申请
    function agreeRequest(uint256 i) public {
        Request storage req = request[i];
        req.agreeNum++;
        req.isVoted[msg.sender] = true;
    }

    // 完成申请
    function finishRequest(uint256 i) onlyManager public {
        Request storage req = request[i];
        require(address(this).balance >= req.cost);
        require(req.agreeNum * 2 > investors.length);
        req.seller.transfer(req.cost);
        req.status = requestStatus.completed;
    }
    
}

contract FundingFactory {
    
    address webManager;             // 管理员
    address[] allFundings;          // 所有合约集合
    // 发起合约集合
    mapping(address=>address[]) creatorFundings;
    // 参与合约集合
    InvolveFunding involveFunding;

    constructor() public {
        webManager = msg.sender;
        involveFunding = new InvolveFunding();
    }
    
    // 获取所有合约
    function getAllFundings() public view returns(address[]) {
        return allFundings;
    }
        
    // 获取创建者合约
    function getCreatorFunding() public view returns(address[]) {
        return creatorFundings[msg.sender];
    }
    
    // 获取用户参与过的众筹
    function getSupportorFunding() public view returns(address[]) {
        return involveFunding.getFundings(msg.sender);
    }

    // 创建众筹合约
    function createFunding(string name, uint256 targMoney, uint256 reqMoney, uint256 time) public {
        address funding = new Funding(name, targMoney, reqMoney, time, msg.sender, involveFunding);
        allFundings.push(funding);
        creatorFundings[msg.sender].push(funding);
    }

}

contract InvolveFunding {
    // 参与过的合约集合
    mapping(address=>address[]) involveFundingsMap;
    
    // 添加合约到集合
    function setFunding(address _supportor, address _funding) public {
        involveFundingsMap[_supportor].push(_funding);
    }
    
    // 读取合约数据
    function getFundings(address _supportor) public view returns(address[]) {
        return involveFundingsMap[_supportor];
    }

}