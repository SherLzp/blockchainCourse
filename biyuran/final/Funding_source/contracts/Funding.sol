/* 参考https://solidity-cn.readthedocs.io/zh/develop/ */ 

// SPDX-License-Identifier: GPL3.0
pragma solidity ^0.6.0;

contract FundingAPI {
    address payable[] items;
    constructor() public {}
    function launch(string calldata _name, string calldata _description, uint128 _totalAmount, uint64 _deadline) public {
        Funding _funding = new Funding(
            msg.sender, _name, _description, _totalAmount, _deadline
        );
        items.push(_funding.getAddress());
    }
    function invest(uint32 i) payable public {
        address payable addr = items[i];
        Funding(addr).invest(uint128(msg.value), msg.sender);
        addr.transfer(msg.value);
    }
    
    //调用Funding的各种接口，联系app.js
    function getFundingsCount() public view returns(uint256) {
        return items.length;
    }
    function getFundingAddress(uint32 i) public view returns(address payable) {
        return items[i];
    }
    function getFundingLauncher(uint32 i) public view returns(address payable) {
        return Funding(items[i]).launcher();
    }
    function getFundingName(uint32 i) public view returns(string memory) {
        return Funding(items[i]).name();
    }
    function getFundingDescription(uint32 i) public view returns(string memory) {
        return Funding(items[i]).description();
    }
    function getFundingTotalAmount(uint32 i) public view returns(uint128) {
        return Funding(items[i]).totalAmount();
    }
    function getFundingCurrentAmount(uint32 i) public view returns(uint128) {
        return Funding(items[i]).currentAmount();
    }
    function getFundingLeftAmount(uint32 i) public view returns(uint128) {
        return Funding(items[i]).leftAmount();
    }
    function getFundingDeadline(uint32 i) public view returns(uint64) {
        return Funding(items[i]).deadline();
    }
    function getFundingInvestment(uint32 i, address _sender) public view returns(uint128) {
        return Funding(items[i]).getInvestment(_sender);
    }
    
    function request(uint32 i, string calldata _purpose, uint128 _totalAmount) public {
        Funding(items[i]).createRequest(msg.sender, _purpose, _totalAmount);
    }
    function vote(uint32 i, uint32 j, bool approve) public {
        Funding(items[i]).vote(msg.sender, j, approve);
    }
    function getFundingRequestCount(uint32 i) public view returns(uint256) {
        return Funding(items[i]).getRequestCount();
    }
    function getFundingRequestPurpose(uint32 i, uint32 j) public view returns(string memory) {
        return Funding(items[i]).getRequestPurpose(j);
    }
    function getFundingRequestTotalAmount(uint32 i, uint32 j) public view returns(uint128) {
        return Funding(items[i]).getRequestTotalAmount(j);
    }
    function getFundingRequestApproveVotes(uint32 i, uint32 j) public view returns(uint128) {
        return Funding(items[i]).getRequestApproveVotes(j);
    }
    function getFundingRequestDisapproveVotes(uint32 i, uint32 j) public view returns(uint128) {
        return Funding(items[i]).getRequestDisapproveVotes(j);
    }
    function getFundingRequestIsVoted(uint32 i, uint32 j) public view returns(bool) {
        return Funding(items[i]).getIsVoted(msg.sender, j);
    }
}

contract Funding {
    //与发布众筹有关的变量
    address payable public launcher;
    string public name;
    string public description;
    uint128 public totalAmount;
    uint128 public currentAmount;
    uint128 public leftAmount;
    uint64 public deadline;
    uint256 public total; 
    bool public success;    
    
    //与投资者有关的变量
    address[] public investors;
    mapping(address => uint128) public investAmount;
    mapping(address => uint32) public investerIndex;
    
    //资金申请数据结构
    struct Request {
        string purpose;
        uint128 totalAmount;
        uint128 approveVotes;
        uint128 disapproveVotes;
        mapping(address => bool) isVoted;
        //bool voting;    
        //bool passed;    
        //uint256 leastVotes; 
        //address[] voters;     
        //bool[] isAgree;         
    }
    Request[] public requests;

    constructor(address payable _launcher, string memory _name, string memory _description, uint128 _totalAmount, uint64 _deadline) public {
        launcher = _launcher;
        name = _name;
        description = _description;
        totalAmount = _totalAmount;
        currentAmount = 0;
        leftAmount = _totalAmount;
        deadline = _deadline;
        //success = false;
    }
    
    //函数接口
    function getInvestors() public view returns (address[] memory){
        return investors;
    }
    function getAddress() public view returns(address payable){
        return address(this);
    }
    function getInvestment(address _sender) public view returns(uint128) {
        return investAmount[_sender];
    }
    function getRequestCount()view public returns(uint256){
        return requests.length;
    }
    function getRequestPurpose(uint32 j) public view returns(string memory) {
        return requests[j].purpose;
    }
    function getRequestTotalAmount(uint32 j) public view returns(uint128) {
        return requests[j].totalAmount;
    }
    function getRequestApproveVotes(uint32 j) public view returns(uint128) {
        return requests[j].approveVotes;
    }
    function getRequestDisapproveVotes(uint32 j) public view returns(uint128) {
        return requests[j].disapproveVotes;
    }
    
    //投资
    function invest(uint128 _amount, address _sender) payable public{
        //需要未投资完+未过期
        require(_amount <= totalAmount-currentAmount);
        require(block.timestamp < deadline);
        
        if(investerIndex[_sender] == 0) {
            investors.push(_sender);
            investAmount[_sender] = _amount;
            investerIndex[_sender] = uint32(investors.length);
        } else {//支持追加投资
            investAmount[_sender] += _amount;
            for(uint i=0; i<investors.length; i++){
                if(investors[i]==_sender){
                    //investments[i]+=_value;
                    break;
                }
            }
        }
        currentAmount += _amount;
        if(success == false && totalAmount >= _amount){ 
            success = true;
        }
    }

    //发起资金申请
    function createRequest(address _sender, string calldata _purpose, uint128 _totalAmount) public {
        require(_sender == launcher);
        require(_totalAmount <= leftAmount);
        
        leftAmount -= _totalAmount;
        requests.push(Request({
            totalAmount: _totalAmount,
            approveVotes: 0,
            disapproveVotes: 0,
            purpose: _purpose
        }));
    }

    //投资人对资金申请进行投票
    function vote(address _sender, uint256 j, bool approve) payable public {
        //需要请求正在投票+投资人尚未投票+必须为投资人
        require(requests[j].approveVotes < (requests[j].totalAmount+1)/2);
        require(requests[j].disapproveVotes < (requests[j].totalAmount+1)/2);
        require(investerIndex[_sender] != 0);
        require(requests[j].isVoted[_sender] == false);
        
        requests[j].isVoted[_sender] = true;
        if(!approve) {
            requests[j].disapproveVotes += investAmount[_sender];
        } else {
            requests[j].approveVotes += investAmount[_sender];
            if(requests[j].approveVotes >= (requests[j].totalAmount+1)/2){
                launcher.transfer(requests[j].totalAmount);
            }
        }
    }
    function getIsVoted(address _sender, uint256 j) public view returns (bool) {
        return requests[j].isVoted[_sender];
    }
    function getBalance() public view returns (uint256){
        return address(this).balance;
    } 
    fallback() payable external {}
    receive () payable external {}
}

