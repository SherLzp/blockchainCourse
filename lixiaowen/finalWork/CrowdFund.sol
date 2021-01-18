pragma solidity 0.7.4;

import 'https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol';
import "./Project.sol";
contract Crowdfunding{
    using SafeMath for uint256;
    
    uint public projectsnum=0;
    Project[] private projects;
    
    function openProject(
        string calldata title,
        string calldata description,
        uint need,
        uint duringdays
        )external{
            uint ddl = now.add(duringdays.mul(1 days));
            Project newpro= new Project(msg.sender,title,description,need,ddl);
            projects.push(newpro);
            projectsnum++;
        }
        
    function returnProjectsAdd() external view returns(Project[] memory){
        return projects;
    }
}

