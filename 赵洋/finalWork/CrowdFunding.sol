pragma solidity 0.6.0;

import 'https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Crowdfunding{
    using SafeMath for uint256;
    
    uint public projectsnum=0;
    Project[] private projects;
    
    function openProject(
        string calldata title,
        string calldata description,
        uint need,
        uint duringdays
        )external{
            uint ddl = now.add(duringdays.mul(1 days));
            Project newpro= new Project(msg.sender,title,description,need,ddl);
            projects.push(newpro);
            projectsnum++;
        }
        
    function returnProjectsAdd() external view returns(Project[] memory){
        return projects;
    }
}

contract Project{
    using SafeMath for uint256;
    
    enum State{
        ing,
        fail,
        success
    }
    
    struct requiremon{
        uint requiremoney;
        string requireaim;
        uint agreesum;
        uint disagreesum;
        State requirestate;
        mapping (address=>uint) agreeornot;
    }
    
    address payable public creator;
    uint public goal;
    uint public completeTime;
    uint public totalMoney;
    uint public nowMoney;
    uint public proddl;
    string public proname;
    string public prodescription;
    State public state=State.ing;
    mapping (address=>uint) public contributions;
    requiremon[] public requirelist;
    uint public requirelistnum=0;
    address payable[] public whocontribute;
    uint public personnum=0;
    
    constructor(
        address payable projectowner,
        string memory projectTitle,
        string memory projectDescription,
        uint fundneed,
        uint theddl
        )public{
            creator=projectowner;
            proname=projectTitle;
            prodescription=projectDescription;
            goal=fundneed;
            proddl=theddl;
            nowMoney=0;
        }
    
    function contribute()public payable{
        require(msg.sender!=creator);
        require(state==State.ing);
        require(msg.value>0);
        if(now>proddl){
             state=State.fail;
            completeTime=now;
            refund();
        }
        contributions[msg.sender]=contributions[msg.sender].add(msg.value);
        nowMoney=nowMoney.add(msg.value);
        whocontribute.push(msg.sender);
        personnum++;
        checkIfSuccessorFail();
    }
    
    function checkIfSuccessorFail() public{
        if(nowMoney>=goal){
            state=State.success;
            totalMoney=nowMoney;
            completeTime=now;
        }
        else if(now>proddl){
            state=State.fail;
            completeTime=now;
            refund();
        }
    }
    
    function CreatorRequireMoney(string memory purpose_,uint cost_)public{
        require(state==State.success);
        require(cost_<=nowMoney);
        require(msg.sender==creator);
        requiremon memory Areq=requiremon({
            requiremoney:cost_,
            requireaim:purpose_,
            agreesum:0,
            disagreesum:0,
            requirestate:State.ing
        });
        requirelist.push(Areq);
        requirelistnum++;
    }
    
    function ApproveRequire(uint requireID,bool agree_)public{
        require(msg.sender!=creator);
        require(requireID<requirelistnum);
        require(requirelist[requireID].requirestate==State.ing);
        require(contributions[msg.sender]!=0);
        require(requirelist[requireID].agreeornot[msg.sender]==0);
        if(agree_==true){
            requirelist[requireID].agreesum+=contributions[msg.sender];
            requirelist[requireID].agreeornot[msg.sender]=1;
        }
        else{
            requirelist[requireID].disagreesum+=contributions[msg.sender];
            requirelist[requireID].agreeornot[msg.sender]=2;
        }
        if(requirelist[requireID].agreesum*2>=totalMoney){
            requirelist[requireID].requirestate=State.success;
            Requireend(requireID);
        }
        else if(requirelist[requireID].disagreesum*2>=totalMoney){
            requirelist[requireID].requirestate=State.fail;
        }
    }
    
    function Requireend(uint requireID_)public{
        require(requirelist[requireID_].requiremoney<=nowMoney);
        require(requirelist[requireID_].requirestate==State.success);
        creator.transfer(requirelist[requireID_].requiremoney);
        nowMoney-=requirelist[requireID_].requiremoney;
    }
    
    function refund() public {
        require(state==State.fail);
        for(uint i=0;i<personnum;i++){
            whocontribute[i].transfer(contributions[whocontribute[i]]);
        }
    }
    
    function isVoted(address payable peopleaddress,uint requestnum)public view returns(uint){
        require(requestnum<requirelistnum);
        return requirelist[requestnum].agreeornot[peopleaddress];
    }
}