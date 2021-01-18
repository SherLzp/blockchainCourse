pragma solidity >=0.4.22 <0.9.0;

contract CrowdFunding {

    uint public funding_num;             

    // 使用请求，为求方便，这里规定请求都是拿出全部金钱，且一次失败后再也不能提取
    struct Use {
        uint   sum_agree;                   // 同意的总钱数
        uint   sum_disagree;                // 不同意的总钱数
        uint   vote_num;                    // 投票数量
        uint[] agree;                       // 各个投资者投票结果

    }
    mapping (uint => Use) public Uses;

    // 项目信息
    struct Funding {
        address payable owner;              // 发起者
        uint fid;                           // 项目唯一id号

        string name;                        // 项目名
        string introduction;                // 项目描述
        uint sum;                           // 目标金额
        uint time;                          // 结束时间
        uint status;                        // 项目状态
                                            // 0代表正在众筹，1代表已经众筹完毕，2已经发出提取请求，3表示项目结束（失败或已经提取）

        uint already_sum;                   // 收集到的金额
        uint funder_num;                    // 投资人数
                             
        address payable[] funders;          // 投资者
        uint[] amount;                      // 各个投资者对应的金额
    }
    mapping (uint => Funding) public Fundings; 
    

    function newFunding(string memory name, string memory introduction, address payable owner, uint sum, uint time) public
    {
        uint id = funding_num++;

        uint[] memory agree;
        Use memory u =Use({
            sum_agree: 0,
            sum_disagree: 0,
            vote_num: 0,
            agree: agree
        });
        Uses[id]=u;

        address payable[] memory funders;
        uint[] memory amount;
        Funding memory f = Funding({
            fid:id,
            name: name,
            introduction: introduction,
            owner: owner,
            sum: sum,
            time: time,
            already_sum: 0,
            funder_num: 0,
            status: 0,
            funders: funders,
            amount: amount
        });
        Fundings[id] = f;
    }

    function contribute(uint fid) public payable {
        // 捐钱数目必须符合要求
        require(msg.value > 0 && msg.value <= Fundings[fid].sum - Fundings[fid].already_sum);
        // 还没结束
        require(Fundings[fid].time > block.timestamp);
        require(Fundings[fid].status == 0);

        Funding storage f = Fundings[fid];
        Use storage u = Uses[fid];

        //uses信息更新
        u.agree.push(0);

        //funding信息更新
        f.already_sum += msg.value;
        f.funder_num++;
        f.funders.push(msg.sender);
        f.amount.push(msg.value);
        if(f.already_sum == f.sum)
            f.status = 1;
    }

    function want_use(uint fid) public {
        //判断条件
        require(Fundings[fid].owner == msg.sender);
        require(fid < funding_num && fid >= 0);
        require(Fundings[fid].status == 1);
        
        Funding storage f = Fundings[fid];
        f.status = 2; 
    }

    function agree_use(uint fid, bool agree) public {
        Funding storage f = Fundings[fid];
        Use storage u = Uses[fid];

        require(fid < funding_num && fid >= 0);
        require(f.status == 2);

        for(uint i = 0; i < f.funder_num; i++) 
        {
            if(msg.sender == f.funders[i]) 
            {
                if(u.agree[i] == 0) {
                    u.vote_num++;
                    if(agree == true) {
                        u.agree[i] = 1;
                        u.sum_agree += f.amount[i];
                    }
                    else 
                    {
                        u.agree[i] = 2;
                        u.sum_disagree +=f.amount[i];
                    }
                        

                    if(u.sum_agree >= f.already_sum / 2) 
                        f.owner.transfer(f.sum);

                    if(u.sum_disagree >= f.already_sum / 2) {
                        f.status = 3;
                        for (uint j = 0; j < f.funder_num; j++)
                            f.funders[j].transfer(f.amount[j]);
                    }
                }
            }
        }
    }

    function getInvestors(uint fid) public view returns(address payable[] memory) {
        Funding storage f = Fundings[fid];
        address payable[] storage funders = f.funders;
        return funders;
    }
}
