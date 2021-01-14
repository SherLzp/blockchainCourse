// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Funding{
    //Proposal
    string proposal;
    uint need;
    // the weight of the approve/disapprove
    uint approved;
    uint against;   
        
    uint voteState; // 0-- ongoint/not start  1-- approved 2-- rejected
        
    // project detail
    address payable public starter;
    address self;
    string projectName;
    string details;
    uint deadLine;

    // current state 
    uint goalAmount;
    uint numDonators;
    
    // mapping
    address payable[] public donators;
    mapping(address => uint) dID;
    mapping(address => uint) dAmount;
    bool[] public voted ;
    
    constructor() public {
        starter = msg.sender;
        projectName = "None";
        details = "None";
        deadLine = block.timestamp + 1 minutes;
        goalAmount = 1 ether;
        numDonators = 0;
    }
    
    // initialization
    function init (
        address payable _starter,
        string memory  _projectName,
        string memory _details,
        uint _raiseTime,
        uint _goalAmount
    ) payable public  {
        starter = _starter;
        projectName = _projectName;
        details = _details;
        deadLine = block.timestamp + _raiseTime;
        goalAmount = _goalAmount;
    }
    
    function update(string memory str) public returns(string memory res){
        if(msg.sender == starter){
            details = str;
        }
        else{
            return 'rejected';
        }
        return 'accepted';
    }

    function donate() public payable{
        require(block.timestamp <= deadLine,"This funding is over!" );// If the funding is over, reject.
        require(msg.value > 0,"Please at least send a penny!");// If not sending anything, reject
        // require(msg.value + address(this).balance <= goalAmount,"Exceed the goal!");

        bool flag = true; // Whether the donator has donated
        for(uint i = 0;i<numDonators ;i++){
            // If exists, add the donate amount.
            if(donators[i] == msg.sender){
                dAmount[msg.sender] += msg.value;
                flag = false;
                break;
            }
        }
        if(flag){
            // If a new donator, add it to the list
            donators.push(msg.sender);
            dID[msg.sender] = numDonators;
            dAmount[msg.sender] = msg.value;
            numDonators++;
            voted.push(false);
        }
        // raisedAmount += msg.value;
    }

    // "this is a proposal", 2000
    function newProposal(string memory _details,uint _need) public{
        require(msg.sender == starter, "the proposer must be the starter!");
        require(_need * 1 ether<=address(this).balance,"Balance is not enough!");
        
        proposal = _details;
        need = _need;
        // the weight of the approve/disapprove
        approved = 0;
        against = 0;
        voteState = 0;
        
        //Iniialize the vote result
        for(uint i = 0;i<numDonators;i++){
            voted[i] = false;   
        }
        
    }
    
    // 
    function vote(address from, uint approve) payable public{
        // check if the voter is a donator
        require(isDonator(from),"You shall not vote because you are not a donator!");
        require(!voted[dID[from]],"You have voted!");
        
        // The donated amount of the voter as weight is added to the approve side.
        if(approve == 1 ){
            approved += dAmount[msg.sender];
        }else if(approve == 2){
            against += dAmount[msg.sender];
        }
        // sign as voted
        voted[dID[from]] = true;
        
        // check if the vote is over
        if(approved*2 > goalAmount ){
            starter.transfer( need * 1 ether);    
            voteState = 1;
        }
        // proposal rejected
        if(against *2 > goalAmount ){ 
            voteState = 2;
        }
    }
    
    


    function checkDDL() view public returns(bool) {return(block.timestamp >= deadLine);}

    function isDonator(address addr) view public returns (bool isdonator){
        for(uint i = 0;i<numDonators;i++){
            if(donators[i] == addr) return true;
        }
        return false;
    }

    function isGoalReached() public view returns (bool reached){
        return (address(this).balance >= goalAmount);
    }
    
    function getRemainingTime() view public returns(uint){
        if(deadLine > block.timestamp)
        return (deadLine - block.timestamp);
        else return 0;
    }
    
    function getName() view public returns (string memory){return projectName;}
    
    function getDDL() view public returns (uint){return deadLine;}
    
    function getGoal()view public returns (uint) {return goalAmount;}
    
    function getBalance() view public returns (uint) {return address(this).balance;}

    function getStarter()view public returns(address){return starter;}
    
    function getProposal() view public returns(string memory) {return proposal;}
    
    function getNeed() view public returns (uint){return need;}
    
    function getDetails() view public returns (string memory) {return details;}

    function getNumDonators() view public returns (uint){return numDonators;}

    function getDonatorAddress(uint index) view public returns (address){require(index<numDonators,"Wrong index for donators!");return donators[index];}

    function getVoteState() view public returns (uint){return voteState;}

    function getAddress() view public returns(address) {return address(this);}

    function setTime() public {
        deadLine = block.timestamp + 15;
    }

    function postpone()public{
        deadLine += 15;
    }
    // function refund() public payable {
    //     // when the fund is over and the goal is not reached, refund is acceptable
    //     require(block.timestamp >= deadLine,"The funding is not over yet!");
    //     require(!isGoalReached(),"The goal is reached!");
    //     for(uint i = 0;i< numDonators ;i++){
    //         donatorAddress[i].transfer(donators[donatorAddress[i]].donatedAmount);
    //     }
    // }
}