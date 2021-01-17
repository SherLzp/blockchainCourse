pragma solidity ^0.4.24;

contract Funding {
    // 发起⼈
    // 项⽬名称
    // 参与众筹⾦额
    // 众筹⽬标⾦额
    // 众筹截⽌⽇期

    address public manager;
    string public projectName;
    uint public supportBalance;
    uint public targetBalance;
    uint public endTime;

    //参与众筹的⼈，即投资⼈
    address[] public investors;
    //标记⼀个⼈是否参与了当前众筹
    mapping(address => bool) public investExitMapping;
    SupportorFundingContract supportorFundings;

    constructor(string  _projectName,uint _supportBalance,uint _targetBalance,uint _durationInSeconds,address _crerator,SupportorFundingContract _supportorFundings) public {
        // manager = msg.sender;
        manager = _crerator;
        projectName = _projectName;
        supportBalance = _supportBalance * 10 **18;
        targetBalance = _targetBalance * 10 **18;
        endTime = _durationInSeconds + block.timestamp;

        //将合约传递给Funding，在构造中接收
        supportorFundings = _supportorFundings;
    }

    //投资
    function invest() payable public{
        //每个⼈只能参与⼀次
        require(investExitMapping[msg.sender] == false);

        // ⽀持固定⾦额
        require(msg.value == supportBalance);
        // 添加到众筹⼈数组中
        investors.push(msg.sender);
        // 标记当前账户为参与⼈
        investExitMapping[msg.sender] =true;

        // 将投资人与当前合约的地址传递到FundingFactory中
        //supportorFundings[msg.sender].push(this);
        supportorFundings.setFunding(msg.sender, this);

    }

    //众筹失败，退款
    function drawBack()onlyManager public {
        require(block.timestamp >= endTime);
        require(address(this).balance < targetBalance);


        for (uint i = 0;i < investors.length;i++){
            investors[i].transfer(supportBalance);
        }

        //这个合约基本就会被废弃掉，所以就不去处理investors、investorExistMap了
        delete investors;
    }



    //花费请求
    struct Request {
        string purpose; // 买什么？
        uint256 cost; // 需要多少钱？
        address shopAddress; // 向谁购买？

        uint256 voteCount; // 多少⼈赞成了，超半数则批准⽀出
        mapping(address => bool) investorVotedMap; //赞成⼈的标记集合，防⽌⼀⼈重复投票多次

        RequestStatus status; //这个申请的当前状态：投票中？？已批准？ 已完成？0,1,2

    }
    // 定义⼀个枚举，描述申请的状态：
    enum RequestStatus{Voting,Approved,Completed}

    //请求可能有多个，所以定义⼀个数组
    Request[] public requests;
    function createRequest(string _purpose,uint256 _cost,address _shopAddress)onlyManager public {

        Request memory req = Request ({
            purpose:_purpose,
            cost:_cost,
            shopAddress:_shopAddress,
            voteCount:0,
            status:RequestStatus.Voting

            });
        requests.push(req);

    }

    //批准⽀付申请
    function approveRequest(uint256 index) public {
        // 1. 检验这个⼈是否投过票，若未投过，则允许投票，反之退出
        // 2. voteCount数据加1。
        // 3. 将该投票⼈在investorVotedMap映射中的值设置为true。

        //⾸先要确保是参与众筹的⼈，否则⽆权投票
        require(investExitMapping[msg.sender]);
        //根据索引找到特定的请求
        Request storage req = requests[index];
        //确保没有投过票，⼈⼿⼀票
        require(req.investorVotedMap[msg.sender] == false);
        //如果已经完成，或者已经获得批准了，就不⽤投票了，当前投票不会影响决策。
        require(req.status == RequestStatus.Voting);

        //⽀持票数加1
        req.voteCount += 1;
        //标记为已投票
        req.investorVotedMap[msg.sender] = true;
        if (req.voteCount * 2 > investors.length) {
            req.status == RequestStatus.Approved;
        }
    }

    //完成花费请求
    //当投票⼈数过半时，花费被批准，可以由项⽬⽅执⾏花费动作，也可以由合约⾃动执⾏。我们选择⼿
    //动执⾏，因为有可能项⽬⽅改变主意了，计划有变不需要购买了等等因素，所以我们把权利下放到项⽬⽅。
    function finalizeRequest(uint256 index) public onlyManager{
        // 这个函数主要做两件事：
        // 1. 票数过半，则执⾏转账。
        // 2. 更新request的状态。

        Request storage req = requests[index];
        //合约⾦额充⾜才可以执⾏
        require(address(this).balance >= req.cost);
        //赞成⼈数过半
        require(req.voteCount * 2 > investors.length);
        //转账
        req.shopAddress.transfer(req.cost);
        //更新请求状态为已完成
        req.status = RequestStatus.Completed;

    }

    modifier onlyManager(){
        require(msg.sender == manager);
        _;
    }

    //获取合约余额
    function getBalance()public view returns(uint256){
        return address(this).balance;
    }

    //获取投资人
    function getInvestors()public view returns(address[]){
        return investors;
    }

    //获取投资人数量
    function getInvestorsCount()public view returns(uint256) {
        return investors.length;
    }

    //返回众筹剩余时间
    function getRemainTime()public view returns(uint256) {
        return(endTime - now)/60/60/24;
    }

    //返回花费申请数量
    function getRequestsCount()public view returns(uint256) {
        return requests.length;
    }

    //返回某⼀个花费申请的具体信息
    function getRequestDetailByIndex(uint256 index)public view returns(string,uint256,address,bool,uint256,uint256) {
        //确保访问不越界
        require(requests.length > index);
        Request storage req =requests[index];

        bool isVoted = req.investorVotedMap[msg.sender];
        return (req.purpose,req.cost,req.shopAddress,isVoted,req.voteCount,uint256(req.status));
    }


}



