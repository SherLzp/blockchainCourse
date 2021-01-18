pragma solidity ^0.4.24;

contract Like {

  address[16] public adopters;  // 保存支持者的地址
  uint[16] public thelike = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  // 支持众筹产品


  function thelike(uint petId) public returns (uint) {
    require(petId >= 0 && petId <= 15);  // 确保id在数组长度内

    adopters[petId] = msg.sender;        // 保存调用者地址 
    thelike[petId]++;
    return petId;
  }

  function getlike() public view returns (uint[16]) {
    return thelike;
  }


  // 返回领养者
  function getAdopters() public view returns (address[16]) {
    return adopters;
  }


}