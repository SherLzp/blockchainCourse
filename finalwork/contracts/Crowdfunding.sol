// SPDX-License-Identifier: GPL3.0
pragma solidity >=0.4.22 <0.9.0;

contract Crowdfunding {
    struct Funder {
        address payable addr;
        uint256 amount;
    }

    struct Vote {
        string title;
        uint256 usage;
        uint256 deadline;
        mapping(uint256 => uint256) agree;
        uint256 numOfVoters;
    }

    struct Project {
        address payable owner;
        string title;
        uint256 goal;
        uint256 amount;
        uint256 numOfFunders;
        //uint is the index
        mapping(uint256 => Funder) funders;
        //a timestamp when it ends
        uint256 deadline;
        Vote vote;
        bool isVoting;
        bool isFinished;
    }

    mapping(uint256 => Project) projects;
    uint256 public numOfProjects;

    constructor() public {
        numOfProjects = 0;
    }

    function createProject(
        string memory _title,
        uint256 _goal,
        uint256 _deadline
    ) public returns (uint256 _id) {
        uint256 id = numOfProjects++;
        Project storage p = projects[id];
        p.title = _title;
        p.goal = _goal;
        p.deadline = _deadline;
        p.owner = msg.sender;
        p.amount = 0;
        p.numOfFunders = 0;
        return id;
    }

    function contribute(uint256 _pid) public payable {
        Project storage p = projects[_pid];
        p.funders[p.numOfFunders++] = Funder({
            addr: msg.sender,
            amount: msg.value
        });
        p.amount += msg.value;
        checkGoalReached(_pid);
    }

    function checkGoalReached(uint256 _pid)
        public
        payable
        returns (bool reached)
    {
        Project storage p = projects[_pid];
        p.isFinished = p.amount >= p.goal;
        return p.isFinished;
    }

    function refund(uint256 _pid) public payable {
        Project storage p = projects[_pid];
        for (uint256 i = 0; i < p.numOfFunders; ++i) {
            p.funders[i].addr.transfer(p.funders[i].amount);
        }
        p.amount = 0;
    }

    function launchVote(
        uint256 _pid,
        string memory _title,
        uint256 _usage,
        uint256 _deadline
    ) public {
        Project storage p = projects[_pid];
        require(p.amount > 0); //still have money to use
        require(p.isFinished);
        p.isVoting = true;
        p.vote.title = _title;
        p.vote.usage = _usage;
        p.vote.deadline = _deadline;
        p.vote.numOfVoters = 0;
    }

    function vote(uint256 _pid) public {
        Project storage p = projects[_pid];
        uint256 i = 0;
        for (i = 0; i < p.numOfFunders; ++i) {
            if (p.funders[i].addr == msg.sender) break;
        }
        p.vote.agree[p.vote.numOfVoters] = i;
        p.vote.numOfVoters++;
        //checkVoteAgreed(_pid);
    }

    function checkVoteAgreed(uint256 _pid) public returns (bool reached) {
        Project storage p = projects[_pid];
        uint256 sum = 0;
        for (uint256 i = 0; i < p.vote.numOfVoters; ++i) {
            sum += p.funders[p.vote.agree[i]].amount;
        }
        if (2 * sum >= p.goal) {
            p.amount -= p.vote.usage;
            p.isVoting = false;
            p.owner.transfer(sum);
            return true;
        }
        return false;
    }

    function getProject(uint256 _pid)
        public
        view
        returns (
            uint256 pid,
            string memory title,
            uint256 goal,
            uint256 amount,
            address owner,
            uint256 numOfFunders,
            uint256 deadline,
            bool isFinished,
            bool isVoting,
            uint256 time,
            uint256 numOfVoters
        )
    {
        Project storage p = projects[_pid];
        return (
            _pid,
            p.title,
            p.goal,
            p.amount,
            p.owner,
            p.numOfFunders,
            p.deadline,
            p.isFinished,
            p.isVoting,
            block.timestamp,
            p.vote.numOfVoters
        );
    }

    function getFunder(uint256 _pid, uint256 _fid)
        public
        view
        returns (address, uint256)
    {
        Funder storage f = projects[_pid].funders[_fid];
        return (f.addr, f.amount);
    }

    function getProjectVote(uint256 _pid)
        public
        view
        returns (string memory title, uint256 usage)
    {
        Project storage p = projects[_pid];
        return (p.vote.title, p.vote.usage);
    }

    modifier onlyNotEnded(uint256 _pid) {
        require(
            block.timestamp < projects[_pid].deadline &&
                projects[_pid].amount < projects[_pid].goal
        );
        _;
    }

    modifier onlyEnded(uint256 _pid) {
        require(
            block.timestamp >= projects[_pid].deadline ||
                projects[_pid].amount >= projects[_pid].goal
        );
        _;
    }

    modifier onlyVoting(uint256 _pid) {
        require(
            projects[_pid].isVoting &&
                block.timestamp < projects[_pid].vote.deadline
        );
        _;
    }

    modifier onlyNotVoting(uint256 _pid) {
        require(
            !projects[_pid].isVoting ||
                block.timestamp >= projects[_pid].vote.deadline
        );
        _;
    }
}
