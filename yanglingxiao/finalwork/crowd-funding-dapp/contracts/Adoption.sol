pragma solidity ^0.4.24;

contract Adoption {

  address[16] public adopters;  // 保存购买者的地址
  uint[16] public volume = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  uint[16] public thelike = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  // 购买众筹产品
  function adopt(uint petId) public returns (uint) {
    require(petId >= 0 && petId <= 15);  // 确保id在数组长度内

    adopters[petId] = msg.sender;        // 保存调用者地址 
    volume[petId]++;
    return petId;
  }



  // 返回购买者
  function getAdopters() public view returns (address[16]) {
    return adopters;
  }

  function getVolume() public view returns (uint[16]) {
    return volume;
  }

}