contract FundingFactory{
    // 平台管理员
    address public platformManager;
    // 所有的众筹合约集合
    address[] allFundings;
    // 创建人的合约集合
    mapping(address => address[]) creatorFundings;
    // 参与人的合约集合
    // mapping(address => address[]) supportFunding;
    SupportorFundingContract supportorFundings; //0x0000000000000;

    constructor()public {
        platformManager = msg.sender;

        //在构造函数时候，创建一个全局的SupportorFundingContract合约实例
        supportorFundings = new SupportorFundingContract();
    }

    function createFunding(string _name, uint _supportMoney, uint _targetMoney, uint _duration) public {
        //创建一个合约，使用new方法，同时传入参数，返回一个地址
        address funding = new Funding(_name, _supportMoney, _targetMoney, _duration, msg.sender,supportorFundings);
        allFundings.push(funding);

        //维护创建者所创建的合约集合
        creatorFundings[msg.sender].push(funding);
    }

    //返回当前平台的所有的合约
    function getAllFundings() public view returns (address[]) {
        return allFundings;
    }

    //返回当前账户所创建所有的合约
    function getCreatorFundings() public view returns (address[]) {
        return creatorFundings[msg.sender];
    }

    //获取回当前账户所的参与的合约的集合
    function getSupportorFunding() public view returns (address[]) {
        return supportorFundings.getFundings(msg.sender);
    }
}

//这个合约维护者全局所有参与人所参与的所有众筹合约
contract SupportorFundingContract {

    //     功能：mapping(address => address[]) supportorFundings

    // 方法1，添加合约到集合：setFunding(address _supptor, address _funding)

    // 方法2, 读取合约数据：getFundings(address _supptor) returns(address[])

    mapping(address => address[]) supportorFundingsMap;

    function setFunding(address _supptor, address _funding) public {
        supportorFundingsMap[_supptor].push(_funding);
    }

    function getFundings(address _supptor) public view returns (address[]) {
        return supportorFundingsMap[_supptor];
    }
}
