pragma solidity >=0.4.21 <0.7.0;

contract Funding{
    struct Funding{
        address payable initiator; //众筹项目发起者
        string title;//标题
        string content;//内容
        uint goalMoney;//目标金额
        uint raisedMoney;//已筹集金额
        uint usedMoney;//已使用金额
        uint deadline;//众筹项目截止日期
        bool isSuccess;//是否筹集成功
        uint fundersLength;//投资人数量
        uint proposalsLength;//申请使用资金的次数
        mapping(uint => Funder) funders;//投资者
        mapping(uint => Proposal) proposals;//申请使用资金的记录
    }

    // 投资者信息
    struct Funder{
        address payable add; //投资者地址
        uint cost; //投资者的投资金额
    }

    uint public allFundingsLength;//众筹项目的总数量
    mapping(uint => Funding) public allFundings;//所有众筹项目的map


    //申请使用资金的记录
    struct Proposal{
        string content;//申请说明
        uint amount;//申请金额
        uint agreeAmount;//持同意态度的投资者的金额之和
        uint disAmount;//持反对态度的投资者的金额之和
        uint goal;//可以转账的最低金额，数值上等于amount的一般
        mapping(uint => uint) states;//该记录的状态
        bool isAgreed;//是否通过
    }
    //投资项目的函数
    function contribute(uint _fundId) public payable {
        require(msg.value>0);
        require(now<=allFundings[_fundId].deadline);
        Funding storage funding = allFundings[_fundId];
        uint funderNum = funding.fundersLength + 1;
        funding.fundersLength += 1;
        Funder storage funder = funding.funders[funderNum];
        funder.add = msg.sender;
        funder.cost = msg.value;
        funding.raisedMoney += msg.value;
        if(funding.raisedMoney >= funding.goalMoney)funding.isSuccess=true;
    }
    //创建众筹项目的函数
    function createFunding(address payable _initiator, string memory _title, string memory _content, uint _goalMoney, uint _remainingtime) public returns(uint) {
        uint num = allFundingsLength;
        allFundingsLength+=1;
        Funding storage funding = allFundings[num];
        funding.initiator = _initiator;
        funding.title = _title;
        funding.content = _content;
        funding.goalMoney = _goalMoney;
        funding.raisedMoney = 0;
        funding.deadline = _remainingtime + now;
        return num;
    }
    

    //创建申请资金的记录
    function createProposal(uint _fundId, string memory _content, uint _amount) public {
        Funding storage funding = allFundings[_fundId];
        require(funding.initiator == msg.sender);
        uint proNum = funding.proposalsLength + 1;
        funding.proposalsLength+=1;
        Proposal storage proposal = funding.proposals[proNum];
        proposal.content = _content;
        proposal.amount = _amount;
        proposal.goal = funding.raisedMoney / 2;
    }
    //审批申请的函数
    function agreeProposal(uint _fundId, uint _proposalId, bool _isAgree) public funderOfFunding(_fundId){
        Funding storage funding = allFundings[_fundId];
        require(_proposalId>=1 && _fundId<=funding.proposalsLength);
        Proposal storage proposal = funding.proposals[_proposalId];
        for(uint i = 1; i<=funding.fundersLength;i++){
            Funder memory funder = funding.funders[i];
            if(funder.add==msg.sender){
                if(_isAgree){
                    proposal.states[i]=1;
                    proposal.agreeAmount += funder.cost;
                }
                else{
                    proposal.states[i]=2;
                    proposal.disAmount += funder.cost;
                }
            }
        }
        if(proposal.agreeAmount >= proposal.goal){
            proposal.isAgreed = true;
            funding.initiator.transfer(proposal.amount);
            funding.usedMoney += proposal.amount;
        }
        else if(proposal.disAmount >=proposal.goal){
            proposal.isAgreed = false;
        }
    }
    //获取的申请记录
    function getProposal(uint _fundId, uint _proposalId) public view returns(string memory, uint, uint, uint, uint, bool) {
        require(_fundId>=0 && _fundId<=allFundingsLength);
        Funding storage funding = allFundings[_fundId];
        require(_proposalId>=1 && _fundId<=funding.proposalsLength);
        Proposal storage proposal = funding.proposals[_proposalId];
        return (proposal.content, proposal.amount, proposal.agreeAmount, proposal.disAmount, proposal.goal, proposal.isAgreed);
    }
    //获取申请记录的数量
    function getProposalsLength(uint _fundId) public view returns(uint){
        return allFundings[_fundId].proposalsLength;
    }
    //获取合约地址的剩余资金
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}