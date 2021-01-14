// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./Funding.sol";

contract FundManager{

    uint public fundNum = 0;
    address[] public fundList;
    mapping(address => uint) addressID;
    mapping(address => uint[]) investedID;
    mapping(address => uint[]) startedID;

    function getFundList() view public returns (address[] memory){
        return fundList;
    }

    function newFunding(
    // 0xF81D1aF547cFF9e2a2A842475D9C10fbf865cDfc, "name", "this is a project", 120, 100000
        address payable client,
        string memory _projectName,
        string memory _details,
        uint _raiseTime,
        uint _goalAmount
    ) public payable returns (address){
        // require(msg.value > 0,"send a penny?");
        Funding f = new Funding();
        f.init( msg.sender, _projectName, _details, _raiseTime, _goalAmount);
        fundList.push(address(f));
        addressID[address(f)] = fundNum;
        addStartedProject(client, address(f));
        fundNum++;
        return address(f);
    }
    function addInvestedProject(address client, address project)public{
        investedID[client].push(addressID[project]);
    }
    function addStartedProject(address client, address project)public{
        startedID[client].push(addressID[project]);
    }
    
    function getStartedProject(address client) view public returns (uint[] memory){
        return startedID[client];
    }
    
    function getInvestedProject(address client) view public returns (uint[] memory){
        return investedID[client];
    }
    
}