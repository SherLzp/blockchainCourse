// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.7.5;

contract CrowdFunding {
    address public organizer;

    struct Investment {
        uint invID;
        address investor;
        uint amount;
        uint time;
    }

    struct Request{
        uint reqID;
        string description;
        uint amount;
        uint supportCount;
        uint[] supporters;
    }

    struct Project {
        uint proID;
        address initiator;
        string title;
        string description;
        uint goal;
        uint currentAmount;
        uint totalAmount;
        uint startTime;
        uint endTime;
        uint invCount;
        Investment[100] investments;
        uint reqCount;
        Request[10] requests;
    }

    uint public projectCount;
    Project[100] public projects;
    mapping(address => uint[][2]) public relations;

    constructor() public {
        organizer = msg.sender;
        projectCount = 0;
    }

    function Login() public view returns(address){
        return msg.sender;
    }

    function GetRelatedProjects() public view returns(uint[] memory, uint[] memory){
        return (relations[msg.sender][0], relations[msg.sender][1]);
    }

    function GetInvestment(uint proID, uint invID) public view returns(address, uint, uint){
        require(proID < projectCount);
        require(invID < projects[proID].invCount);
        Investment storage inv = projects[proID].investments[invID];
        return (inv.investor, inv.amount, inv.time);
    }

    function GetRequest(uint proID, uint reqID) public view returns(string memory, uint, uint, uint[] memory){
        require(proID < projectCount);
        require(reqID < projects[proID].reqCount);
        Request storage req = projects[proID].requests[reqID];
        return (req.description, req.amount, req.supportCount, req.supporters);
    }

    function CreateProject(string memory title, string memory description, uint goal, uint duration) public {
        require(goal > 0 && duration > 0, "Invalid Argument");
        Project storage pro = projects[projectCount];
        pro.proID = projectCount++;
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

        relations[msg.sender][0].push(pro.proID);
    }

    function HasEnded(uint proID) public view returns(bool){
        if(HasSuccess(proID)){
            return true;
        }
        return projects[proID].endTime < block.timestamp;
    }

    function HasSuccess(uint proID) public view returns(bool){
        return projects[proID].totalAmount >= projects[proID].goal;
    }

    function Invest(uint proID) public payable{
        require(!HasEnded(proID), "The Project Has Ended");

        Project storage pro = projects[proID];
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

    function Withdraw(uint proID) public returns(bool){
        require(HasEnded(proID) && !HasSuccess(proID), "Invalid Action");
        Project storage pro = projects[proID];
        
        //Check if sender has invested
        bool flag = false;
        uint i;
        for(i = 0; i < pro.invCount; i++){
            if(pro.investments[i].investor == msg.sender){
                flag = true;
                break;
            }
        }
        require(flag, "Unable to Find Your Investment");

        uint amount = pro.investments[i].amount;
        if(amount > 0){
            pro.investments[i].amount = 0;
            if(!msg.sender.send(amount)){
                pro.investments[i].amount = amount;
                return false;
            }
        }
        return true;
    }

    function CreateRequest(uint proID, string memory description, uint amount) public {
        require(HasSuccess(proID) && amount > 0, "Invalid Action");
        Project storage pro = projects[proID];
        require(pro.initiator == msg.sender, "Invalid Account");
        require(pro.reqCount < 10, "To much requests");
        require(pro.currentAmount >= amount, "Insufficient Balance");

        //New Request
        Request storage req = pro.requests[pro.reqCount];
        req.reqID = pro.reqCount++;
        req.description = description;
        req.amount = amount;
        req.supportCount = 0;
        req.supporters = new uint[](0);
    }

    function GrantSupport(uint proID, uint reqID) public {
        //Check if sender has invested
        Project storage pro = projects[proID];
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
        //Check if sender has supported
        flag = true;
        for(uint j = 0; j < req.supportCount; j++){
            if(req.supporters[j] == i){
                flag = false;
                break;
            }
        }
        require(flag, "You have already supported");

        //Support
        req.supporters.push(i);
        req.supportCount++;
    }

    function HasEnoughSupport(uint proID, uint reqID) public view returns(bool) {
        Project storage pro = projects[proID];
        Request storage req = pro.requests[reqID];
        uint supportAmount = 0;
        for(uint i = 0; i < req.supportCount; i++){
            supportAmount += pro.investments[req.supporters[i]].amount;
        }
        return supportAmount * 2 > pro.totalAmount;
    }

    function GetSupportRate(uint proID, uint reqID) public view returns(uint) {
        Project storage pro = projects[proID];
        Request storage req = pro.requests[reqID];
        uint supportAmount = 0;
        for(uint i = 0; i < req.supportCount; i++){
            supportAmount += pro.investments[req.supporters[i]].amount;
        }
        return supportAmount * 100 / pro.totalAmount;
    }

    function Collect(uint proID, uint reqID) public returns(bool){
        Project storage pro = projects[proID];
        require(pro.initiator == msg.sender, "Invalid Account");
        require(HasEnoughSupport(proID, reqID), "Don't have enough support!");
        require(pro.currentAmount >= pro.requests[reqID].amount, "Don't have enough balance!");

        uint amount = pro.requests[reqID].amount;
        if(amount > 0) {
            pro.requests[reqID].amount = 0;
            pro.currentAmount -= amount;
            if(!msg.sender.send(amount)){
                pro.requests[reqID].amount = amount;
                pro.currentAmount += amount;
                return false;
            }
        }
        return true;
    }
}
