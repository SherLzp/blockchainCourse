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
        uint8 status; // 0:待定 1:通过 2:否决
        uint256 money; // 提取数额
        uint256 agreeMoney; // 初始值0，同意票将增加其值
        uint256 disagreeMoney; // 初始值0，否定票将增加其值
        string reason; // 使用资金申请理由
        // key: Project.fundList.idx
        // val: 0: 未表决 1: 同意 2: 不同意
        mapping(uint256 => uint8) agreeList;
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
            p.need = p.curFund; // 更新need为历史最大值，即最终成功筹款数额
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
        u.status = 0;
        u.money = money;
        u.reason = reason;
        u.agreeMoney = 0;
        u.disagreeMoney = 0;
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
        // 约束条件：使用请求待定
        require(globalProjList[idx].useList[uidx].status == 0);

        Project storage p = globalProjList[idx];
        Use storage u = p.useList[uidx];
        for (uint256 fidx = 1; fidx <= p.fundListLen; fidx++) {
            // 资助 并且 未表决者才能投票
            if (
                p.fundList[fidx].funderAddr == msg.sender &&
                p.useList[uidx].agreeList[fidx] == 0
            ) {
                if (agree) {
                    u.agreeMoney += p.fundList[fidx].money;
                    u.agreeList[fidx] = 1;
                } else {
                    u.disagreeMoney += p.fundList[fidx].money;
                    u.agreeList[fidx] = 2;
                }

                // 检查是否已经半数（资金）通过 或 半数否决
                if (2 * u.agreeMoney >= p.need) {
                    u.status = 1;
                    // 若通过则转钱
                    p.curFund -= u.money;
                    p.caller.transfer(u.money);
                } else if (2*u.disagreeMoney >= p.need) {
                    u.status = 2;
                }
            }
        }
    }

    function getUseLenOf(uint256 idx) public view returns (uint256) {
        // 约束条件：idx合法，该众筹项目存在
        require(idx >= 1 && idx <= globalProjListLen);
        return globalProjList[idx].useListLen;
    }

    function getUseOf(
        address funder,
        uint256 idx,
        uint256 uidx
    )
        public
        view
        returns (
            string memory,
            uint256,
            uint8,
            uint8
        )
    {
        // 约束条件：idx合法，该众筹项目存在
        require(idx >= 1 && idx <= globalProjListLen);
        // 约束条件：uidx合法
        require(uidx >= 1 && uidx <= globalProjList[idx].useListLen);

        Project storage p = globalProjList[idx];
        // 找到funder的一个fund
        uint256 fidx = 0;
        for (fidx = 1; fidx <= p.fundListLen; fidx++) {
            if (p.fundList[fidx].funderAddr == funder) break;
        }

        Use storage u = p.useList[uidx];
        if (fidx == p.fundListLen + 1) {
            // funder不是资助者，即funder有可能是发起人，也返回信息
            return (u.reason, u.money, u.status, 0);
        } else {
            return (u.reason, u.money, u.status, u.agreeList[fidx]);
        }
    }
}
