// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CrowdFund {

    struct Initiator {
        address payable addr;
        uint amount;
    }

    struct Apply {
        string detail;
        uint goal;
        uint approveAmount;
        uint disapproveAmount;
        bool over;
        mapping(uint => uint) approve;
    }

    struct Fund {
        address payable initiator;
        string title;
        string detail;
        uint goal;
        uint endTime;
        bool isFinished;
        uint amount;
        uint applyAmount;
        uint numOfFunder;
        uint numOfApply;
        mapping(uint => Initiator) funders;
        mapping(uint => Apply) applies;
    }

    uint public numOfFunds;
    mapping(uint => Fund) public funds;

    function newFund(address payable initiator, string memory title, string memory detail, uint goal, uint endTime) public returns(uint) {
        require(endTime > block.timestamp);
        numOfFunds = numOfFunds + 1;
        Fund storage f = funds[numOfFunds];
        f.initiator = initiator;
        f.title = title;
        f.detail = detail;
        f.goal = goal;
        f.endTime = endTime;
        f.isFinished = false;
        f.amount = 0;
        f.numOfFunder = 0;
        f.numOfApply = 0;
        return numOfFunds;
    }

    function contribute(uint ID) public payable {
        require(msg.value > 0 && msg.value <= funds[ID].goal - funds[ID].amount);
        require(funds[ID].endTime > block.timestamp);
        require(funds[ID].isFinished == false);
        Fund storage f = funds[ID];
        f.amount += msg.value;
        f.numOfFunder = f.numOfFunder + 1;
        f.funders[f.numOfFunder].addr = msg.sender;
        f.funders[f.numOfFunder].amount = msg.value;
        f.isFinished = f.amount == f.goal;
    }

    function newApply(uint ID, uint goal, string memory detail) public {
        require(ID <= numOfFunds && ID >= 1);
        require(funds[ID].isFinished == true);
        require(goal <= funds[ID].amount);
        require(msg.sender == funds[ID].initiator);
        Fund storage f = funds[ID];
        f.numOfApply = f.numOfApply + 1;
        f.applies[f.numOfApply].detail = detail;
        f.applies[f.numOfApply].goal = goal;
        f.applies[f.numOfApply].approveAmount = 0;
        f.applies[f.numOfApply].disapproveAmount = 0;
        f.applies[f.numOfApply].over = false;
        f.applyAmount += goal;
    }

    function agreeApply(uint ID, uint applyID, bool approve) public {
        require(ID <= numOfFunds && ID >= 1);
        require(applyID <= funds[ID].numOfApply && applyID >= 1);
        require(funds[ID].applies[applyID].over == false);
        for(uint i = 1; i <= funds[ID].numOfFunder; i++)
            if(funds[ID].funders[i].addr == msg.sender) {
                if(funds[ID].applies[applyID].approve[i] == 1) {
                    funds[ID].applies[applyID].approveAmount -= funds[ID].funders[i].amount;
                } else if(funds[ID].applies[applyID].approve[i] == 2) {
                    funds[ID].applies[applyID].disapproveAmount -= funds[ID].funders[i].amount;
                }
                if(approve) {
                    funds[ID].applies[applyID].approveAmount += funds[ID].funders[i].amount;
                    funds[ID].applies[applyID].approve[i] = 1;
                }
                else {
                    funds[ID].applies[applyID].disapproveAmount += funds[ID].funders[i].amount;
                    funds[ID].applies[applyID].approve[i] = 2;
                }
            }
        if (funds[ID].applies[applyID].approveAmount >= funds[ID].goal / 2) {
            funds[ID].applies[applyID].over = true;
            funds[ID].applyAmount = funds[ID].applyAmount - funds[ID].applies[applyID].goal;
            funds[ID].amount = funds[ID].amount - funds[ID].applies[applyID].goal;
            funds[ID].initiator.transfer(funds[ID].applies[applyID].goal);
        }
        if (funds[ID].applies[applyID].disapproveAmount > funds[ID].goal / 2) {
            funds[ID].applyAmount = funds[ID].applyAmount - funds[ID].applies[applyID].goal;
            funds[ID].applies[applyID].over = true;
        }
    }

    function getApplyLength(uint ID) public view returns (uint) {
        require(ID <= numOfFunds && ID >= 1);
        return funds[ID].numOfApply;
    }

    function getApply(uint ID, uint applyID, address addr) public view returns (string memory, uint, uint, uint, bool, uint) {
        require(ID <= numOfFunds && ID >= 1);
        require(applyID <= funds[ID].numOfApply && applyID >= 1);

        Apply storage u = funds[ID].applies[applyID];
        uint approve = 0;
        for(uint i=1; i<=funds[ID].numOfFunder; i++) {
            if(funds[ID].funders[i].addr == addr) {
                approve = funds[ID].applies[applyID].approve[i];
                break;
            }
        }
        return (u.detail, u.goal, u.approveAmount, u.disapproveAmount, u.over, approve);
    }

    // 测试项目是否成功构建的函数
    function getUserAdd() public view returns (address) {
        return address(this);
    }

    function getMyFunds(address addr, uint ID) public view returns (uint) {
        uint res = 0;
        for(uint i=1; i<=funds[ID].numOfFunder; i++) {
            if(funds[ID].funders[i].addr == addr)
                res += funds[ID].funders[i].amount;
        }
        return res;
    }
}