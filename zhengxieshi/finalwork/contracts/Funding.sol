// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract Funding {
    // 发起⼈
    // 项⽬名称
    // 项目介绍
    // 众筹⽬标⾦额
    // 众筹截⽌⽇期
    // 投资人
    address payable public manager;
    string public projectName;
    string public projectDetail;
    uint public targetBalance;
    uint public startTime;
    uint public endTime;
    uint public requestBalance;
    bool public isDiscarded;
    bool public isAchieved;

    address payable[] public investors;
    mapping (address => uint) investorBalance;

    SupporterFundingContract supporterFundings;

    constructor(string memory _projectName, string memory _projectDetail, uint _targetBalance,
                uint _startTime, uint _endTime, address payable _creator, address supporterFundings_addr) public {
        manager = _creator;
        projectName = _projectName;
        projectDetail = _projectDetail;
        targetBalance = _targetBalance;
        startTime = _startTime;
        endTime = _endTime;
        supporterFundings = SupporterFundingContract(supporterFundings_addr);
    }

    //投资
    function invest() payable public{
        require(block.timestamp <= endTime);
        require(msg.value > 0);
        if (investorBalance[msg.sender] == 0) {
            investors.push(msg.sender);
            supporterFundings.setFunding(msg.sender, address(this));
        }
        investorBalance[msg.sender] += msg.value;
        if (address(this).balance == targetBalance) {
            isAchieved = true;
        }
    }

    modifier onlyManager{
        require(msg.sender == manager);
        _;
    }

    //众筹失败，退款
    function drawback() onlyManager public {
        for (uint i = 0;i < investors.length;i++){
            investors[i].transfer(investorBalance[investors[i]]);
        }
        isDiscarded = true;
    }

    enum RequestStatus {Voting, Approved, NotApproved, Completed}

    //花费请求
    struct Request {
        string purpose;
        uint cost;
        uint voteApproveCount;
        uint voteDisapproveCount;
        uint votersNum;
        mapping(address => bool) investorVotedMap;
        RequestStatus status;
    }

    Request[] requests;


    function createRequest(string memory _purpose,uint _cost) onlyManager public {
        Request memory req = Request ({
            purpose: _purpose,
            cost: _cost,
            voteApproveCount: 0,
            voteDisapproveCount: 0,
            votersNum: 0,
            status:RequestStatus.Voting
            });
        requests.push(req);
        requestBalance += _cost;
    }

    //批准⽀付申请
    function voteRequest(uint index, bool isApproved) public {
        require(investorBalance[msg.sender] != 0);
        Request storage req = requests[index];
        require(req.investorVotedMap[msg.sender] == false);
        require(req.status == RequestStatus.Voting);
        req.votersNum += 1;
        if (isApproved) {
            req.voteApproveCount += investorBalance[msg.sender];
        }
        else {
            req.voteDisapproveCount += investorBalance[msg.sender];
        }
        req.investorVotedMap[msg.sender] = true;
        if (req.voteApproveCount * 2 > address(this).balance) {
            req.status = RequestStatus.Approved;
        }
        else if (req.voteDisapproveCount * 2 > address(this).balance) {
            req.status = RequestStatus.NotApproved;
        }
    }

    function executeRequest(uint index) public onlyManager{
        Request storage req = requests[index];
        require(address(this).balance >= req.cost);
        require(req.status == RequestStatus.Approved);

        manager.transfer(req.cost);
        req.status = RequestStatus.Completed;
    }

    function isManager() public view returns(bool) {
        return msg.sender == manager;
    }

    function isInvestor() public view returns(bool) {
        return investorBalance[msg.sender] != 0;
    }

    function getInvestment() public view returns(uint256) {
        return investorBalance[msg.sender];
    }

    //获取合约余额
    function getBalance()public view returns(uint256){
        return address(this).balance;
    }

    //获取投资人
    function getInvestors()public view returns(address payable[] memory){
        return investors;
    }

    //获取投资人数量
    function getInvestorsCount()public view returns(uint256) {
        return investors.length;
    }

    //返回众筹剩余时间
    function getRemainTime()public view returns(uint256) {
        return(endTime - now)/60/60/24;
    }

    //返回花费申请数量
    function getRequestsCount()public view returns(uint256) {
        return requests.length;
    }

    //返回某⼀个花费申请的具体信息
    function getRequestDetailByIndex(uint256 index)public view returns(string memory,uint256,bool,uint256,uint256,uint256,uint256) {
        //确保访问不越界
        require(requests.length > index);
        Request storage req =requests[index];

        bool isVoted = req.investorVotedMap[msg.sender];
        return (req.purpose, req.cost, isVoted, req.votersNum, req.voteApproveCount, req.voteDisapproveCount, uint256(req.status));
    }

}



contract FundingFactory{
    // 平台管理员
    address public platformManager;
    // 所有的众筹集合
    address[] allFundings;

    mapping(address => address[]) creatorFundings;

    SupporterFundingContract supporterFundings;

    constructor() public {
        supporterFundings = new SupporterFundingContract();
        platformManager = msg.sender;
    }

    function createFunding(string memory _name, string memory _detail, uint _targetMoney, uint _startTime, uint _endTime) public {
        //创建一个合约，使用new方法，同时传入参数，返回一个地址
        Funding _funding = new Funding(_name, _detail, _targetMoney, _startTime,  _endTime, msg.sender, address(supporterFundings));

        allFundings.push(address(_funding));

        //维护创建者所创建的合约集合
        creatorFundings[msg.sender].push(address(_funding));
    }

    //返回当前平台的所有的合约
    function getAllFundings() public view returns (address[] memory) {
        return allFundings;
    }

    //返回当前账户所创建所有的合约
    function getCreatorFundings() public view returns (address[] memory) {
        return creatorFundings[msg.sender];
    }

    //获取回当前账户所的参与的合约的集合
    function getSupportorFunding() public view returns (address[] memory) {
        return supporterFundings.getFundings(msg.sender);
    }

}

contract SupporterFundingContract {

    mapping(address => address[]) SupporterFundingMap;

    function setFunding(address _supporter, address _funding) public {
        SupporterFundingMap[_supporter].push(_funding);
    }

    function getFundings(address _supporter) public view returns (address[] memory) {
        return SupporterFundingMap[_supporter];
    }
}
