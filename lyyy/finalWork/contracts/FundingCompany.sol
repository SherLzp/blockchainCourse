// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Funding{
    //发起人
    address public manager;
    //项目名
    string public projectName;
    //项目概述
    string public projectDescrip;
    //投资金额
    uint public investBalance;
    //目标金额
    uint public targetBalance;
    //截止日期
    uint public deadline;
    //投资人
    address payable[] public investors;
    //mapping someone who invest in a project
    mapping(address => bool)public investMapping;
    InvestorFundingContract investorfunding;//object

    constructor (string memory _projectName, uint _investBalance, uint _targetBalance
    ,string memory _projectDescrip , uint _durationInSeconds, address _creator
    , InvestorFundingContract _investorfunding) public {
        manager = _creator;
        projectName = _projectName;
        investBalance = _investBalance;
        targetBalance = _targetBalance;
        projectDescrip = _projectDescrip;
        deadline = _durationInSeconds + block.timestamp;

        //contract to funding
        investorfunding = _investorfunding;
    }

    //投资
    function invest() payable public{
        //everyone can only invest one time
        require(investMapping[msg.sender] == false);
        //invest balance
        require(msg.value == investBalance);
        //add to investors[] array
        investors.push(msg.sender);
        //Mark the current account as a participant
        investMapping[msg.sender] = true;
        //Pass the address of the investor and the current contract to FundingFactory
        investorfunding.setFunding(msg.sender,address(this));
    }

    modifier onlyManager(){
        require(msg.sender == manager);
        _;
    }

    //退款
    function drawBack()onlyManager payable public{
        require(block.timestamp >= deadline); //over deadline 
        require(address(this).balance < targetBalance); //or balance < targer

        for(uint i = 0; i < investors.length; i++){
            investors[i].transfer(investBalance);
        }

        //delete all investors
        delete investors;
    }

    //枚举
    enum requestStatus{Voting,Approved,Completed}

    //请求
    struct Request{
        string purpose; //目的
        uint256 cost; //需要金额
        address payable shopAddress; //which shop
        uint256 voteCount;//over 50% then approve
        requestStatus status; //object of requestStatus
    }
    mapping(address => bool) investorVotedMapping; //voted mapping
    //request array
    Request[] public requests;

    //create a new request
    function createRequest(string memory _purpose, uint256 _cost
    , address payable _shopAddress) public onlyManager{
        Request memory req = Request({
            purpose : _purpose,
            cost : _cost,
            shopAddress : _shopAddress,
            voteCount : 0,
            status : requestStatus.Voting
        });
        requests.push(req);
    }

    //approve request function
    function approveRequest(uint256 index) public{
        //check if the investor is in this project or not
        require(investMapping[msg.sender]);
        //check Request[]
        Request storage req = requests[index];
        //check if voted or not
        require(investorVotedMapping[msg.sender] == false);
        //check if the status is voting or not , if approved and completed then no need vote again
        require(req.status == requestStatus.Voting);
        
        //vote count + 1
        req.voteCount += 1;
        investorVotedMapping[msg.sender] = true; //set the investor voted
        //over half vote count then 
        if(req.voteCount * 2 > investors.length){
            req.status == requestStatus.Approved;
        }
    }

    //completed request
    function finalizeRequest(uint256 index)onlyManager public{
        //transfer money
        
        Request storage req = requests[index];
        //check if balance is enough
        require(address(this).balance >= req.cost);
        //check if over half vote count
        require(req.voteCount * 2 > investors.length);
        //transfer
        req.shopAddress.transfer(req.cost);
        //update request status
        req.status = requestStatus.Completed;

    }

    //get balance
    function getBalance()public view returns(uint256){
        return address(this).balance;
    }

    //get investors
    function getInvestors()public view returns(address payable[] memory){
        return investors;
    }

    //get investors number
    function getInvestorsCount() public view returns (uint256){
        return investors.length;
    }

    //get remaining time
    function getRemainTime()public view returns (uint256){
        return (deadline - block.timestamp) / 60 / 60 / 24 ;//sec
    }

    //get requested count
    function getRequestsCount() public view returns (uint256){
        return requests.length;
    }

    //get request detail
    function getRequestDetail(uint256 index) public view 
        returns(string memory,uint256,address,bool,uint256,uint256) {
        require(requests.length > index);
        Request storage req = requests[index];
        bool voted = investorVotedMapping[msg.sender];
        return (req.purpose, req.cost, req.shopAddress, voted, req.voteCount, uint256(req.status));
    }
    
}

contract FundingCompany{
    //platform manager
    address public platformManager;
    //all of the funding 
    address[] allFundings;
    //creator of funding
    mapping(address => address[]) creatorFundings;
    //investor contract
    InvestorFundingContract investorfunding;

    constructor() public{
        platformManager = msg.sender;
        //new a investor funding contract
        investorfunding = new InvestorFundingContract();
    }

    //create new funding
    function createFunding(string memory _name, uint _investMoney
        , uint _targetMoney, string memory _projectDescrip,uint _duration) public{
        address funding = address(new Funding(_name, _investMoney, _targetMoney
            ,_projectDescrip , _duration, msg.sender, investorfunding));
        //add in funding list
        allFundings.push(funding);
        //add in creator of funding list
        creatorFundings[msg.sender].push(funding);
    }
    
    //return all funding list
    function getAllFundings() public view returns(address[] memory){
        return allFundings;
    }

    //return all creator of funding list
    function getCreatorFundings() public view returns (address[] memory){
        return creatorFundings[msg.sender];
    }

    //return the funding of current account which participates
    function getInvestorFunding() public view returns (address[] memory){
        return investorfunding.getFundings(msg.sender);
    }
}

//contract of investor that participate in the funding
contract InvestorFundingContract{
    //investor funding mapping
    mapping(address => address[]) investorFundingMap;

    //set the investor that invest this funding project
    function setFunding(address _investor, address _funding) public {
        investorFundingMap[_investor].push(_funding);
    }

    //get all the funding project
    function getFundings(address _investor) public view returns (address[] memory) {
        return investorFundingMap[_investor];
    }
}