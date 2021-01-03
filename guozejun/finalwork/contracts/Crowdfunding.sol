// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Crowdfunding {

    address public owner;

    struct Participant {
        uint userID;
        address userAddress;
        string time;
        uint amount;
    }

    struct Voter {
        uint weight;
        bool voted;
        uint proposal;
    }

    struct Proposal {
        string name;
        uint voteCount;
        Project project;
    }

    struct Project {
        uint projectID;
        uint initiatorID;
        string projectAbstract;
        string projectDescription;
        string startTime;
        string endTime;
        uint riseAmount;
        uint currentAmount;
        uint totalAmount;
        Participant[] participants;
    }

    Project[] public projects;

    constructor() public {
        owner = msg.sender;
    }
}