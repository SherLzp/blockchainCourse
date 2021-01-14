pragma solidity 0.6.0;
import './SafeMath.sol';

contract Platform {
    using SafeMath for uint256;

    // list of the projects
    Project[] private projects;

    // events here
    event ProjectStarted(
        address projectAddress,
        address projectCreator,
        string projectName,
        string projectDescription,
        uint256 projectDeadline,
        uint256 aimedGoal
    );

    // functions here
    function startProject(
        string calldata title,
        string calldata description,
        uint durationInDays,
        uint amountToRaise
    ) external {
        uint raiseUntil = now.add(durationInDays.mul(1 days));
        Project newProject = new Project(msg.sender, title, description, raiseUntil, amountToRaise);
        projects.push(newProject);
        emit ProjectStarted(
            address(newProject),
            msg.sender,
            title,
            description,
            raiseUntil,
            amountToRaise
        );
    }          
                                             
    function returnAllProjects() external view returns(Project[] memory){
        return projects;
    }
}



contract Project {
    using SafeMath for uint256;
    // project state
    enum State {
        inProgress,
        success,
        failed
    }

    // proposal state
    enum proposalState {
        pending,
        success,
        failed
    }
    
    struct Proposal {
        string usage;
        uint256 approval;
        uint256 decline;
        uint256 amount;
        mapping (address => bool) voted;
        bool isPaid;
        proposalState PState;
    }
    
    
    address payable public creator;
    string public description;
    string public name;
    uint256 public aimedAmount;
    uint256 public currentAmount;
    uint256 public deadline;
    uint proposalNum;
    uint finishTime;
    State  public state = State.inProgress;
    mapping (address=>uint) public contributors;
    Proposal[] public proposals;


    // constructor
    constructor
    (
        address payable projectStarter,
        string memory projectTitle,
        string memory projectDesc,
        uint fundRaisingDeadline,
        uint goalAmount
    ) public {
        creator = projectStarter;
        name = projectTitle;
        description = projectDesc;
        aimedAmount = goalAmount;
        deadline = fundRaisingDeadline;
        currentAmount = 0;
        proposalNum = 0;
    }

    // events
    event FundingReceived(address contributor, uint amount, uint256 current);
    event ProposalCreated(string des, uint value);
    event ProposalApproved(uint index);
    event ProposalDeclined(uint index);
    event ProposalPaid(uint index);


    // modifier
    modifier inState(State _state) {
        require(state==_state);
        _;
    }

    modifier isCreator() {
        require(msg.sender==creator);
        _;
    }

    // functions
    function createProposal(string calldata MoneyUsage, uint256 Needamount) external {
        require(msg.sender==creator);
        require(Needamount<currentAmount);
        Proposal memory p = Proposal({
            usage: MoneyUsage,
            approval: 0,
            decline: 0,
            amount: Needamount,
            PState: proposalState.pending,
            isPaid: false
        });
        proposals.push(p);
        proposalNum++;
        emit ProposalCreated(MoneyUsage, Needamount);
    }
    
    function approveProposal(uint id) external {
        require(id<proposalNum);
        require(proposals[id].PState==proposalState.pending);
        //require(proposals[id].voted[msg.sender]==false);
        //proposals[id].voted[msg.sender] = true;
        proposals[id].approval = proposals[id].approval.add(contributors[msg.sender]);
        payout(id);
    }
    
    function declineProposal(uint id) external {
        require(id<proposalNum);
        require(proposals[id].PState==proposalState.success);
        require(proposals[id].voted[msg.sender]==false);
        proposals[id].voted[msg.sender] = true;
        proposals[id].decline.add(contributors[msg.sender]);
        checkProposalState(id);
    }
    
    function payout(uint id) internal returns (bool) {
        proposals[id].isPaid = true;
        currentAmount = currentAmount.sub(proposals[id].amount);
        if (creator.send(proposals[id].amount)) {
            emit ProposalPaid(id);
            return true;
        } else {
            currentAmount = currentAmount.add(proposals[id].amount);
            proposals[id].isPaid = false;
            return false;
        }
    }
    
    
    function checkProposalState(uint id) public {
        if (proposals[id].approval >= aimedAmount/2) {
            proposals[id].PState = proposalState.success;
            emit ProposalApproved(id);
            payout(id);
        } else if (proposals[id].decline >= aimedAmount/2) {
            proposals[id].PState = proposalState.failed;
            emit ProposalDeclined(id);
        }
    }
    
    function checkState() public {
        if (currentAmount>=aimedAmount) {
            state = State.success;
        } else if (now > deadline) {
            state = State.failed;
        }
        finishTime = now;
    }

    function contribute() external inState(State.inProgress) payable {
        require(msg.sender!=creator);
        contributors[msg.sender] = contributors[msg.sender].add(msg.value);
        currentAmount = currentAmount.add(msg.value);
        emit FundingReceived(msg.sender, msg.value, currentAmount);
        checkState();
    }

    function getRefund() public inState(State.failed) returns (bool) {
        require(contributors[msg.sender]>0);

        uint refundAmount = contributors[msg.sender];
        contributors[msg.sender] = 0;

        if (msg.sender.send(refundAmount)==false) {
            contributors[msg.sender] = contributors[msg.sender].add(refundAmount);
            return false;
        } else {
            currentAmount = currentAmount.sub(refundAmount);
        }

        return true;
    }

    function getDetails() public view returns 
    (
        address payable projectStarter,
        string memory projectTitle,
        string memory projectDesc,
        uint256 Deadline,
        State currentState,
        uint256 current,
        uint256 goalAmount,
        bool hasCon
    ) {
        projectStarter = creator;
        projectTitle = name;
        projectDesc = description;
        Deadline = deadline;
        currentState = state;
        current= currentAmount;
        goalAmount = aimedAmount;
        hasCon = contributors[msg.sender] > 0 ? true: false;
    }
}
