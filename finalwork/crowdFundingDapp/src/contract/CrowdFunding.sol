/*
1. 众筹发起人发起项目众筹，明确项目概述、项目介绍等项目信息，明确众筹金额和截止时间（考虑好时间问题）。
2. 每个用户可以查看所有的众筹项目，也可以查看自己相关的众筹项目（创建者可以查看自己创建的项目、投资人可以查看自己投资过的项目）。
3. 投资人可以查看未完成众筹项目，进行投资。
4. 众筹成功后，众筹发起人一笔资金使用请求，明确使用金额和目的。请求需要经过投资人的投票来决定是否允许使用，
满足50%的允许率，可以进行金额的使用。【注意】每位投资人只允许投一票。
 - 例如：用户A发起了众筹要10ETH，用户B、C进行了项目投资（分别投了8ETH和2ETH）然后众筹成功，
 即此处B占80%投票权，C占20%投票权。用户A想要用1ETH来采购物资，于是发起金额使用请求。
 此时如果B同意了请求，即已满足80%的允许率，资金使用请求成功。（金额从合约转入众筹发起人的地址内。）。
 此时如果仅仅是C同意了请求，即才满足20%的允许率，还需要等待下一位投资人的投票才行。
*/

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
contract CrowdFunding{
    address payable[] projects;
    address superManager;
    constructor() public{
        superManager = msg.sender;
    }
    function launch(string calldata title, string calldata introduction, uint256 amount, uint deadline) public {
        Project p = new Project(title, introduction, amount, deadline);
        projects.push(p.getAddress());
    }
    function invest(address payable addr) payable public{
        Project(addr).invest(msg.value, msg.sender);
        addr.transfer(msg.value);
    }
    function request(address payable addr, string calldata purpose, uint256 amount) payable public{
        Project(addr).createRequest(purpose, amount, msg.sender);
    }
    function vote(address payable addr, uint256 i, bool approve) payable public {
        Project(addr).vote(i,approve,msg.sender);
    }
    function getProjects() public view returns (address payable[] memory){
        return projects;
    }
    //获取项目的信息
    function getProjectsCount() public view returns (uint256){
        return projects.length;
    }
    function getProjectLauncher(address payable addr) public view returns (address payable){
        return Project(addr).launcher();
    }
    function getProjectTitle(address payable addr) public view returns (string memory){
        return Project(addr).title();
    }
    function getProjectIntroduction(address payable addr) public view returns (string memory){
        return Project(addr).introduction();
    }
    function getProjectAmount(address payable addr) public view returns (uint256){
        return Project(addr).amount();
    }
    function getProjectDeadline(address payable addr) public view returns (uint){
        return Project(addr).deadline();
    }
    function getProjectTotal(address payable addr) public view returns (uint256){
        return Project(addr).total();
    }
    function getProjectSuccess(address payable addr) public view returns (bool){
        return Project(addr).success();
    }
    function getProjectInvestorsCount(address payable addr) public view returns ( uint256 ){
         return Project(addr).getInvestorsCount();
    }
    function getProjectInvestors(address payable addr) public view returns (address[] memory ){
        return Project(addr).getInvestors();
    }
    function getProjectInvestments(address payable addr) public view returns (uint256[] memory ){
        return Project(addr).getInvestments();
    }
    function getProjectBalance(address payable addr) public view returns (uint256 ){
        return Project(addr).getBalance();
    }
    //获取项目使用资金请求的信息
    function getProjectRequestCount(address payable addr) public view returns (uint256){ 
        return Project(addr).getRequestCount();
    }
    function getProjectRequestPurpose(address payable addr, uint256 j) public view returns (string memory){
        return Project(addr).getRequestPurpose(j);
    }
    function getProjectRequestAmount(address payable addr, uint256 j) public view returns (uint256){
        return Project(addr).getRequestAmount(j);
    } 
    function getProjectRequestVoting(address payable addr, uint256 j) public view returns(bool){
        return Project(addr).getRequestVoting(j);
    }
    function getProjectRequestPassed(address payable addr, uint256 j) public view returns(bool){
        return Project(addr).getRequestPassed(j);
    }
    function getProjectRequestLeastVotes(address payable addr, uint256 j) public view returns(uint256){
        return Project(addr).getRequestLeastVotes(j);
    }
    function getProjectRequestVotes(address payable addr, uint256 j) public view returns(uint256){
        return Project(addr).getRequestVotes(j);
    }
    function getProjectRequestVoters(address payable addr, uint256 j) public view returns(address[] memory){
        return Project(addr).getRequestVoters(j);
    }
    function getProjectRequestVoteResult(address payable addr, uint256 j) public view returns(bool[] memory){
        return Project(addr).getRequestVoteResult(j);
    }
}

