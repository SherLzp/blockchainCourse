pragma solidity ^0.4.24;

import './FundingFactory.sol';


contract Funding {

    // 1. 管理员（项目发起人）
    // 2. 项目名称
    // 3. 项目目标筹集金额
    // 4. 每个人支持多少钱
    // 5. 项目持续多少天

    address public manager;
    string public projectName;
    uint256 public targetMoney;
    uint256 public supportMoney;
    //uint256 public duration; //持续时间 秒单位
    uint256 public endTime;

    address[] investors;//维护所有参与人的结构

    SupportorFundingContract supportorFundings;

    constructor(string _projectName, uint256 _targetMoney, uint256 _supportMoney, uint256 _duration, address _creator, SupportorFundingContract _supportorFundings) public {
        // manager = msg.sender;
        manager = _creator;
        projectName = _projectName;
        targetMoney = _targetMoney;
        supportMoney = _supportMoney;
        endTime = block.timestamp + _duration;
        //当前时间+持续时间=终止时间


        //将合约传递给Funding，在构造中接收
        supportorFundings = _supportorFundings;
    }

    //使用一个mapping来判断一个地址是否是投资人，这样可以快速识别是否有投票资格
    mapping(address => bool) isInvestorMap;


    function invest() payable public {
        require(msg.value == supportMoney);

        investors.push(msg.sender);

        isInvestorMap[msg.sender] = true;


        // 将投资人与当前合约的地址传递到FundingFactory中
        //supportorFundings[msg.sender].push(this);
        supportorFundings.setFunding(msg.sender, this);
    }


    //退款函数，由外面（前端）调用
    function refund() onlyManager public {
        for (uint256 i = 0; i < investors.length; i++) {
            investors[i].transfer(supportMoney);
        }

        delete investors;
    }

    //产品状态的枚举：0：进行中，1：已批准，2：已完成
    enum RequstStatus {
        Voting, Approved, Completed
    }

    //定义花费请求，一个请求由项目方发起，由投资人投票
    struct Request {
        string purpose;
        uint256 cost;
        address seller;

        //当前这个请求赞成的投票数量
        uint256 approveCount;
        RequstStatus status;

        //记录投资人对这个请求的投票状态，只有未投票的才能投票，每人仅限一票
        mapping(address => bool) isVotedMap;
    }

    Request[] public allRequests; //所有的花费请求的集合

    function createRequest(string _purpose, uint256 _cost, address _seller) onlyManager public {
        Request memory req = Request({
            purpose : _purpose,
            cost : _cost,
            seller : _seller,
            approveCount : 0,
            status : RequstStatus.Voting
            });

        allRequests.push(req);
    }


    // 1. 检验这个人是否投过票，若未投过，则允许投票，反之退出

    // 2. voteCount数据加1。
    // 3. 将该投票人在investorVotedMap映射中的值设置为true。
    function approveRequest(uint256 i) public {

        //快速识别是否有投票资格
        require(isInvestorMap[msg.sender]);

        //一定要使用storage类型，引用类型，否则无法修改allRequests里面的数据
        Request storage req = allRequests[i];

        //如果已经投过票，直接退出
        require(req.isVotedMap[msg.sender] == false);

        req.approveCount++;

        req.isVotedMap[msg.sender] = true;
    }


    function finalizeRequest(uint256 i) onlyManager public {
        Request storage req = allRequests[i];

        // 0.金额足够，> cost
        require(address(this).balance >= req.cost);

        // 1. 票数过半。
        require(req.approveCount * 2 > investors.length);

        // 2. 执行转账
        req.seller.transfer(req.cost);

        // 3. 更新request的状态
        req.status = RequstStatus.Completed;
    }


    modifier onlyManager {
        require(msg.sender == manager);
        _;
    }

    //s
    function getLeftTime() public view returns (uint256) {
        return endTime - block.timestamp;
    }

    //返回投资人的数量
    function getInvestorsCount() public view returns (uint256) {
        return investors.length;
    }

    //返回当前的所有请求的数量
    function getRequestsCount() public view returns (uint256) {
        return allRequests.length;
    }

    //
    function getRequestByIndex(uint256 i) public view returns (string, uint256, address, uint256, RequstStatus) {
        Request memory req = allRequests[i];
        return (req.purpose, req.cost, req.seller, req.approveCount, req.status);
    }


    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getInvestors() public view returns (address[]) {
        return investors;
    }
}