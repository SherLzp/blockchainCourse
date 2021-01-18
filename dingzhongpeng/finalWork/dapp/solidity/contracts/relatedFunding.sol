pragma solidity 0.4.24;

//与某个用户相关的所有众筹项目
contract relatedFundings{
    mapping(address => address[]) Fundings;
    function setFunding(address user,address funding) public {
        Fundings[user].push(funding);
    }
    function getFunding(address user)public view returns(address [] memory ){
        return Fundings[user];
    }
}