contract Project{
    address payable public launcher; //创建者
    string public title; //项目概述
    string public introduction; //项目介绍
    uint256 public amount; //众筹金额
    uint public deadline;  //截止时间
    uint256 public total;  //总集资金额
    bool public success;    //是否众筹成功人
    address[] public investors;
    uint256[] public investments;
    mapping(address => uint256) public investAmount;   //投资金额
    mapping(address => bool) public isInvestor;    //是否为投资人
    struct request{
        uint256 amount; //金额
        string purpose; //目的
        bool voting;    //正在投票阶段
        bool passed;    //是否通过
        uint256 leastVotes; //通过所需最少票数
        uint256 votes;          //支持票数
        uint256 disVotes;       //反对票数
        address[] voters;     //已投票者
        bool[] isAgree;         //是否支持
        mapping(address => bool) isVoteMap; //是否已投票
    }
    request[] public Requests;  //所有请求
    constructor(string memory _title, string memory _introduction, uint256 _amount, uint _deadline ) public{
        launcher = tx.origin;
        title = _title;
        introduction = _introduction;
        amount = _amount;
        deadline = _deadline;
        total = 0;
        success = false;
    }
    
    function getInvestors() public view returns (address[] memory){
        return investors;
    }
    
    function getInvestments() public view returns (uint256[] memory){
        return investments;
    }
    
    //返回合约地址
    function getAddress() public view returns (address payable){
        address payable p = address(this);
        return p;
    }
    
    function getRequestCount()view public returns(uint256){
        return Requests.length;
    }
    
    function getRequestPurpose(uint256 i) public view returns(string memory){
        request memory req=Requests[i];
        return req.purpose;
    }
    
    function getRequestAmount(uint256 i) public view returns(uint256){
        request memory req=Requests[i];
        return req.amount;
    }
    
    function getRequestVoting(uint256 i) public view returns(bool){
        request memory req=Requests[i];
        return req.voting;
    }
    
    function getRequestPassed(uint256 i) public view returns(bool){
        request memory req=Requests[i];
        return req.passed;
    }
    
    function getRequestLeastVotes(uint256 i) public view returns(uint256){
        request memory req=Requests[i];
        return req.leastVotes;
    }
    
    function getRequestVotes(uint256 i) public view returns(uint256){
        request memory req=Requests[i];
        return req.votes;
    }
    
    function getRequestVoters(uint256 i) public view returns(address[] memory){
        request memory req=Requests[i];
        return req.voters;
    }
    
    function getRequestVoteResult(uint256 i) public view returns(bool[] memory){
        request memory req=Requests[i];
        return req.isAgree;
    }
    
    function getWhetherVoted(uint256 i) public view returns (bool){
        return (Requests[i].isVoteMap[msg.sender]);
    }
    
    function getInvestorsCount() public view returns (uint256){
        return investors.length;
    }
    
    //投资
    function invest(uint256 _value, address _sender) payable public{
        require(success==false);
        require(block.timestamp<deadline);  //是否小于截止时间
        if(isInvestor[_sender]==false){
            investors.push(_sender);
            investAmount[_sender] = _value;   //投资额
            isInvestor[_sender] = true;
            investments.push(_value);
        }else{  //追加投资
            investAmount[_sender] += _value;   //投资额
            for(uint i=0; i<investors.length; i++){
                if(investors[i]==_sender){
                    investments[i]+=_value;
                    break;
                }
            }
        }
        total += _value;
        if(success == false && total >= amount){    //集资是否成功
            success = true;
        }
    }

    //创建新的请求
    function createRequest(string calldata _purpose, uint256 _amount, address _sender) public {
        require(_amount<=address(this).balance);
        require(_sender==launcher);
        require(success==true);
        uint256 _leastVotes = amount/2+1;
        address[] memory _voters = new address[](0);
        bool[] memory _isAgree = new bool[](0);
        request memory req = request({
            amount: _amount,
            purpose:_purpose,
            voting: true,
            passed: false,
            leastVotes: _leastVotes,
            votes: 0,
            disVotes: 0,
            voters: _voters,
            isAgree: _isAgree
        });
        Requests.push(req);
    }

    //投资人投票
    function vote(uint256 i, bool approve, address _sender) payable public {
        //需要请求正在投票，投资人尚未投票，仅投资人可投票
        require(Requests[i].voting == true);
        require(isInvestor[_sender] == true);
        require(Requests[i].isVoteMap[_sender] == false);
        Requests[i].isVoteMap[_sender] = true;
        Requests[i].voters.push(_sender);
        //支持票
        if(approve==true){
            Requests[i].isAgree.push(true);
            Requests[i].votes += investAmount[_sender];
            if(Requests[i].votes >= Requests[i].leastVotes){
                Requests[i].voting = false;
                Requests[i].passed = true;
                launcher.transfer(Requests[i].amount);
            }
        }
        //反对票
        else{
            Requests[i].isAgree.push(false);
            Requests[i].disVotes += investAmount[_sender];
            if(Requests[i].disVotes >= Requests[i].leastVotes){
                Requests[i].voting = false;
                Requests[i].passed = false;
            }
        }
    }
    function getBalance() public view returns (uint256){
        return address(this).balance;
    } 
    fallback() external payable {
        
    }
}
