// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Crowdfunding {
    address public owner;
    string projectAbstract;
    string projectDescription;
    uint startTime;
    uint endTime;
    uint riseAmount;
    uint currentAmount;
    bool isFinished = false;
    address[] participants;
    uint[] amounts;

    string BallotTitle;
    uint AgreeAmount;
    uint DisagreeAmount;
    mapping(address => uint) ballotAbility;
    mapping(address => int) balloted; // 没有投过票：0 反对：-1 同意：1

    // 构造函数 初始化众筹项目
    constructor(string memory _projAbstract, string memory _projectDescription, uint _startTime,
                uint _endTime, uint _riseAmount) public {
        owner = msg.sender;
        projectAbstract = _projAbstract;
        projectDescription = _projectDescription;
        startTime = _startTime;
        endTime = _endTime;
        riseAmount = _riseAmount;
        currentAmount = 0;
    }

    // 处理用户的投资行为
    function Parcipate(uint amount, address addr) public payable {
        // 判断此次投资之后众筹项目的状态
        currentAmount += amount;
        if(currentAmount >= riseAmount) {
            isFinished = true;
        }

        // 如果用户已经不是首次投资
        for(uint i = 0; i < participants.length; i++) {
            if(participants[i] == addr) {
                // 如果已经进行过投票，更新用户投票的权值
                if(balloted[addr] != 0) {
                    if(balloted[addr] < 0) {
                        DisagreeAmount += amount;
                    }
                    else {
                        AgreeAmount += amount;
                    }
                }
                ballotAbility[addr] += amount;
                amounts[i] += amount;
                return;
            }
        }

        // 如果用户是首次投资
        // 初始化用户状态
        participants.push(addr);
        amounts.push(amount);
        balloted[addr] = 0;
        ballotAbility[addr] = amount;
    }

    function ProjectStatus() public view returns(bool) {
        return isFinished;
    }

    // 获取项目的基本信息
    function GetProjectInfo() 
    public view returns(address, string memory, string memory, uint, uint, uint, uint, bool, address[] memory, uint[] memory) {
        return (owner,projectAbstract,projectDescription,startTime,
        endTime,riseAmount,currentAmount,isFinished,participants,amounts);
    }

    // 创建投票请求
    function CreateBallot(string memory title) public {
        BallotTitle = title;
    }

    // 处理投资人的同意请求
    function AgreeBallot(address addr) public {
        if(balloted[addr] == 0) {
            AgreeAmount += ballotAbility[addr];
            balloted[addr] = 1;
        }
    }

    // 处理投资人的否决请求
    function DisagreeBallot(address addr) public {
        if(balloted[addr] == 0) {
            DisagreeAmount += ballotAbility[addr];
            balloted[addr] = -1;
        }
    }

    function GetBallotStatus() public view returns(string memory, uint, uint, uint){
        return (BallotTitle, AgreeAmount, DisagreeAmount, currentAmount);
    }
}