// SPDX-License-Identifier: MIT
pragma solidity 0.4.24;
import './Funding.sol';

contract FundingFactory{
    address public manager;
    address [] allFundings;
    //某人创建的所有众筹
    mapping(address=>address[]) public createdFundings;
    relatedFundings related = new relatedFundings();
    
    constructor()public{
        manager = msg.sender;
    }
    
    function createFunding(string memory _projectName,uint256 _targetMoney,uint256 _duration,address _creator) public{
        address funding = new Funding(_projectName, _targetMoney, _duration,_creator,related);
        allFundings.push(funding);
        if(createdFundings[_creator].length == 0){
            createdFundings[_creator] = new address[](10);
        }
        createdFundings[_creator].push(funding);
    }
    
    function getAllFundings()public view returns(address [] memory){
        return allFundings;
    }
    function getCreatedFundings(address user)public view returns(address [] memory){
        return createdFundings[user];
    }
    function getRelatedFundings(address user)view public returns(address [] memory){
        return related.getFunding(user);
    }
    function deleteFunding(address funding) public {
        for(uint i = 0;i<allFundings.length;i++){
            if(allFundings[i] == funding){
                allFundings[i] = allFundings[allFundings.length-1];
                allFundings.length = allFundings.length-1;
                break;
            }
        }
    }
}

