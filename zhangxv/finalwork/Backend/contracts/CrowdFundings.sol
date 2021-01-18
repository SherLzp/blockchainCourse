// SPDX-License-Identifier: MIT
pragma solidity >=0.7.4 <0.9.0;

contract CrowdFundings {

    CrowdFundingProject[] public projects;
    Proposal[] public proposals;

    mapping ( address => uint[] ) investedProjects;

    event projectCreated (address indexed initiator, uint indexed projectID); // To retreive all the projects created by an account
    event projectInvested (address indexed investor, uint indexed projectID, uint amount); // To retreive all the projects invested by an account
    event proposalRaised (address indexed initiator, uint indexed projectID, uint indexed proposalID, uint amount);
    event proposalApproved (address indexed initiator, uint indexed projectID, uint indexed proposalID, address to, uint amount);
    event proposalFinished (address indexed initiator, uint indexed projectID, uint indexed proposalID, address to, uint amount);
    event debug (uint info);

    function createProject (uint _target, string calldata _title, string calldata _des, uint _interval) external {
        CrowdFundingProject proj = new CrowdFundingProject(projects.length, payable(msg.sender), _target, _title, _des, _interval);
        projects.push(proj);
        emit projectCreated (msg.sender, projects.length-1);
    }

    function investProject (uint projID) payable external {
        projects[projID].initiator().transfer(msg.value);
        projects[projID].invest(msg.sender, msg.value);
        emit projectInvested (msg.sender, projID, msg.value);
    }

    function getBalanceOfProject (uint projID) view external returns (uint) {
        return projects[projID].balance();
    }

    function getAllProjects () public view returns (CrowdFundingProject[] memory) {
        return projects;
    }

    function raiseProposal (address payable to, uint projID, uint amount, string calldata title, string calldata description) external {
        require(projects[projID].isOpen() == true, "The Project is closed");
        require(projects[projID].initiator() == msg.sender, "The msg.sender is not the initiator");
        Proposal prop = new Proposal(to, proposals.length, projID, amount, title, description);
        proposals.push(prop);
        emit proposalRaised(msg.sender, projID, proposals.length-1, amount);
    }

    // Vote for proposal
    function voteForProposal (uint propID) external {
        Proposal prop = proposals[propID];
        CrowdFundingProject proj = projects[prop.projectID()];
        bool isApproved = prop.voteAndCount(msg.sender, proj.investments(msg.sender), proj.targetAmount());
        if (isApproved == true) emit proposalApproved(proj.initiator(), proj.projectID(), propID, prop.to(), prop.amount());
    }

    function transferForProposal (uint propID) payable external {
        require(!proposals[propID].isFinished(), "This proposal is finished");
        require (msg.value == proposals[propID].amount(), "Inconsistent value");
        require (proposals[propID].isApproved(), "Unapproved transfer.");
        proposals[propID].to().transfer(msg.value);
        Proposal prop = proposals[propID];
        CrowdFundingProject proj = projects[prop.projectID()];
        prop.setIsFinished(true);
        proj.setBalance(proj.balance()-msg.value);
        emit proposalFinished(proj.initiator(), proj.projectID(), propID, prop.to(), prop.amount());
    }
}

contract CrowdFundingProject {
    
    bool public isOpen;
    uint public projectID;
    address payable public initiator;
    string public title;
    string public description;
    uint public targetAmount;
    uint public balance;
    uint public endTime;
    address[] investors;
    mapping ( address => uint ) public investments;

    constructor (uint _projID, address payable _initiator, uint _target, string memory _title, string memory _des, uint _interval) {
        isOpen = true;
        projectID = _projID;
        initiator = _initiator;
        title = _title;
        description = _des;
        targetAmount = _target;
        balance = 0;
        endTime = block.timestamp + _interval;
    }

    // Invest the project
    function invest (address investor, uint amount) payable public {
        require (isOpen, "This project has closed.");
        require (block.timestamp <= endTime, "This project has closed.");
        require (amount <= investor.balance, "Ether is not enough." );
        require (amount <= targetAmount - balance, "Too much Ethers." );
        // initiator.transfer(amount);
        // payable(address(this)).transfer(amount);
        balance += amount;
        if (investments[investor] == 0)  investors.push(investor);
        investments[investor] += amount;
    }

    function setBalance (uint newBalance) public {
        balance = newBalance;
    }

}

contract Proposal {

    bool public isFinished;
    bool public isApproved;
    uint public proposalID;
    uint public projectID;
    uint public amount; 
    uint public approvalCapital; //The capital that all the approval investors represent
    string public title;
    string public description;
    address payable public to;
    mapping (address => bool) isVoted;
    
    constructor (address payable _to, uint _propID, uint _projID, uint _amount, string memory _title, string memory _des) {
        isFinished = false;
        isApproved = false;       
        proposalID = _propID;
        projectID = _projID;
        amount = _amount;
        approvalCapital = 0;
        title = _title;
        description = _des;
        to = _to;
    }

    // Vote
    function voteAndCount (address voter, uint capital, uint total) public returns (bool) {
        require (isVoted[voter] == false);
        isVoted[voter] = true;
        approvalCapital += capital;
        if (approvalCapital*2 > total) { isApproved = true; return true;}
        else return false;
    }

    function setIsFinished (bool value) public {
        isFinished = value;
    }

    function getIsVoted () external view returns (bool){
        return isVoted[msg.sender];
    }

}
