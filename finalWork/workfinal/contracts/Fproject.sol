pragma solidity >=0.4.24;

contract Fproject{
    string summary;//项目简介
    string description;//项目描述
    uint256 private target;//目标金额
    uint256 private got;//已获得金额，当已获得金额等于target时，认为众筹成功
    //此后即使转出金额也不改变got
    uint private ddl;//deadline
    address payable contra;//该合约的地址
    address payable host;//发起人的地址
    address manager;//管理器合约，用于回调
    mapping (address=>uint256) public amount;//记录每个地址转入的金额
    address[] public list;
    string votestr;//投票描述
    uint256 vote_target;
    uint votestate;//投票状态 0为未开始 1为进行中 2为失败 3为成功
    mapping (address=>uint) public votes;

    constructor(
        string memory _summary,
        uint256 _target,
        uint _time,
        address payable _host,
        address _manager
    )public{
        summary = _summary;
        description = _summary;
        target = _target;
        ddl = block.timestamp + _time;
        got = 0;
        contra = address( uint160(address(this)) );
        host = _host;
        votestr = "";
        votestate = 0;
        manager = _manager;
        vote_target = 0;
    }
    //
    function updDescription(string memory str) public returns(string memory res){
        if(msg.sender == host){
            //只有发起人可以更新描述
            description = str;
        }
        else{
            return 'rejected';
        }
        return 'accepted';
    }
    function CheckDDL() view public returns(bool){
        if(block.timestamp >= ddl) return false;
        return true;//返回1表示没有到达DDL
    }
    function Payfund() payable public returns(bool){//返回是否初次付款
        require(msg.value + got <= target);//不能超出需求值
        require(CheckDDL() == true);//DDL不能截止
        got += msg.value;
        if(amount[msg.sender] == 0){
            list.push(msg.sender);
            amount[msg.sender] += msg.value;
            return true;
        }
        amount[msg.sender] += msg.value;
        return false;
    }

    function Raisevote(uint256 vtar,string memory vstr) public{
        require(msg.sender == host);//必须是众筹发起人发起投票
        require(vtar <= contra.balance);//需求量要小于剩余量
        vote_target = vtar;
        votestr = vstr; //更新投票描述
        for(uint i =0;i<list.length;i++){
            votes[list[i]] = 0;//初始化投票结果
        }
        votestate = 1;//开始投票
        return;
    }
    function Checkvote(address from,uint v) public returns(bool){
        require(votestate==1);
        require(v==1 || v==2);//1为同意，2为拒绝
        votes[from] = v;
        uint256 tmp = 0;
        uint256 tmp2 = 0;
        for(uint i = 0;i<list.length;i++){
            if(votes[list[i]]==1){//同意票
                tmp += amount[list[i]];
            }
            else if(votes[list[i]]==2){//拒绝票
                tmp2 += amount[list[i]];
            }
        }
        if(tmp * 2 >= target){ //通过率一半以上
            votestate = 3;
            return host.send(vote_target * uint(1000000000000000000));//转账
        }
        return false;
    }
    function getSummary() public view returns(string memory){
        return summary;
    }
    function getDescription() public view returns(string memory){
        return description;
    }
    function getTarget() public view returns(uint256){
        return target;
    }
    function getGot() public view returns(uint256){
        return got;
    }
    function getDDL() public view returns(uint){
        return ddl;
    }
    function getHost() public view returns(address){
        return address(host);
    }
    function getVoteStr() public view returns(string memory){
        return votestr;
    }
    function getVoteTarget() public view returns(uint256){
        return vote_target;
    }
    function getVoteState() public view returns(uint){
        return votestate;
    }
    function getBalance() public view returns(uint){
        return address(this).balance;
    }
}