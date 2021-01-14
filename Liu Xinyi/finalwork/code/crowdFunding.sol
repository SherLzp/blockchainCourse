pragma solidity ^0.7.0;

//储存所有众筹合约的工厂
contract  crowdFundingFactory{

    //众筹合约地址
    address[] public Projects;

    //通过合约标题、合约信息、最小众筹金额、目标众筹金额、众筹时间建立一个新的众筹项目
    function createProject(string memory _title,string memory _information,uint _minimum,uint _totalAmount,uint _totalTime)public{
        //建立众筹项目
        address newProject=address(new crowdFundingProject(_title,_information,_minimum,_totalAmount,_totalTime,msg.sender));
        Projects.push(newProject);
    }

    //返回所有众筹项目
    function getProjects() public view returns(address[] memory){
        return Projects;
    }

}

//众筹项目
contract crowdFundingProject{

    //使用众筹金额的请求结构
    struct Request{
        //使用理由
        string reason;
        //使用数额
        uint amount;
        //金额发送目标
        address destination;
        //请求是否成功
        bool status;
        //当前投票率
        uint acceptRate;
        //投资人是否投票的状态映射
        mapping(address=>bool) voteStatus;
    }

    //众筹项目主要数据
    //所有请求的数组
    Request[] public requests;
    //项目标题
    string title;
    //项目信息
    string information;
    //请求数量
    uint public requestNum;
    //项目发起人
    address public creator;
    //最小投资金额
    uint public minFund;
    //目标总投资金额
    uint public totalAmount;
    //当前已筹到金额
    uint public presentAmount;
    //众筹是否成功
    bool public fundStatus;
    //众筹时间期限
    uint public deadline;
    //众筹总人数
    uint funderNum;
    //投资人地址映射
    mapping(address=>bool) funders;
    //投资人投资金额映射
    mapping(address=>uint) fundNum;
    //保证创建人与发送请求人地址相同
    modifier restricted() {
        require(msg.sender==creator);
        _;
    }
    
    //众筹合约构造函数
    constructor(string memory _title,string memory _information,uint _minFund,uint _totalAmount,uint _totalTime,address _creator) public {
        title=_title;
        information=_information;
        creator=_creator;
        minFund=_minFund;
        totalAmount=_totalAmount;
        //已筹金额设为0
        presentAmount=0;
        //众筹状态设为未完成
        fundStatus=false;
        //投资人数设为0
        funderNum=0;
        //设置期限
        deadline=block.timestamp+_totalTime;
        //请求数设为0
        requestNum=0;
    }
    
    //投资人进行投资函数
    function fund() public payable {
        //要求未完成众筹
        require(!fundStatus);
        //要求投资金额大于最小金额
        require(msg.value>minFund);
        //要求投资金额不大于可投资金额
        require(msg.value<=totalAmount-presentAmount);
        //要求投资时间在期限内
        require(block.timestamp<deadline);
        //设置投资状态映射为true
        funders[msg.sender]=true;
        //设置投资金额映射
        fundNum[msg.sender]=msg.value;
        //投资人数+1
        funderNum++;
        //当前投资额+新进投资额
        presentAmount+=msg.value;
        //当总投资额达到目标时，众筹已完成
        if(presentAmount==totalAmount){
            fundStatus=true;
        }
    }
    
    //建立请求函数
    function createRequest(string memory _reason,uint _amount,address _destination) public restricted {
        //请求使用金额不大于总金额
        require(_amount<totalAmount);
        //要求此众筹项目已完成
        require(fundStatus);
        //建立新请求
        Request storage r=requests[requestNum++];
        r.reason=_reason;
        r.amount=_amount;
        r.destination=_destination;
        r.status=false;
        r.acceptRate=0;
    }
    
    //投资人同意请求函数
    function acceptRequest(uint _index,bool _choose) public {
        Request storage temp=requests[_index];
        //要求投资人投资过此众筹
        require(funders[msg.sender]);
        //要求投资人还未投过票
        require(!temp.voteStatus[msg.sender]);
        //要求此请求暂时还未通过
        require(!temp.status);
        //设置投资人投票状态为已投
        temp.voteStatus[msg.sender]=true;
        //若投资人同意，则投票率加上此投资人的投资金额比例
        if(_choose==true){
            temp.acceptRate+=(100*fundNum[msg.sender])/totalAmount;
        }
    }
    
    //统计请求投票情况
    function finalizeRequest(uint _index) public restricted{
        Request storage temp=requests[_index];
        //要求投票率大于50%
        require(temp.acceptRate>50);
        //要求请求状态为未通过
        require(!temp.status);
        //进行转账
        address payable temp2=address(uint160(temp.destination));
        temp2.transfer(temp.amount);
        //设置请求状态已通过
        temp.status=true;
    }
    
    //获得一个众筹合约的全部信息
    function getInformation() public view returns(address,uint,uint,uint,uint,bool) {
        return(creator,totalAmount,presentAmount,minFund,deadline,fundStatus);
    }
    
}