// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CrowdFunding {

  // 投资者
  struct Investor {
    address payable addr;   // 投资人的地址
    uint amount;            // 出资数额
  }

  // 资金使用请求
  struct Use {
    string info;                     // 使用请求
    uint goal;                       // 请求数额
    uint agreeAmount;                // 目前的同意数额
    uint disagree;                   // 目前的不同意数额
    bool over;                       // 请求是否有结果
    mapping(uint => uint) agree;     // 出资人是否同意 0: 未决定，1：同意，2：不同意
  }

  // 众筹项目
  struct Funding {
    address payable initiator;       // 发起人
    string title;                    // 项目标题
    string info;                     // 项目介绍
    uint goal;                       // 目标金额
    uint endTime;                    // 截止时间
    bool success;                    // 是否成功
    uint amount;                     // 众筹中为已经筹集到的金额，成功后为项目剩余的钱
    uint numInvestors;               // 投资者数量
    uint numUses;                    // 使用请求数量
    mapping(uint => Investor) investors; // 投资记录具体信息
    mapping(uint => Use) uses;       // 所有的使用请求
  }

  uint public numFundings;                  // 众筹项目数量
  mapping(uint => Funding) public fundings; // 所有的众筹项目

  function newFunding(address payable initiator, string memory title, string memory info, uint goal, uint endTime) public returns(uint) {
    require(endTime > block.timestamp);

    numFundings = numFundings + 1;
    Funding storage fund = fundings[numFundings];
    fund.initiator = initiator;
    fund.title = title;
    fund.info = info;
    fund.goal = goal;
    fund.endTime = endTime;
    fund.success = false;
    fund.amount = 0;
    fund.numInvestors = 0;
    fund.numUses = 0;

    return numFundings;
  }

  function contribute(uint ID) public payable {
    require(fundings[ID].endTime > block.timestamp);
    require(msg.value > 0 && msg.value <= fundings[ID].goal - fundings[ID].amount);
    require(fundings[ID].success == false);

    Funding storage fund = fundings[ID];
    fund.amount += msg.value;
    fund.numInvestors = fund.numInvestors + 1;
    fund.investors[fund.numInvestors].addr = msg.sender;
    fund.investors[fund.numInvestors].amount = msg.value;

    fund.success = fund.amount >= fund.goal;
  }

  function newUse(uint ID, uint goal, string memory info) public {
    require(fundings[ID].success == true);
    require(ID <= numFundings && ID >= 1);
    require(goal <= fundings[ID].amount);
    require(msg.sender == fundings[ID].initiator);

    Funding storage fund = fundings[ID];
    fund.numUses = fund.numUses + 1;
    fund.uses[fund.numUses].info = info;
    fund.uses[fund.numUses].goal = goal;
    fund.uses[fund.numUses].agreeAmount = 0;
    fund.uses[fund.numUses].disagree = 0;
    fund.uses[fund.numUses].over = false;
  }

  function agreeUse(uint ID, uint useID, bool agree) public {
    require(ID <= numFundings && ID >= 1);
    require(useID <= fundings[ID].numUses && useID >= 1);
    require(fundings[ID].uses[useID].over == false);

    for(uint i=1; i<=fundings[ID].numInvestors; i++)
      if(fundings[ID].investors[i].addr == msg.sender) {
        if(fundings[ID].uses[useID].agree[i] == 1) {
          fundings[ID].uses[useID].agreeAmount -= fundings[ID].investors[i].amount;
        } else if(fundings[ID].uses[useID].agree[i] == 2) {
          fundings[ID].uses[useID].disagree -= fundings[ID].investors[i].amount;
        }
        if(agree) {
          fundings[ID].uses[useID].agreeAmount += fundings[ID].investors[i].amount;
          fundings[ID].uses[useID].agree[i] = 1;
        }
        else {
          fundings[ID].uses[useID].disagree += fundings[ID].investors[i].amount;
          fundings[ID].uses[useID].agree[i] = 2;
        }
      }

    if(fundings[ID].uses[useID].agreeAmount >= fundings[ID].goal / 2) {
      fundings[ID].amount = fundings[ID].amount - fundings[ID].uses[useID].goal;
      fundings[ID].uses[useID].over = true;
      fundings[ID].initiator.transfer(fundings[ID].uses[useID].goal);
    }
    if(fundings[ID].uses[useID].disagree > fundings[ID].goal / 2) {
      fundings[ID].uses[useID].over = true;
    }
  }

  function getUseLength(uint ID) public view returns (uint) {
    require(ID <= numFundings && ID >= 1);

    return fundings[ID].numUses;
  }

  function getUse(uint ID, uint useID, address addr) public view returns (string memory, uint, uint, uint, bool, uint) {
    require(ID <= numFundings && ID >= 1);
    require(useID <= fundings[ID].numUses && useID >= 1);

    Use storage u = fundings[ID].uses[useID];
    uint agree = 0;
    for(uint i=1; i<=fundings[ID].numInvestors; i++)
      if(fundings[ID].investors[i].addr == addr) {
        agree = fundings[ID].uses[useID].agree[i];
        break;
      }
    return (u.info, u.goal, u.agreeAmount, u.disagree, u.over, agree);
  }

  function getBalance() public view returns (uint) {
    return address(this).balance;
  }

  function getMyFundings(address addr, uint ID) public view returns (uint) {
      uint res = 0;
      for(uint i=1; i<=fundings[ID].numInvestors; i++) {
          if(fundings[ID].investors[i].addr == addr)
            res += fundings[ID].investors[i].amount;
      }
      return res;
  }
}