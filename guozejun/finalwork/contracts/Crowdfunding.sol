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
    address[] participants;
    uint[] amounts;

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
        participants.push(addr);
        amounts.push(amount);
        currentAmount += amount;
        if(currentAmount >= riseAmount) {
            isFinished = true;
        }
    }

    function ProjectStatus() public view returns(bool) {
        return isFinished;
    }

    function GetProjectInfo() 
    public view returns(address, string memory, string memory, uint, uint, uint, uint, bool, address[] memory, uint[] memory) {
        return (owner,projectAbstract,projectDescription,startTime,
        endTime,riseAmount,currentAmount,isFinished,participants,amounts);
    }
}