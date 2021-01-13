// SPDX-License-Identifier: GPL3.0
pragma solidity >=0.4.25 <0.9.0;
pragma experimental ABIEncoderV2;

  struct Fund {
    uint id;
    address payable starter;
    address payable beneficiary;
    uint256 goal;
    uint256 sum;
    address payable[] funders;
    uint[] money;
    bool isIssued;
    bool isTransfered;
  }

contract Funding {


  Fund[] funds;


  // constructor() public {
  //     // manager = msg.sender;
  // }

  function newFunding(address payable beneficiary,uint goal)public returns (uint id){
    require(goal>1);
    id = funds.length;
    // new fund item
    funds.push(Fund(id,msg.sender,beneficiary,goal,0,new address payable[](0),new uint[](0),false,false));
  }

  // 返回总钱数
  function contribute(uint fundId)public payable validId(fundId) {
    require(msg.value>=1 wei);
    require(fundId<funds.length);
    funds[fundId].funders.push(msg.sender);
    funds[fundId].money.push(msg.value);
    funds[fundId].sum+=msg.value; // is a integer
  }

  function issue(uint id)public validId(id){
    require(funds[id].sum>=funds[id].goal);
    funds[id].isIssued = true;
  }


  function vote(uint id)public{

  }

  modifier validId(uint id){
    require(id<funds.length);
    _;
  }


  function getFunds(uint id) public view returns(Fund memory){
    return funds[id];
  }

  function getFundNum() public view returns(uint){
    return funds.length;
  }

  function getBalance() public view returns (uint256){
    return address(this).balance;
  }


}
