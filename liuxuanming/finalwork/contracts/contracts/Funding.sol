pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract Funding {

    // 使用请求信息
    struct Use {
        string useDescription;              // 使用说明
        uint   amount;                      // 请求使用的金额
        uint   agreeAmount;                 // 同意的钱，以太坊不太好进行浮点数计算，所以用整形进行表示
        uint   disagreeAmount;              // 不同意的钱，以太坊不太好进行浮点数计算，所以用整形进行表示
        uint   numVote;                     // 投票数量
        uint[] agree;                       // 从用户序号到是否同意的状态映射
        // 0 没投过票
        // 1 投票同意
        // 2 投票不同意
    }

    // 项目信息
    struct Campaign {
        // 构造函数填充
        string projectName;                 // 项目名
        string projectDescription;          // 项目描述
        address payable manager;            // 发起者
        uint targetMoney;                   // 目标筹集金额
        uint durTime;                       // 项目结束时间，单位天

        uint startTime;                     // 项目开始时间
        uint endTime;                       // 项目结束时间
        uint collectedMoney;                // 收集到的金额
        uint numFunders;                    // 参与成员的数量

        uint state;                         /**
                                             * 给合约建立一个状态机：
                                             * 0：合约刚刚建立，正在进行募集
                                             * 1：合约失败（因为超时且没有募集完或者发起请求但是被验证失败）
                                             * 2：合约成功（募集成功而且使用成功）
                                             * 3：合约在规定时间内募集成功，还没发起使用
                                             * 4：发起了使用请求，正在接受请求
                                             */

        address payable[] funders;                  // 参与成员的地址
        uint[]    amount;                   // 参与者贡献的金额
    }

    uint public numCampaigns;                      // 众筹项目的数量
    mapping (uint => Campaign) public campaigns;   // 众筹项目的信息
    mapping (uint => Use) public uses;             // 因为结构体内嵌不能成功编译，所以将Use单独拿出来

    function newCampaign(string memory name, string memory desc, address payable manager, uint target, uint dur) public
    returns (uint) {
        require(dur > 0);
        // campaignID 作为一个变量返回
        uint campaignID = numCampaigns++;

        address payable[] memory funders;
        uint[] memory amount;
        Campaign memory c = Campaign({
        projectName: name,
        projectDescription: desc,
        manager: manager,
        targetMoney: target * 1 ether,
        durTime: dur,
        startTime: now,
        endTime: now + dur * 1 days,
        collectedMoney: 0 * 1 ether,
        numFunders: 0,
        state: 0,
        funders: funders,
        amount: amount
        });
        campaigns[campaignID] = c;

        uint[] memory agree;
        uses[campaignID] = Use({
        useDescription: "Please set Use Description.",
        amount: 0,
        agreeAmount: 0,
        disagreeAmount: 0,
        numVote: 0,
        agree: agree
        });
        return campaignID;
    }

    function contribute(uint campaignID) public payable {
        // ID必须在范围内
        require(campaignID < numCampaigns && campaignID >= 0);
        // 贡献的钱必须大于0，而且不能超过差额
        require(msg.value > 0 && msg.value <= campaigns[campaignID].targetMoney - campaigns[campaignID].collectedMoney);
        // 时间上必须还没结束
        require(campaigns[campaignID].endTime > now);
        // 必须还没有收集成功
        require(campaigns[campaignID].state == 0);

        Campaign storage c = campaigns[campaignID];
        Use storage u = uses[campaignID];
        // 使用权数量增加
        u.agree.push(0);    // 初始为没投票过
        // 投资者数量增加
        c.funders.push(msg.sender);
        c.numFunders++;
        c.amount.push(msg.value);
        // 已收集的资金增加
        c.collectedMoney += msg.value;

        // 是否满足了金额，更改状态
        if(c.collectedMoney >= c.targetMoney)
            c.state = 3;

    }

    function setUse(uint campaignID, uint amount, string memory desc) public {
        require(campaignID < numCampaigns && campaignID >= 0);
        require(campaigns[campaignID].state == 3);
        require(campaigns[campaignID].manager == msg.sender); // 必须是发起者使用
        require(campaigns[campaignID].targetMoney >= amount); // 使用的金额小于总共

        Campaign storage c = campaigns[campaignID];
        Use storage u = uses[campaignID];
        // 设置use的信息
        u.useDescription = desc;
        u.amount = amount * 1 ether;
        // 状态改变
        c.state = 4;
    }

    function agreeUse(uint campaignID, bool agree) public {
        Campaign storage c = campaigns[campaignID];
        Use storage u = uses[campaignID];

        require(campaignID < numCampaigns && campaignID >= 0);
        require(c.state == 4);

        for(uint i = 0; i < c.numFunders; i++) {
            // 该用户参与了出资
            if(msg.sender == c.funders[i]) {
                require(u.agree[i] == 0);

                if(u.agree[i] == 0) {
                    u.numVote++;
                    // 用户同意
                    if(agree == true) {
                        u.agree[i] = 1;
                        u.agreeAmount += c.amount[i];
                    }
                    // 用户不同意
                    else {
                        u.agree[i] = 2;
                        u.disagreeAmount += c.amount[i];
                    }

                    // 检查此时是否过半
                    if(u.agreeAmount >= c.collectedMoney / 2) {
                        c.state = 2;
                        // 使用成功，给经理人打钱
                        c.manager.transfer(u.amount);
                    }
                    if(u.disagreeAmount >= c.collectedMoney / 2) {
                        c.state = 1;
                        // 使用失败，退钱
                        refund(campaignID);
                    }
                }
            }
        }
    }

    // 返回该项目所有参与者
    function getInvestors(uint campaignID) public view returns(address payable[] memory) {
        Campaign storage c = campaigns[campaignID];
        address payable[] storage funders = c.funders;
        return funders;
    }

    // 返回该项目所有投票
    function getVotes(uint campaignID) public view returns(uint[] memory) {
        Use storage u = uses[campaignID];
        uint[] storage agrees = u.agree;
        return agrees;
    }

    function refund(uint campaignID) public {
        Campaign storage c = campaigns[campaignID];
        for (uint i = 0; i < c.numFunders; i++) {
            c.funders[i].transfer(c.amount[i]);
        }
    }
}
