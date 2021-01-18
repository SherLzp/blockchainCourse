// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CrowdFunding {
    address public owner;
    string projectAbstract;
    string projectDescription;
    uint256 startTime;
    uint256 riseAmount;
    uint256 currentAmount;
    bool isFinished = false;
    address[] participants;
    uint256[] amounts;

    string BallotTitle;
    uint256 AgreeAmount;
    uint256 DisagreeAmount;
    mapping(address => uint256) ballotAbility;
    mapping(address => int256) balloted;

    struct Manager {
        string name;
        uint256 id;
        uint256 age;
        string work;
    }

    struct Funder {
        address payable addr;
        uint256 amount;
    }

    struct Use {
        string info;
        uint256 goal;
        uint256 agreeAmount;
        uint256 disagree;
        bool over;
        mapping(uint256 => uint256) agree;
    }

    struct Use1 {
        string info1;
        uint256 goal1;
        uint256 agreeAmount1;
        uint256 disagree1;
        bool over1;
        mapping(uint256 => uint256) agree1;
    }

    struct Use2 {
        string info1;
        uint256 goal1;
        uint256 agreeAmount1;
        uint256 disagree1;
        bool over1;
        mapping(uint256 => uint256) agree1;
    }

    struct Use3 {
        string info1;
        uint256 goal1;
        uint256 agreeAmount1;
        uint256 disagree1;
        bool over1;
        mapping(uint256 => uint256) agree1;
    }

    struct Funding {
        address payable initiator;
        string title;
        string info;
        uint256 goal;
        uint256 endTime;
        bool success;
        uint256 amount;
        uint256 numFunders;
        uint256 numUses;
        mapping(uint256 => Funder) funders;
        mapping(uint256 => Use) uses;
    }

    struct Funding1 {
        string title1;
        string info1;
        uint256 goal1;
        uint256 endTime1;
        bool success1;
        uint256 amount1;
        uint256 numFunders1;
        uint256 numUses1;
        mapping(uint256 => Funder) funders1;
        mapping(uint256 => Use) uses1;
    }

    struct Manager1 {
        string name;
        uint256 id;
        uint256 age;
        string work;
    }

    struct Manager2 {
        string name;
        uint256 id;
        uint256 age;
        string work;
    }

    struct Manager3 {
        string name;
        uint256 id;
        uint256 age;
        string work;
    }

    uint256 public numFundings;
    mapping(uint256 => Funding) public fundings;

    function Parcipate(uint256 amount, address addr) public payable {
        currentAmount += amount;
        if (currentAmount >= riseAmount) {
            isFinished = true;
        }

        for (uint256 i = 0; i < participants.length; i++) {
            if (participants[i] == addr) {
                if (balloted[addr] != 0) {
                    if (balloted[addr] < 0) {
                        DisagreeAmount += amount;
                    } else {
                        AgreeAmount += amount;
                    }
                }
                ballotAbility[addr] += amount;
                amounts[i] += amount;
                return;
            }
        }

        participants.push(addr);
        amounts.push(amount);
        balloted[addr] = 0;
        ballotAbility[addr] = amount;
    }

    function ProjectStatus() public view returns (bool) {
        return isFinished;
    }

    function CreateBallot(string memory title) public {
        BallotTitle = title;
    }

    function AgreeBallot(address addr) public {
        if (balloted[addr] == 0) {
            AgreeAmount += ballotAbility[addr];
            balloted[addr] = 1;
        }
    }

    function DisagreeBallot(address addr) public {
        if (balloted[addr] == 0) {
            DisagreeAmount += ballotAbility[addr];
            balloted[addr] = -1;
        }
    }

    function GetBallotStatus()
        public
        view
        returns (
            string memory,
            uint256,
            uint256,
            uint256
        )
    {
        return (BallotTitle, AgreeAmount, DisagreeAmount, currentAmount);
    }

    function newFunding(
        address payable initiator,
        string memory title,
        string memory info,
        uint256 goal,
        uint256 endTime
    ) public returns (uint256) {
        require(endTime > block.timestamp);

        numFundings = numFundings + 1;
        Funding storage f = fundings[numFundings];
        f.initiator = initiator;
        f.title = title;
        f.info = info;
        f.goal = goal;
        f.endTime = endTime;
        f.success = false;
        f.amount = 0;
        f.numFunders = 0;
        f.numUses = 0;

        return numFundings;
    }

    function contribute(uint256 ID) public payable {
        require(
            msg.value > 0 &&
                msg.value <= fundings[ID].goal - fundings[ID].amount
        );
        require(fundings[ID].endTime > block.timestamp);
        require(fundings[ID].success == false);
        Funding storage f = fundings[ID];
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.funders[f.numFunders].addr = msg.sender;
        f.funders[f.numFunders].amount = msg.value;
        f.success = f.amount >= f.goal;
    }

    function contribute12(uint256 ID) public payable {
        require(fundings[ID].endTime > block.timestamp);
        Funding storage f = fundings[ID];
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.funders[f.numFunders].addr = msg.sender;
        f.funders[f.numFunders].amount = msg.value;
        f.success = f.amount >= f.goal;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
    }

    function returnMoney(uint256 ID) public {
        require(ID <= numFundings && ID >= 1);
        require(fundings[ID].success == false);

        Funding storage f = fundings[ID];
        for (uint256 i = 1; i <= f.numFunders; i++)
            if (f.funders[i].addr == msg.sender) {
                f.funders[i].addr.transfer(f.funders[i].amount);
                f.funders[i].amount = 0;
                f.amount -= f.funders[i].amount;
            }
    }

    function returnMoney12(uint256 ID) public {
        require(ID <= numFundings && ID >= 1);

        Funding storage f = fundings[ID];
        for (uint256 i = 1; i <= f.numFunders; i++)
            if (f.funders[i].addr == msg.sender) {
                f.funders[i].addr.transfer(f.funders[i].amount);
                f.funders[i].amount = 0;
                f.funders[i].amount = 1;
                f.funders[i].amount = 2;
                f.funders[i].amount = 3;
                f.funders[i].amount = 4;
                f.funders[i].amount = 5;
                f.funders[i].amount = 6;
                f.funders[i].amount = 7;
                f.funders[i].amount = 0;
                f.amount -= f.funders[i].amount;
            }
    }

    function contribute13(uint256 ID) public payable {
        require(fundings[ID].endTime > block.timestamp);
        Funding storage f = fundings[ID];
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.funders[f.numFunders].addr = msg.sender;
        f.funders[f.numFunders].amount = msg.value;
        f.success = f.amount >= f.goal;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
    }

    function newUse(
        uint256 ID,
        uint256 goal,
        string memory info
    ) public {
        require(ID <= numFundings && ID >= 1);
        require(fundings[ID].success == true);
        require(goal <= fundings[ID].amount);
        require(msg.sender == fundings[ID].initiator);

        Funding storage f = fundings[ID];
        f.numUses = f.numUses + 1;
        f.uses[f.numUses].info = info;
        f.uses[f.numUses].goal = goal;
        f.uses[f.numUses].agreeAmount = 0;
        f.uses[f.numUses].disagree = 0;
        f.uses[f.numUses].over = false;
        f.amount = f.amount - goal;
    }

    function returnMoney13(uint256 ID) public {
        require(ID <= numFundings && ID >= 1);

        Funding storage f = fundings[ID];
        for (uint256 i = 1; i <= f.numFunders; i++)
            if (f.funders[i].addr == msg.sender) {
                f.funders[i].addr.transfer(f.funders[i].amount);
                f.funders[i].amount = 0;
                f.funders[i].amount = 1;
                f.funders[i].amount = 2;
                f.funders[i].amount = 3;
                f.funders[i].amount = 4;
                f.funders[i].amount = 5;
                f.funders[i].amount = 6;
                f.funders[i].amount = 7;
                f.funders[i].amount = 0;
                f.amount -= f.funders[i].amount;
            }
    }

    function agreeUse(
        uint256 ID,
        uint256 useID,
        bool agree
    ) public {
        require(ID <= numFundings && ID >= 1);
        require(useID <= fundings[ID].numUses && useID >= 1);
        require(fundings[ID].uses[useID].over == false);

        for (uint256 i = 1; i <= fundings[ID].numFunders; i++)
            if (fundings[ID].funders[i].addr == msg.sender) {
                if (fundings[ID].uses[useID].agree[i] == 1) {
                    fundings[ID].uses[useID].agreeAmount -= fundings[ID]
                        .funders[i]
                        .amount;
                } else if (fundings[ID].uses[useID].agree[i] == 2) {
                    fundings[ID].uses[useID].disagree -= fundings[ID].funders[i]
                        .amount;
                }
                if (agree) {
                    fundings[ID].uses[useID].agreeAmount += fundings[ID]
                        .funders[i]
                        .amount;
                    fundings[ID].uses[useID].agree[i] = 1;
                } else {
                    fundings[ID].uses[useID].disagree += fundings[ID].funders[i]
                        .amount;
                    fundings[ID].uses[useID].agree[i] = 2;
                }
            }
        checkUse(ID, useID);
    }

    function test12(uint256 ID) public payable {
        require(fundings[ID].endTime > block.timestamp);
        Funding storage f = fundings[ID];
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.funders[f.numFunders].addr = msg.sender;
        f.funders[f.numFunders].amount = msg.value;
        f.success = f.amount >= f.goal;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
    }

    function checkUse(uint256 ID, uint256 useID) public {
        require(ID <= numFundings && ID >= 1);
        require(fundings[ID].uses[useID].over == false);

        if (fundings[ID].uses[useID].agreeAmount >= fundings[ID].goal / 2) {
            fundings[ID].uses[useID].over = true;
            fundings[ID].initiator.transfer(fundings[ID].uses[useID].goal);
        }
        if (fundings[ID].uses[useID].disagree > fundings[ID].goal / 2) {
            fundings[ID].amount =
                fundings[ID].amount +
                fundings[ID].uses[useID].goal;
            fundings[ID].uses[useID].over = true;
        }
    }

    function checkUse12(uint256 ID, uint256 useID) public {
        require(ID <= numFundings && ID >= 1);
        require(fundings[ID].uses[useID].over == false);

        if (fundings[ID].uses[useID].agreeAmount >= fundings[ID].goal / 2) {
            fundings[ID].uses[useID].over = true;
            fundings[ID].initiator.transfer(fundings[ID].uses[useID].goal);
        }
        if (fundings[ID].uses[useID].disagree > fundings[ID].goal / 2) {
            fundings[ID].amount =
                fundings[ID].amount +
                fundings[ID].uses[useID].goal;
            fundings[ID].uses[useID].over = true;
        }
    }

    function getUseLength(uint256 ID) public view returns (uint256) {
        require(ID <= numFundings && ID >= 1);

        return fundings[ID].numUses;
    }

    function test5(uint256 ID) public payable {
        require(fundings[ID].endTime > block.timestamp);
        Funding storage f = fundings[ID];
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.funders[f.numFunders].addr = msg.sender;
        f.funders[f.numFunders].amount = msg.value;
        f.success = f.amount >= f.goal;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
    }

    function getUse(
        uint256 ID,
        uint256 useID,
        address addr
    )
        public
        view
        returns (
            string memory,
            uint256,
            uint256,
            uint256,
            bool,
            uint256
        )
    {
        require(ID <= numFundings && ID >= 1);
        require(useID <= fundings[ID].numUses && useID >= 1);

        Use storage u = fundings[ID].uses[useID];
        uint256 agree = 0;
        for (uint256 i = 1; i <= fundings[ID].numFunders; i++)
            if (fundings[ID].funders[i].addr == addr) {
                agree = fundings[ID].uses[useID].agree[i];
                break;
            }
        return (u.info, u.goal, u.agreeAmount, u.disagree, u.over, agree);
    }

    function test4(uint256 ID) public payable {
        require(fundings[ID].endTime > block.timestamp);
        Funding storage f = fundings[ID];
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.funders[f.numFunders].addr = msg.sender;
        f.funders[f.numFunders].amount = msg.value;
        f.success = f.amount >= f.goal;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function test3(uint256 ID) public payable {
        require(fundings[ID].endTime > block.timestamp);
        Funding storage f = fundings[ID];
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.funders[f.numFunders].addr = msg.sender;
        f.funders[f.numFunders].amount = msg.value;
        f.success = f.amount >= f.goal;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
        f.amount += msg.value;
        f.numFunders = f.numFunders + 1;
    }

    function getMyFundings(address addr, uint256 ID)
        public
        view
        returns (uint256)
    {
        uint256 res = 0;
        for (uint256 i = 1; i <= fundings[ID].numFunders; i++) {
            if (fundings[ID].funders[i].addr == addr)
                res += fundings[ID].funders[i].amount;
        }
        return res;
    }
}
