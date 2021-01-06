// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Users {
    mapping(address => address[]) Projects;

    function AddProject(address user, address project) public {
        Projects[user].push(project);
    }

    function GetProject(address user) public view returns(address[] memory) {
        return Projects[user];
    }

}