// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Project.sol";

contract CrowdFunding {
    Project[] private projects;

    function createProject(
        string calldata title,
        string calldata description,
        uint256 call_deadline,
        uint256 target
    ) external {
        uint256 startTime = block.timestamp;
        uint256 deadline = call_deadline * 1 seconds;
        Project newProject = new Project(msg.sender, title, description, target, startTime, deadline);
        projects.push(newProject);
    }

    function getProjects() external view returns(Project[] memory){
        return projects;
    }
}
