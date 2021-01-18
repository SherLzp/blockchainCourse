// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ProjectManager {
    address[] projects;
    mapping(address=>address[]) projectDic;

    function InsertProj(address user, address project) public {
        projectDic[user].push(project);
        projects.push(project);
    }

    function GetProjByAddr(address user) public view returns(address[] memory){
        return projectDic[user];
    }

    function GetAllProj() public view returns(address[] memory) {
        return projects;
    }
}