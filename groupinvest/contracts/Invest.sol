// SPDX-License-Identifier: GPL3.0
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;
contract Invest {
    
     struct Investor{
        address payable addr;
        uint256 weight;

    }
    struct Investment{
        string name;
        address payable raiser;
        mapping(uint=>Investor)investor;
        uint investorsize;
        //Investor[]  investor ;
        string description;
        uint256 target_amount ;
        uint due;
        uint256 current_amount;
        uint256 total_amount;
        bool isClosed;
        bool isPassed;
        mapping(uint=>Proposal) proposals;
        uint proposal_size;
    }

    struct Investorvote{
        address payable addr;
        bool opinion;
    }
    

    struct Proposal{
        string title;
        string description;
        uint256 amount;
        uint256 votes;
        uint256 voted;
        mapping(uint=>Investorvote) voted_investor;
        uint voted_count;
        bool isClosed;
    }

   function  getdate() internal view returns(uint){
       uint time=block.timestamp;
        return(time);
   }

   
    mapping(uint=>Investment) public investments;
    uint public investments_count;
    //Investment[] public investments;

    address payable public manager;
    address payable[] public players;
    uint256 public round;
    address payable public winner;

    constructor()  {
        manager = msg.sender;
        investments_count=0;
    }

    function update_state() public{
        for(uint i=0;i<investments_count;i++){
            Investment storage fund=get_fund(i);
            if(!fund.isClosed&&!fund.isPassed&&(fund.current_amount<fund.target_amount)&&fund.due<block.timestamp){
                fund.isClosed=true;
                fund.isPassed=false;
                refund(i);/*call refund*/
                
            }
        }
    }

    function refund(uint fund_index) internal{
        Investment storage fund=get_fund(fund_index);
        require(fund.isClosed&&(!fund.isPassed));
        for(uint i=0;i<fund.investorsize;i++){
            fund.investor[i].addr.transfer(fund.investor[i].weight);
            fund.current_amount-=fund.investor[i].weight;
        } 
    }

    event new_f(string  name,uint num);
    event here(uint num);
    function new_fund(string calldata name, string calldata description,uint due, uint256 target_amount) public {
            Investment storage fund=investments[investments_count];
            fund.name=name;
            
            fund.raiser=msg.sender;
            fund.description=description;
            fund.due=due;
            fund.target_amount=target_amount;
            fund.isClosed=false;
            fund.isPassed=false;
            fund.current_amount=0;
            fund.total_amount=0;
            fund.investorsize=0;
            fund.proposal_size=0;    
            investments_count++;

    }

    function new_proposal(string calldata name,string calldata description,uint256 amount,uint fund_index)public onlyRaiser(fund_index){
            Investment storage fund=get_fund(fund_index);
            
            fund.proposals[fund.proposal_size].title=name;
            fund.proposals[fund.proposal_size].description=description;
            fund.proposals[fund.proposal_size].amount=amount;
            fund.proposals[fund.proposal_size].voted=0;
            fund.proposals[fund.proposal_size].votes=0;
            fund.proposals[fund.proposal_size].isClosed=false;
            fund.proposals[fund.proposal_size].voted_count=0;
            fund.proposal_size++;
            //push(Proposal({title:name,description:description,amount:amount,voted:0,votes:0,isClosed:false}));
    }

    function invest(uint fund_index) public payable fund_available(fund_index){
        Investment storage fund=get_fund(fund_index);
        fund.current_amount+=msg.value;
        fund.total_amount+=msg.value;
        if(!isInvestor(fund_index)){
            fund.investor[fund.investorsize].addr=msg.sender;
            fund.investor[fund.investorsize].weight=msg.value;
            fund.investorsize++;
            //push(Investor({addr:msg.sender,weight:msg.value}));
        }else{
            get_investor(fund_index).weight+=msg.value;
        }
    }

    function get_fund_number()public view returns(uint){
        return investments_count;
    }

    function get_fund_info(uint fund_index)public view returns(string memory,string memory,uint256,uint,uint256,uint256,string memory,string memory,address payable){
        string memory status;
        string memory role;
        Investment storage fund=get_fund(fund_index);
        if(fund.isClosed&&(!fund.isPassed)){
            status="Failed";
        }else if(fund.isClosed&&fund.isPassed&&fund.current_amount>0){
            status="Succeeded";
        }else if(fund.isClosed&&fund.isPassed&&fund.current_amount==0){
            status="Completed";
        }else {
            status="Ongoing";
        }
        if(isInvestor(fund_index)){
            role="Investor";
        }else if(msg.sender==fund.raiser){
            role="Raiser";
        }else{
            role="Normal";
        }
        return(fund.name,fund.description,fund.target_amount,fund.due,fund.total_amount,fund.current_amount,status,role,fund.raiser);
    }

    function get_proposal_number(uint fund_index) public view returns(uint) {
        return investments[fund_index].proposal_size;
    }

    function get_proposal_info(uint fund_index,uint proposal_index) public view returns(string memory,string memory,uint256,uint256,uint256,string memory,string memory) {
        Proposal storage prop=get_proposal(fund_index, proposal_index);
        string memory status;
        string memory opinion;
        if(!isInvestor(fund_index)){
            opinion="--";
        }else if(is_voted(fund_index, proposal_index)){
            opinion="Voted";
        }else{
            opinion="Not voted";
        }
        if(is_proposal_pass(fund_index,proposal_index)){
            status="Passed";
        }else if(is_proposal_failed(fund_index,proposal_index)){
            status="Failed";
        }else{
            status="Ongoing";
        }
        return(prop.title,prop.description,prop.amount,prop.voted,prop.votes,status,opinion);
    }

    function get_investor_number(uint fund_index) public view returns(uint){
        return investments[fund_index].investorsize;
    }

    function get_weight(uint fund_index) public view onlyInvestor(fund_index) returns(uint256){
            Investor storage inv=get_investor(fund_index);
            return inv.weight;
    }

    function isInvestor(uint fund_index) internal view returns (bool){
        for (uint index = 0; index < investments[fund_index].investorsize; index++) {
            if(msg.sender==investments[fund_index].investor[index].addr) {
                return true;   
            }
        }
        return false;
    }

    modifier fund_available(uint fund_index){
        require(block.timestamp<=investments[fund_index].due);
        _;
    }

    modifier onlyInvestor(uint fund_index) {
        require(
            isInvestor(fund_index),"Only investor can call this"
        );
    _;
    }

    modifier onlyRaiser(uint fund_index){
        require(investments[fund_index].raiser==msg.sender,"Only raiser can call this");
        _;
    }

    function get_investor(uint fund_index) internal view onlyInvestor(fund_index) returns(Investor storage){
        for (uint index = 0; index < investments[fund_index].investorsize; index++) {
            if(msg.sender==investments[fund_index].investor[index].addr) {
                return investments[fund_index].investor[index];   
            }
        }
        revert();
    }

    modifier inrange_fund(uint fund_index){
        require(fund_index>=0&&fund_index<investments_count,"Index out of range.");
        _;
    }

    modifier inrange_proposal(uint fund_index,uint proposal_index){
        require(proposal_index>=0&&proposal_index<investments[fund_index].proposal_size,"Index out of range.");
        _;
    }

    function get_fund(uint fund_index) internal view inrange_fund(fund_index) returns(Investment storage){
        return investments[fund_index];
    }

    function get_proposal(uint fund_index,uint proposal_index) internal view inrange_fund(fund_index) inrange_proposal(fund_index,proposal_index) returns(Proposal storage){
        return investments[fund_index].proposals[proposal_index];
    }


    function vote_for_proposal(uint fund_index,uint proposal_index,bool vote) public onlyInvestor(fund_index) {
            Investor storage investor=get_investor(fund_index);
            Proposal storage prop=get_proposal(fund_index, proposal_index);
            if(is_voted(fund_index, proposal_index))
                return;
            prop.voted_investor[prop.voted_count].addr=msg.sender;
            prop.voted_investor[prop.voted_count].opinion=vote;
            prop.voted_count++;
            //prop.investor_opinion.push(vote);
            prop.voted+=investor.weight;
            if(vote){
                prop.votes+=investor.weight;
            }
            
    }

    function proposal_pass(uint fund_index,uint proposal_index) public onlyRaiser(fund_index)  {
        Investment storage fund=get_fund(fund_index);
        Proposal storage prop=get_proposal(fund_index, proposal_index);
        if(prop.isClosed||(!is_proposal_pass(fund_index,proposal_index)))
            return;
        
        fund.raiser.transfer(prop.amount);
        fund.current_amount-=prop.amount;
        prop.isClosed=true;

    }

    function is_proposal_failed(uint fund_index,uint proposal_index) internal view returns(bool){
        Proposal storage prop=get_proposal(fund_index, proposal_index);
        Investment storage fund=get_fund(fund_index);
        if(prop.voted-prop.votes>=fund.total_amount/2){//反对票超过一半
            
            return true;
        }else{
            return false;
        }
    }

    function is_proposal_pass(uint fund_index,uint proposal_index) internal view returns(bool) {
        Proposal storage prop=get_proposal(fund_index, proposal_index);
        Investment storage fund=get_fund(fund_index);
        if(prop.votes>fund.total_amount/2){
            return true;
        }else{
            return false;
        }

    }

    function is_voted(uint fund_index,uint proposal_index) public view onlyInvestor(fund_index) returns(bool){
        for(uint i=0;i<investments[fund_index].proposals[proposal_index].voted_count;i++){
                if(msg.sender==investments[fund_index].proposals[proposal_index].voted_investor[i].addr){//see if the investor has already voted
                    return true;
                }
            }
            return false;
    }
    modifier onlyManager{
        require(msg.sender == manager);
        _;
    }
    function getBalance() public view returns (uint256){
        return address(this).balance;
    }

}