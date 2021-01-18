// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;
//本机使用的solc为0.5.16,为调试方便限制如上版本，实际编译使用remix

contract CrowdFunding {
    Funding[] public Fundings;
    uint cnt=0;
    string Selectedtitle;

    function createFunding (
        string calldata title,
        string calldata description,
        uint deadline,
        uint target
    ) external returns(bool) {
        //创建新的项目
        bool f=false;
        Funding newFunding = new Funding(msg.sender, title, description, target, block.timestamp, deadline * 1 seconds);
        Fundings.push(newFunding);
        f=true;
        cnt++;
        return f;
    }
    event SuccessEvent(
        uint createflag,
        address currentAddress
    );
    event Recordlog(
        string log
    );     
    // function executeCreation() external{
    //     //try catch为0.6.0以后的特性,如果truffle版本过低可以注释掉不用
    //     try createFunding(){
    //         emit SuccessEvent(1,msg.sender);
    //     }
    //     catch{
    //         emit Recordlog("ERROR")
    //     }
    // }

    //删除一个现存的项目
    function deleteFunding(
        string calldata title,
        uint deadline,
        uint target
    ) external returns(bool){
        bool f=false;
        for(uint i=0;i<cnt;i++){
            if(deadline<block.timestamp){
                Selectedtitle=title;
                delete Selectedtitle;
                target=0;
                f=false;
                break;
            }
        }         
        cnt--;
        return(f);      
    }
    //返回所有项目
    function getFundings() external view returns(Funding[] memory){
        return Fundings;
    }
}
contract Funding {
    //发起者
    address payable public creator;
    //投资人
    address payable[] public contributors;
    //投资人出资
    mapping(address => uint) public contributions;
    //项目属性
    string title = "Undefined";     //名称
    string description ="Undefined";    //描述
    uint target = 0;        //目标金额
    uint startTime = block.timestamp;   //开始时间
    uint deadline = block.timestamp;    //结束时间
    uint completeTime = block.timestamp;    //实际完成时间
    uint timeGap=0;
    uint endTime = block.timestamp;     //实际结束时间，包含交易所需时间
    uint num=0; //出资人数
    uint balance = 0;   //账户余额
    uint usage_balance = 0; //请求金额
    uint total = 0;
    bool private process = false;        
    enum State {Ongoing, Outdated, Succeeded, Failed, Paidoff}  //五种状态
    State private state = State.Ongoing;    //默认正在进行
    constructor
    (
        address payable FundingCreator,
        string memory FundingTitle,
        string memory FundingDescription,
        uint FundingTarget,
        uint FundingStartTime,
        uint FundingDeadline
    ) public {
        creator = FundingCreator;
        title = FundingTitle;
        description = FundingDescription;
        target = FundingTarget;
        startTime = FundingStartTime;
        deadline = FundingDeadline;
    }
    event SuccessEvent(
        uint createflag,
        address currentAddress
    );
    event Recordlog(
        string log
    );     
    // function executeCreation() external{
    //     //try catch为0.6.0以后的特性,如果truffle版本过低可以注释掉不用
    //     try constructor(){
    //         emit SuccessEvent(1,msg.sender);
    //     }
    //     catch{
    //         emit Recordlog("ERROR")
    //     }
    // }

    struct Usage{
        string title;   //请求名称
        string description; //请求描述
        uint amount;    //金额
        uint approvalnum;     //赞成人数
        uint disapprovalnum;      //反对人数
        uint approvalContribution;  //赞成人数*出资比例
        uint disapprovalContribution;  //反对人数*出资比例
        uint startTime;//开始时间
        uint endTime;//截止时间
        State state;
        mapping(address => bool) voted;
    }
    uint numUsages;
    mapping(uint => Usage) usages;
    modifier Validate_State(State _state){
        require(state == _state, "Invalid State");
        _;
    }
    function contribute() external payable Validate_State(State.Ongoing) returns(uint){
        //投资前提是不是项目发起者、项目未截止、投资额度合法
        require(creator != msg.sender, "This is a Creator");
        require(block.timestamp < deadline, "The funding is expired");
        require(msg.value > 0, "The amount is invalid");
        contributors.push(msg.sender);  //添加投资人及对应资金信息
        contributions[msg.sender] += msg.value;
        balance += msg.value;
        usage_balance += msg.value;
        total += msg.value;
        //如果余额大于目标资金
        if (balance >= target) {
            state = State.Succeeded;
            completeTime = block.timestamp;
            return 1;
        }
        //如果在处理过程中导致超时
        else if (block.timestamp > deadline) {
            state = State.Failed;
            completeTime = block.timestamp;
            for(uint i=0; i<contributors.length; i++){
                contributors[i].transfer(contributions[address(contributors[i])]);
            }
            endTime = block.timestamp;
            timeGap = endTime-completeTime;
            return timeGap;
        }
        else return 0;
    }
    function createUsage(
        string calldata usageTitle,
        string calldata usageDescription,
        uint usageAmount
    ) external Validate_State(State.Succeeded) returns(bool){
        //增加Usage需要确定余额足够以及资金使用者为项目创建者
        require(usageAmount <= usage_balance, "Not Enough Balance");
        require(creator == msg.sender, "This is not a Creator");
        Usage storage temp = usages[numUsages];
        //存一个usage
        temp.startTime = block.timestamp;
        temp.title = usageTitle;
        temp.description = usageDescription;
        temp.amount = usageAmount;
        temp.approvalnum=0;
        temp.approvalContribution = 0;
        temp.disapprovalnum=0;
        temp.disapprovalContribution = 0;
        temp.endTime = 0;
        temp.state = State.Ongoing;
        numUsages++;
        usage_balance -= usageAmount;
        return true;
    }
    function vote(
        bool approve,
        uint usageId
    ) external Validate_State(State.Succeeded){
        //必须要众筹已经完成并且请求正在进行，必须要是投资者之一
        require(usages[usageId].state==State.Ongoing , "Invalid usage State");
        require(contributions[msg.sender] > 0, "Not Contributor");
        Usage storage usage = usages[usageId];
        usage.voted[msg.sender] = true;        
        if(approve){
            usage.approvalnum++;
            usage.approvalContribution += contributions[msg.sender];
        }else{
            usage.disapprovalnum++;
            usage.disapprovalContribution += contributions[msg.sender];
        }
        if(usage.approvalContribution*2 >= total){
            usage.state = State.Paidoff;
            balance -= usage.amount;
            if (balance == 0) {
                state = State.Paidoff;
                endTime = block.timestamp;
            }
            creator.transfer(usage.amount);
            usage.endTime = block.timestamp;
        }
        else if(usage.disapprovalContribution*2 >= total){
            usage.state = State.Failed;
            usage_balance += usage.amount;
            usage.endTime = block.timestamp;
        }
        else {usage.state = State.Ongoing;}
    }
    function getTime() external view returns(
        uint FundingStartTime,
        uint FundingDeadline,
        uint FundingCompleteTime,
        uint FundingEndTime
    ) {
        return (
            startTime, deadline, completeTime, endTime
        );
    }
    function getDetail() external view returns(
        address payable FundingCreator,
        string memory FundingTitle,
        string memory FundingDescription,
        uint FundingTarget,
        uint FundingStartTime,
        uint FundingDeadline,
        uint FundingCompleteTime,
        uint FundingEndTime,
        uint FundingBalance,
        uint FundingUsageBalance,
        uint FundingTotal,
        uint FundingContribution,
        State FundingState
    ) {
        return (
            creator, title, description, target, startTime, deadline, 
            completeTime, endTime, balance, usage_balance, total, contributions[msg.sender], state
        );
    }
    function getVotingresult(uint usageId) external view returns(
        uint usageApprovalnum,
        uint usageDisapprovalnum,
        uint usageApprovalContribution,
        uint usageDisapprovalContribution
    ) {
        Usage storage usage = usages[usageId];
        return (
           usage.approvalnum, usage.disapprovalnum,usage.approvalContribution,usage.disapprovalContribution
        );
    }
    function getUsageDetail(uint usageId) external view returns(
        string memory usageTitle,
        string memory usageDescription,
        uint usageAmount,
        uint usageApprovalnum,
        uint usageDisapprovalnum,
        uint usageApprovalContribution,
        uint usageDisapprovalContribution,
        uint usageStartTime,
        uint usageEndTime,
        State usageState,
        bool voted
    ) {
        Usage storage usage = usages[usageId];
        return (
            usage.title, usage.description, usage.amount, usage.approvalnum, usage.disapprovalnum,usage.approvalContribution,
            usage.disapprovalContribution, usage.startTime, usage.endTime, usage.state, usage.voted[msg.sender]
        );
    }
    function getUsageNum() external view returns(uint) {
        return numUsages;
    }
    function getUsageAmount(uint usageId) external view returns(uint){
        return usages[usageId].amount;
    }
    function getUsagevoted(uint usageId) external view returns(bool){
        return usages[usageId].voted[msg.sender];
    }
}


