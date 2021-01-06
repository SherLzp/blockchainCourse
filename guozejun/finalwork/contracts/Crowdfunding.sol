// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Crowdfunding {
    address public owner;
    string projectAbstract;
    string projectDescription;
    uint startTime;
    uint endTime;
    uint riseAmount;
    uint currentAmount;
    bool isFinished = false;
    Participant[] participants;

    struct Participant {
        address userAddress;
        uint amount;
    }

    // struct Voter {
    //     uint weight;
    //     bool voted;
    //     uint proposal;
    // }

    // struct Proposal {
    //     string name;
    //     uint voteCount;
    // }

    constructor(string memory _projAbstract, string memory _projectDescription, uint _startTime,
                uint _endTime, uint _riseAmount) public {
        owner = msg.sender;
        projectAbstract = _projAbstract;
        projectDescription = _projectDescription;
        startTime = _startTime;
        endTime = _endTime;
        riseAmount = _riseAmount;
    }

    function Parcipate(uint amount, address addr) public payable {
        Participant memory part;
        part.amount = amount;
        currentAmount += amount;
        if(currentAmount >= riseAmount) {
            isFinished = true;
        }
        part.userAddress = addr;
        participants.push(part);
    }

    function ProjectStatus() public view returns(bool) {
        return isFinished;
    }
}