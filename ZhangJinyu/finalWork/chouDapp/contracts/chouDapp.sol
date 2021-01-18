// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract chouDapp {

    uint public projectsAmount; // 众筹项目数量
    
    // 投资人
    struct Funder {
        address payable identity;   // 身份地址
        uint amount;    // 投资金额
    }

    // 项目资金使用情况
    struct Withdrawal {
        string purpose; // 使用目的
        uint amount;    // 使用金额
        uint agree; // 同意投票权占比
        uint disagree;  // 不同意投票权占比
        mapping(uint => uint) votes;    // 投资人投票情况清单：0表示未投票，1表示同意，2表示反对
        bool isEnd; // 请求是否已被处理标记
    }

    // 众筹项目
    struct Project {
        string title;   // 项目概述
        string introduction;    // 项目简介
        address payable initiator;  // 众筹发起人
        mapping(uint => Funder) funders;    // 该项目的投资人名单
        uint fundersAmount; // 投资人数
        uint endTime;   // 众筹截止时间
        uint target;    // 众筹目标金额
        uint raised;    // 已筹集金额
        bool isSuccess; // 是否成功标记
        mapping(uint => Withdrawal) withdrawals;  // 资金使用清单
        uint withdrawalsAmount; // 资金使用数
    }

    mapping(uint => Project) public projects;   // 众筹项目清单

    // 发起众筹 
    function launch(string memory title, string memory introduction, address payable initiator, uint endTime, uint target) public returns(uint) {
        require(endTime > block.timestamp, "End time before current time"); // 截止时间必须在当前时刻之后
        projectsAmount += 1;
        Project storage fundProject = projects[projectsAmount];
        fundProject.title = title;
        fundProject.introduction = introduction;
        fundProject.initiator = initiator;
        fundProject.fundersAmount = 0;
        fundProject.endTime = endTime;
        fundProject.target = target;
        fundProject.raised = 0;
        fundProject.isSuccess = false;
        fundProject.withdrawalsAmount = 0;
        return projectsAmount;
    }

    // 进行投资
    function fund(uint projectIdentity) public payable {
        require(projectIdentity <= projectsAmount && projectIdentity >= 1, "Illegal project identity"); // 项目代号要合法
        require(projects[projectIdentity].endTime > block.timestamp && !projects[projectIdentity].isSuccess, "The project is closed");  // 项目必须正在筹集中
        require(msg.value > 0 && msg.value <= projects[projectIdentity].target - projects[projectIdentity].raised, "Fund amount is out of range"); // 投资金额须大于0且投资后不能超出众筹目标金额
        Project storage fundProject = projects[projectIdentity];
        fundProject.raised += msg.value;
        // 检查该投资者是否曾经投资过
        bool hasFunded = false;
        for(uint i = 1; i <= fundProject.fundersAmount; i++) {
            // 若投资过则直接在原有记录上更新投资数额即可
            if(fundProject.funders[i].identity == /*payable(*/msg.sender)/*)*/ {
                fundProject.funders[i].amount += msg.value;
                hasFunded = true;
                break;
            }
        }
        // 若未投资过则需要在投资人名单中新建
        if(!hasFunded) {
            fundProject.fundersAmount += 1;
            fundProject.funders[fundProject.fundersAmount].identity = /*payable(*/msg.sender/*)*/;  // 0.8.0版本新特性，低于0.8.0则不需要
            fundProject.funders[fundProject.fundersAmount].amount = msg.value;
        }       
        fundProject.isSuccess = fundProject.raised >= fundProject.target;
    }

    // 退还资金
    function refund(uint projectIdentity) public payable {
        require(projectIdentity <= projectsAmount && projectIdentity >= 1, "Illegal project identity"); // 项目代号要合法
        require(projects[projectIdentity].endTime <= block.timestamp && !projects[projectIdentity].isSuccess, "The project has not failed");  // 项目截止后未筹集到足够资金才会退还
        Project storage fundProject = projects[projectIdentity];
        for(uint i = 1; i <= fundProject.fundersAmount; i++) {
            if(fundProject.funders[i].identity == /*payable(*/msg.sender/*)*/) {
                fundProject.funders[i].identity.transfer(fundProject.funders[i].amount);
                fundProject.funders[i].amount = 0;
                fundProject.raised -= fundProject.funders[i].amount;
            }
        }
    }

    // 请求使用资金
    function requestWithdrawal(uint projectIdentity, string memory purpose, uint amount) public {
        require(projectIdentity <= projectsAmount && projectIdentity >= 1, "Illegal project identity"); // 项目代号要合法
        require(projects[projectIdentity].isSuccess, "The project has not succeeded");  // 项目截止后筹集到足够资金才可以使用
        require(amount <= projects[projectIdentity].raised, "Raised money is not enough");  // 使用金额必须小于筹集到金额
        require(/*payable(*/msg.sender/*)*/ == projects[projectIdentity].initiator, "Withdrawer is not the initiator");  // 只有发起人才能申请使用资金
        Project storage fundProject = projects[projectIdentity];
        fundProject.withdrawalsAmount += 1;
        fundProject.raised -= amount;
        fundProject.withdrawals[fundProject.withdrawalsAmount].purpose = purpose;
        fundProject.withdrawals[fundProject.withdrawalsAmount].amount = amount;
        fundProject.withdrawals[fundProject.withdrawalsAmount].agree = 0;
        fundProject.withdrawals[fundProject.withdrawalsAmount].disagree = 0;
        fundProject.withdrawals[fundProject.withdrawalsAmount].isEnd = false; 
    }

    // 检查是否过半数投票权同意
    function checkHalfAgreed(uint projectIdentity, uint withdrawalIdentity) public {
        require(projectIdentity <= projectsAmount && projectIdentity >= 1, "Illegal project identity"); // 项目代号要合法
        require(withdrawalIdentity <= projects[projectIdentity].withdrawalsAmount && withdrawalIdentity >= 1, "Illegal withdrawal identity"); // 使用请求代号要合法
        if(projects[projectIdentity].withdrawals[withdrawalIdentity].agree >= projects[projectIdentity].target / 2) {
            projects[projectIdentity].withdrawals[withdrawalIdentity].isEnd = true;
            projects[projectIdentity].initiator.transfer(projects[projectIdentity].withdrawals[withdrawalIdentity].amount);
        }
        if(projects[projectIdentity].withdrawals[withdrawalIdentity].disagree >= projects[projectIdentity].target / 2) {
            projects[projectIdentity].raised += projects[projectIdentity].withdrawals[withdrawalIdentity].amount;
            projects[projectIdentity].withdrawals[withdrawalIdentity].isEnd = true;
        }
    }

    // 投资人投票
    function vote(uint projectIdentity, uint withdrawalIdentity, bool isAgree) public {
        require(projectIdentity <= projectsAmount && projectIdentity >= 1, "Illegal project identity"); // 项目代号要合法
        require(withdrawalIdentity <= projects[projectIdentity].withdrawalsAmount && withdrawalIdentity >= 1, "Illegal withdrawal identity"); // 使用请求代号要合法
        require(!projects[projectIdentity].withdrawals[withdrawalIdentity].isEnd, "Withdrawal request is closed");   // 使用请求必须仍在进行中
        for(uint i = 1; i <= projects[projectIdentity].fundersAmount; i++) {
            if(projects[projectIdentity].funders[i].identity == /*payable(*/msg.sender/*)*/) {
                // 该投资人未投过票，直接更新该资金使用情况信息
                if(projects[projectIdentity].withdrawals[withdrawalIdentity].votes[i] == 0) {
                    if(isAgree) {
                        projects[projectIdentity].withdrawals[withdrawalIdentity].agree += projects[projectIdentity].funders[i].amount;
                        projects[projectIdentity].withdrawals[withdrawalIdentity].votes[i] = 1;
                    }
                    else {
                        projects[projectIdentity].withdrawals[withdrawalIdentity].disagree += projects[projectIdentity].funders[i].amount;
                        projects[projectIdentity].withdrawals[withdrawalIdentity].votes[i] = 2;
                    }
                }
                // 该投资人先前投的同意票，若改成反对则要更改
                else if(projects[projectIdentity].withdrawals[withdrawalIdentity].votes[i] == 1) {
                    if(!isAgree) {
                        projects[projectIdentity].withdrawals[withdrawalIdentity].agree -= projects[projectIdentity].funders[i].amount;
                        projects[projectIdentity].withdrawals[withdrawalIdentity].disagree += projects[projectIdentity].funders[i].amount;
                        projects[projectIdentity].withdrawals[withdrawalIdentity].votes[i] = 2;
                    }                   
                }
                // 该投资人先前投的反对票，若改成同意则要更改
                else if(projects[projectIdentity].withdrawals[withdrawalIdentity].votes[i] == 2) {
                    if(isAgree) {
                        projects[projectIdentity].withdrawals[withdrawalIdentity].disagree -= projects[projectIdentity].funders[i].amount;
                        projects[projectIdentity].withdrawals[withdrawalIdentity].agree += projects[projectIdentity].funders[i].amount;
                        projects[projectIdentity].withdrawals[withdrawalIdentity].votes[i] = 1;
                    }     
                }
            }
        }
        checkHalfAgreed(projectIdentity, withdrawalIdentity);
    }

    // 获取资金使用申请数目
    function getWithdrawalsAmount(uint projectIdentity) public view returns(uint) {
        require(projectIdentity <= projectsAmount && projectIdentity >= 1, "Illegal project identity"); // 项目代号要合法
        return projects[projectIdentity].withdrawalsAmount;
    }

    // 获取投资人对某一资金使用申请的投票情况
    function getMyWithdrawalVote(uint projectIdentity, uint withdrawalIdentity, address identity) public view returns(string memory, uint, uint, uint, bool, uint) {
        require(projectIdentity <= projectsAmount && projectIdentity >= 1, "Illegal project identity"); // 项目代号要合法
        require(withdrawalIdentity <= projects[projectIdentity].withdrawalsAmount && withdrawalIdentity >= 1, "Illegal withdrawal identity"); // 使用请求代号要合法
        Withdrawal storage fundWithdrawal = projects[projectIdentity].withdrawals[withdrawalIdentity];
        uint fundVote = 0;
        for(uint i = 1; i <= projects[projectIdentity].fundersAmount; i++) {
            if(projects[projectIdentity].funders[i].identity == identity) {
                fundVote = projects[projectIdentity].withdrawals[withdrawalIdentity].votes[i];
                break;
            }
        }
        return (fundWithdrawal.purpose, fundWithdrawal.amount, fundWithdrawal.agree, fundWithdrawal.disagree, fundWithdrawal.isEnd, fundVote);
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    // 获取投资人对某一资金的投资情况 
    function getMyFund(address identity, uint projectIdentity) public view returns(uint) {
        uint res = 0;
        for(uint i = 1; i <= projects[projectIdentity].fundersAmount; i++) {
            if(projects[projectIdentity].funders[i].identity == identity) {
                res = projects[projectIdentity].funders[i].amount;
                break;
            }
        }
        return res;
    } 
}