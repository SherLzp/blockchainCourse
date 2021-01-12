// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Crowdfunding {
    // 投资记录
    struct Fund {
        uint256 money; // 投资数额
        address payable funderAddr; // 投资人地址
    }

    // 使用记录
    struct Use {
        uint256 money; // 提取数额
        uint256 agreeMoney; // 初始值为筹款总数，同意票将增加其值，否定票将减少其值
        bool isFinished; // true表示成功
        string reason; // 使用资金申请理由
    }
    // 众筹项目
    struct Project {
        uint256 need; // 需要筹集的总金额，若筹款成功且筹款大于原始need，need将被更新
        uint256 curFund; // 当前筹集的金额
        uint256 deadLine; // 项目结束时间
        uint256 fundListLen; // 出资记录数
        uint256 useListLen; // 使用记录数
        bool isFinished; // true表示众筹已完成，false表示未完成
        address payable caller; // 项目召集发起人
        string name; // 项目名称
        string info; // 项目简介
        mapping(uint256 => Fund) fundList;
        mapping(uint256 => Use) useList;
    }

    mapping(uint256 => Project) public globalProjList;
    uint256 public globalProjListLen; // 众筹项目总数量

    function createProject(
        address payable caller,
        string memory name,
        string memory info,
        uint256 need,
        uint256 ddl
    ) public {
        // 约束条件：申请钱数大于0
        require(need > 0);
        // 约束条件：截止日期在未来
        require(ddl > block.timestamp);

        globalProjListLen += 1;
        Project storage p = globalProjList[globalProjListLen];
        p.need = need;
        p.curFund = 0;
        p.deadLine = ddl;
        p.fundListLen = 0;
        p.useListLen = 0;
        p.isFinished = false;
        p.caller = caller;
        p.name = name;
        p.info = info;
    }

    function fund(uint256 idx) public payable {
        // 约束条件：idx合法，该众筹项目存在
        require(idx >= 1 && idx <= globalProjListLen);
        // 约束条件：投资必须大于0，允许超额
        require(msg.value > 0);
        // 约束条件：项目必须未截止
        require(block.timestamp < globalProjList[idx].deadLine);
        // 约束条件：项目必须未完成
        require(!globalProjList[idx].isFinished);

        Project storage p = globalProjList[idx];
        p.curFund += msg.value;
        p.fundListLen += 1;
        Fund storage f = p.fundList[p.fundListLen];
        f.funderAddr = msg.sender;
        f.money = msg.value;

        // 判断是否完成筹资
        if (p.curFund >= p.need) {
            p.isFinished = true;
            p.need = p.curFund; // 更新need为历史最大值
        }
    }

    function getTotFundingOf(address funder, uint256 idx)
        public
        view
        returns (uint256)
    {
        // 约束条件：idx合法，该众筹项目存在
        require(idx >= 1 && idx <= globalProjListLen);
        uint256 myFunding = 0;
        Project storage p = globalProjList[idx];
        for (uint256 i = 1; i <= p.fundListLen; i++) {
            if (p.fundList[i].funderAddr == funder)
                myFunding += p.fundList[i].money;
        }
        return myFunding;
    }

    function withdraw(uint256 idx) public payable {
        // 约束条件：idx合法，该众筹项目存在
        require(idx >= 1 && idx <= globalProjListLen);
        // 约束条件：项目必须未完成
        require(!globalProjList[idx].isFinished);

        Project storage p = globalProjList[idx];
        for (uint256 i = 1; i <= p.fundListLen; i++) {
            if (p.fundList[i].funderAddr == msg.sender) {
                p.fundList[i].funderAddr.transfer(p.fundList[i].money);
                p.curFund -= p.fundList[i].money;
                p.fundList[i].money = 0;
                break;
            }
        }
    }

    function createUse(
        uint256 idx,
        uint256 money,
        string memory reason
    ) public {
        // 约束条件：idx合法
        require(idx >= 1 && idx <= globalProjListLen);
        // 约束条件：项目已完成
        require(globalProjList[idx].isFinished);
        // 约束条件：申请金额大于0，小于等于余额
        require(money > 0 && money <= globalProjList[idx].curFund);
        // 约束条件：申请人是发起人
        require(msg.sender == globalProjList[idx].caller);

        Project storage p = globalProjList[idx];
        p.useListLen += 1;
        Use storage u = p.useList[p.useListLen];
        u.money = money;
        u.reason = reason;
        u.agreeMoney = p.need; // 初始值为need，同意票将增加其值，否定票将减少其值
        u.isFinished = false;
    }

    function agreeUse(
        uint256 idx,
        uint256 uidx,
        bool agree
    ) public {
        // 约束条件：idx合法
        require(idx >= 1 && idx <= globalProjListLen);
        // 约束条件：uidx合法
        require(uidx >= 1 && uidx <= globalProjList[idx].useListLen);
        // 约束条件：使用请求未批准
        require(!globalProjList[idx].useList[uidx].isFinished);

        Project storage p = globalProjList[idx];
        for (uint256 fidx = 1; fidx < p.fundListLen; fidx++) {
            // 资助者才能投票
            if (p.fundList[fidx].funderAddr == msg.sender) {
                Use storage u = p.useList[uidx];
                if (agree) {
                    u.agreeMoney += p.fundList[fidx].money;
                } else {
                    u.agreeMoney -= p.fundList[fidx].money;
                }

                // 检查是否已经合格
                if (u.agreeMoney > (p.need * 3) / 2) {
                    u.isFinished = true;
                    // 若批准则转钱
                    p.curFund -= u.money;
                    p.caller.transfer(u.money);
                }
                break;
            }
        }
    }
}
