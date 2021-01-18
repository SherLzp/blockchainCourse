//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22;


contract CrowdFunding {
 
  struct Project {
    address payable initiator;
    string info;
    string title;
    string start_date;
    string end_date;
  }
  
  struct Funder {
    address payable addr;
    uint amount;
    string Fname;
    uint amountN;
  }

  event del_msg(
    string return_msg,
    uint count
  );

  event success_msg(
    string return_msg,
    uint count
  );

  event error_msg(
    string return_msg,
    uint c
  );
  // 资金使用
  struct Use {
    string info;
    uint goal;
    uint agreeAmount;
    uint disagreeAmount;
    uint disagree;
    string account;
    bool over;
    mapping(uint => uint) agree;
  }

  // 项目结构
  struct Funding {
    address payable initiator;
    string title;
    string info;
    bool success;
    uint amount;
    uint numFunders;
    uint numUses;
    uint current;
    uint goal;                    
    uint startTime;
    uint endTime;
    mapping(uint => Project) projects;
    mapping(uint => Funder) funders; 
    mapping(uint => Use) uses;       
  }

  uint public fundingsCount; // 记录项目数量
  mapping(uint => Funding) public fundings; 

  //统一定义临时变量
  Funding tempFunding;
  Use tempUse;
  Project tempProject;

 function newFunding(address payable a, string memory b, string memory c, uint d, uint e, uint f) public returns(uint) {
    require(f > block.timestamp);

    fundingsCount = fundingsCount + 1;
    Funding storage ff = fundings[fundingsCount];
    ff.initiator = a;
    ff.title = b;
    ff.info = c;
    ff.goal = d;
    ff.startTime = e;
    ff.endTime = f;
    ff.success = false;
    ff.amount = 0;
    ff.numFunders = 0;
    ff.numUses = 0;
    
    return fundingsCount;
  }

   function returnMoney(uint p) public returns(uint){
    require(p <= fundingsCount && p >= 1);
    require(fundings[p].success == false);

    Funding storage f = fundings[p];
    uint i = 1;
    while(i <= f.numFunders){
      if(f.funders[i].addr == msg.sender) {
        f.funders[i].addr.transfer(f.funders[i].amount);
        f.funders[i].amount = 0;
        f.amount -= f.funders[i].amount;
      }
      i++;
    }
    return i;
  }

  



  function deleteFunding(address payable a, string memory b, string memory c, uint d, uint e, uint f) public returns(uint) {
    require(f > block.timestamp);

    fundingsCount--;
    Funding storage ff = fundings[fundingsCount];
    ff.initiator = a;
    ff.title = b;
    ff.info = c;
    ff.goal = d;
    ff.startTime = e;
    ff.endTime = f;
    ff.success = false;
    ff.amount = 0;
    ff.numFunders = 0;
    ff.numUses = 0;
    
    return fundingsCount;
  }

function Apply(uint index, uint goal, string memory info) public {
    require(index <= fundingsCount && index >= 1);
    require(fundings[index].success == true);
    require(goal <= fundings[index].amount);
    require(msg.sender == fundings[index].initiator);

    Funding storage f = fundings[index];
    f.numUses = f.numUses + 1;
    f.uses[f.numUses].info = info;
    f.uses[f.numUses].goal = goal;
    f.uses[f.numUses].agreeAmount = 0;
    f.uses[f.numUses].disagree = 0;
    f.uses[f.numUses].over = false;
    f.amount = f.amount - goal;
  }


  function giveBack(uint index) public {
    require(index <= fundingsCount && index >= 1);

    Funding storage f = fundings[index];
    uint i = 1;
    while(i <= f.numFunders){
      if(f.funders[i].addr == msg.sender) {
        f.funders[i].addr.transfer(f.funders[i].amount);
        f.funders[i].amount = 0;
        f.amount -= f.funders[i].amount;
      }
      i++;
    }
  }

  function contribute(uint index) public payable {

    require(msg.value > 0 && msg.value <= fundings[index].goal - fundings[index].amount);
    require(fundings[index].endTime > block.timestamp);
    require(fundings[index].success == false);

    Funding storage f = fundings[index];
    f.amount += msg.value;
    f.numFunders = f.numFunders + 1;
    f.funders[f.numFunders].addr = msg.sender;
    f.funders[f.numFunders].amount = msg.value;
    f.success = f.amount >= f.goal;
  }

  function newUse1(uint index, uint goal, string memory info) public {
    require(index <= fundingsCount && index >= 1);
    require(fundings[index].success == true);
    require(goal <= fundings[index].amount);
    require(msg.sender == fundings[index].initiator);

    Funding storage f = fundings[index];
    f.numUses = f.numUses + 1;
    f.uses[f.numUses].info = info;
    f.uses[f.numUses].goal = goal;
    f.uses[f.numUses].agreeAmount = 0;
    f.uses[f.numUses].disagree = 0;
    f.uses[f.numUses].over = false;
    f.amount = f.amount - goal;
  }

  function agreeUse(uint index, uint useID, bool res) public {
    require(index <= fundingsCount && index >= 1);
    require(useID <= fundings[index].numUses && useID >= 1);
    require(fundings[index].uses[useID].over == false);

    for(uint i=1; i<=fundings[index].numFunders; i++)
      if(fundings[index].funders[i].addr == msg.sender) {
        if(fundings[index].uses[useID].agree[i] == 1) {
          fundings[index].uses[useID].agreeAmount -= fundings[index].funders[i].amount;
        } else if(fundings[index].uses[useID].agree[i] == 2) {
          fundings[index].uses[useID].disagree -= fundings[index].funders[i].amount;
        }
        if(res) {
          fundings[index].uses[useID].agreeAmount += fundings[index].funders[i].amount;
          fundings[index].uses[useID].agree[i] = 1;
        }
        else {
          fundings[index].uses[useID].disagree += fundings[index].funders[i].amount;
          fundings[index].uses[useID].agree[i] = 2;
        }
      }
    checkUse(index, useID);
  }

  function checkUse(uint index, uint useID) public {
    require(index <= fundingsCount && index >= 1);
    require(fundings[index].uses[useID].over == false);

    if(fundings[index].uses[useID].agreeAmount >= fundings[index].goal / 2) {
      fundings[index].uses[useID].over = true;
      fundings[index].initiator.transfer(fundings[index].uses[useID].goal);
    }
    if(fundings[index].uses[useID].disagree > fundings[index].goal / 2) {
      fundings[index].uses[useID].over = true;
      fundings[index].amount = fundings[index].amount + fundings[index].uses[useID].goal;
    }
  }

  function getUseLength(uint index) public view returns (uint) {
    require(index <= fundingsCount && index >= 1);

    return fundings[index].numUses;
  }

  function getMyFundings(address addr, uint index) public view returns (uint) {
      uint mine = 0;
      uint i=1;
      while(i<=fundings[index].numFunders){
        if(fundings[index].funders[i].addr == addr)
            mine += fundings[index].funders[i].amount;
        i++;
      }
      return mine;
  } 

  function getUse(uint index, uint useID, address addr) public view returns (string memory, uint, uint, uint, bool, uint) {
    require(index <= fundingsCount && index >= 1);
    require(useID <= fundings[index].numUses && useID >= 1);

    Use storage u = fundings[index].uses[useID];
    uint agree = 0;
    uint i = 1;
    while( i<=fundings[index].numFunders ){
        if(fundings[index].funders[i].addr == addr) {
        agree = fundings[index].uses[useID].agree[i];
        break;
      }
      i++;
    }
    return (u.info, u.goal, u.agreeAmount, u.disagree, u.over, agree);
  }

 function getBalance() public view returns (uint) {
    return address(this).balance;
  }
}

//众筹信息公共操作
contract Fund{
    address payable initiator; //创始人
    string info;
    string title;
    uint goal; //目标金额
    uint current; //当前金额
    string start_date;
    string end_date;
    address[] all_account; //所有账户

    //账户信息
    struct account{
      string account_id;
      mapping (uint => bool) is_fund;  //记录该账户是否投资
      uint ammount; //出资
    }

    //定义使用请求结构
    struct Use{
      string info;
      uint ammount;
      bool success;
    }

    //定义fund结构
    struct crowdFund{
      string name;
      string intro;
      string start;
      string end;
      bool success;
      uint goal;
      uint current;
      string account_name;
      string[] amount_account; //参与该众筹账户
    }

    crowdFund F;


    //删除某个众筹
    function deleteFund(uint fgoal ,uint fcurrent ,bool success,string memory fname,string memory cname)public returns(uint){
      require(goal > block.timestamp);
      uint i = 1;
      while(i <= goal){
        F.name = fname;
        F.goal = fgoal;
        F.current = fcurrent;
        F.success = success;
        F.start = cname;
        i++;
      }
      return i;
    }


}