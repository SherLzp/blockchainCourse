// SPDX-License-Identifier: GPL3.0
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;
contract Crowd_fund {
    
     struct Invester{
        address payable addr;
        uint256 weight;

    }
    struct Crowdfund{
        string name;
        address payable raiser;
        mapping(uint=>Invester)invester;
        uint investersize;
        //Invester[]  invester ;
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

    struct Investervote{
        address payable addr;
        bool opinion;
    }
    

    struct Proposal{
        string title;
        string description;
        uint256 amount;
        uint256 votes;
        uint256 voted;
        mapping(uint=>Investervote) voted_invester;
        uint voted_count;
        bool isClosed;
    }

   function  getdate() internal view returns(uint){
       uint time=block.timestamp;
        return(time);
   }

   
    mapping(uint=>Crowdfund) public crowdfunds;
    uint public crowdfunds_count;
    //Crowdfund[] public crowdfunds;
    address payable public player;
    address payable public palyer2;
    address payable public manager;
    address payable[] public players;
    uint256 public round;
    address payable public winner;
    bool isinv=false;
    constructor()  {
        manager = msg.sender;
        crowdfunds_count=0;
    }

    function update_state() public{
        for(uint i=0;i<crowdfunds_count;i++){
            Crowdfund storage fund=get_fund(i);
            if(!fund.isClosed&&!fund.isPassed&&(fund.current_amount<fund.target_amount)&&fund.due<block.timestamp){
                fund.isClosed=true;
                fund.isPassed=false;
                refund(i);/*call refund*/
                
            }
        }
    }

    function refund(uint fund_index) internal{
        Crowdfund storage fund=get_fund(fund_index);
        require(fund.isClosed&&(!fund.isPassed));
        for(uint i=0;i<fund.investersize;i++){
            fund.invester[i].addr.transfer(fund.invester[i].weight);
            fund.current_amount-=fund.invester[i].weight;
        } 
        fund.isClosed=true;
        fund.isPassed=false;
    }

    event new_f(string  name,uint num);
    event here(uint num);
    function new_fund(string calldata name, string calldata description,uint due, uint256 target_amount) public {
            //Proposal[] storage prop=strprop[strprop_count];
            //Invester[] storage inv=strinv[strinv_count];
            Crowdfund storage fund=crowdfunds[crowdfunds_count];
            fund.name=name;
            
            fund.raiser=msg.sender;
            player=fund.raiser;
            palyer2=msg.sender;
            fund.description=description;
            fund.due=due;
            fund.target_amount=target_amount;
            fund.isClosed=false;
            fund.isPassed=false;
            fund.current_amount=0;
            fund.total_amount=0;
            fund.investersize=0;
            fund.proposal_size=0;
            
            crowdfunds_count++;

    }

    function new_proposal(string calldata name,string calldata description,uint256 amount,uint fund_index)public onlyRaiser(fund_index){
            Crowdfund storage fund=get_fund(fund_index);
            
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
        Crowdfund storage fund=get_fund(fund_index);
        fund.current_amount+=msg.value;
        fund.total_amount+=msg.value;
        if(!isInvester(fund_index)){
            fund.invester[fund.investersize].addr=msg.sender;
            fund.invester[fund.investersize].weight=msg.value;
            fund.investersize++;
            isinv=false;
            //push(Invester({addr:msg.sender,weight:msg.value}));
        }else{
            isinv=true;
            get_invester(fund_index).weight+=msg.value;
        }
    }

    function get_fund_number()public view returns(uint){
        return crowdfunds_count;
    }

    function get_fund_info(uint fund_index)public view returns(string memory,string memory,uint256,uint,uint256,uint256,string memory,string memory,address payable){
        string memory status;
        string memory role;

        Crowdfund storage fund=get_fund(fund_index);
        
        if(fund.isClosed&&(!fund.isPassed)){
            status="Failed";
        }else if(fund.isClosed&&fund.isPassed&&fund.current_amount>0){
            status="Succeeded";
        }else if(fund.isClosed&&fund.isPassed&&fund.current_amount==0){
            status="Completed";
        }else {
            status="Ongoing";
        }
        if(isInvester(fund_index)){
            role="Invester";
        }else if(msg.sender==fund.raiser){
            role="Raiser";
        }else{
            role="Normal";
        }
        return(fund.name,fund.description,fund.target_amount,fund.due,fund.total_amount,fund.current_amount,status,role,fund.raiser);
    }

    function get_proposal_number(uint fund_index) public view returns(uint) {
        return crowdfunds[fund_index].proposal_size;
    }

    function get_proposal_info(uint fund_index,uint proposal_index) public view returns(string memory,string memory,uint256,uint256,uint256,string memory,string memory) {
        Proposal storage prop=get_proposal(fund_index, proposal_index);
        string memory status;
        string memory opinion;
        
        if(!isInvester(fund_index)){
            opinion="--";
        }else if(is_voted(fund_index, proposal_index)){
            opinion="Voted";
        }else{
            opinion="Not voted";
        }
        if(is_proposal_pass(fund_index,proposal_index)){
            if(prop.isClosed){
                status="Withdrawaled";
            }else{
                status="Passed";
                }
        }else if(is_proposal_failed(fund_index,proposal_index)){
            status="Failed";
        }else{
            status="Ongoing";
        }
        //test[test_num]=status;
        return(prop.title,prop.description,prop.amount,prop.voted,prop.votes,status,opinion);
    }

    function get_invester_number(uint fund_index) public view returns(uint){
        return crowdfunds[fund_index].investersize;
    }

    function get_weight(uint fund_index) public view onlyInvester(fund_index) returns(uint256){
            Invester storage inv=get_invester(fund_index);
            return inv.weight;
    }

    function isInvester(uint fund_index) internal view returns (bool){
        for (uint index = 0; index < crowdfunds[fund_index].investersize; index++) {
            if(msg.sender==crowdfunds[fund_index].invester[index].addr) {
                return true;   
            }
        }
        return false;
    }

    modifier fund_available(uint fund_index){
        require(block.timestamp<=crowdfunds[fund_index].due);
        _;
    }

    modifier onlyInvester(uint fund_index) {
        require(
            isInvester(fund_index),"Only invester can call this"
        );
    _;
    }

    modifier onlyRaiser(uint fund_index){
        require(crowdfunds[fund_index].raiser==msg.sender,"Only raiser can call this");
        _;
    }

    modifier noRaiser(uint fund_index){
        require(!(crowdfunds[fund_index].raiser==msg.sender),"Only raiser can NOT call this");
        _;
    }

    function get_invester(uint fund_index) internal view onlyInvester(fund_index) returns(Invester storage){
        for (uint index = 0; index < crowdfunds[fund_index].investersize; index++) {
            if(msg.sender==crowdfunds[fund_index].invester[index].addr) {
                return crowdfunds[fund_index].invester[index];   
            }
        }
        revert();
    }

    modifier inrange_fund(uint fund_index){
        require(fund_index>=0&&fund_index<crowdfunds_count,"Index out of range.");
        _;
    }

    modifier inrange_proposal(uint fund_index,uint proposal_index){
        require(proposal_index>=0&&proposal_index<crowdfunds[fund_index].proposal_size,"Index out of range.");
        _;
    }

    function get_fund(uint fund_index) internal view inrange_fund(fund_index) returns(Crowdfund storage){
        return crowdfunds[fund_index];
    }

    function get_proposal(uint fund_index,uint proposal_index) internal view inrange_fund(fund_index) inrange_proposal(fund_index,proposal_index) returns(Proposal storage){
        return crowdfunds[fund_index].proposals[proposal_index];
    }


    function vote_for_proposal(uint fund_index,uint proposal_index,bool vote) public onlyInvester(fund_index) {
            Invester storage invester=get_invester(fund_index);
            Proposal storage prop=get_proposal(fund_index, proposal_index);
            if(is_voted(fund_index, proposal_index))
                revert();
            prop.voted_invester[prop.voted_count].addr=msg.sender;
            prop.voted_invester[prop.voted_count].opinion=vote;
            prop.voted_count++;
            //prop.invester_opinion.push(vote);
            prop.voted+=invester.weight;
            if(vote){
                prop.votes+=invester.weight;
            }
            
    }

    function proposal_pass(uint fund_index,uint proposal_index) public onlyRaiser(fund_index)  {
        Crowdfund storage fund=get_fund(fund_index);
        Proposal storage prop=get_proposal(fund_index, proposal_index);
        if(prop.isClosed||(!is_proposal_pass(fund_index,proposal_index)))
            revert();
        
        fund.raiser.transfer(prop.amount);
        fund.current_amount-=prop.amount;
        prop.isClosed=true;

    }

    function is_proposal_failed(uint fund_index,uint proposal_index) internal view returns(bool){
        Proposal storage prop=get_proposal(fund_index, proposal_index);
        Crowdfund storage fund=get_fund(fund_index);
        if(prop.voted-prop.votes>=fund.total_amount/2){//反对票超过一半
            
            return true;
        }else{
            return false;
        }
    }

    function is_proposal_pass(uint fund_index,uint proposal_index) internal view returns(bool) {
        Proposal storage prop=get_proposal(fund_index, proposal_index);
        Crowdfund storage fund=get_fund(fund_index);
        if(prop.votes>fund.total_amount/2){
            return true;
        }else{
            return false;
        }

    }

    function is_voted(uint fund_index,uint proposal_index) public view onlyInvester(fund_index) returns(bool){
        for(uint i=0;i<crowdfunds[fund_index].proposals[proposal_index].voted_count;i++){
                if(msg.sender==crowdfunds[fund_index].proposals[proposal_index].voted_invester[i].addr){//see if the invester has already voted
                    return true;
                }
            }
            return false;
    }
    /*
    //1.���Ʊ��ÿ��ֻ��Ͷ1ETH
    function play() public payable {
        require(msg.value == 0.1 ether);
        //2.�Ѳ����߼�������
        players.push(msg.sender);
    }*/

    modifier onlyManager{
        require(msg.sender == manager);
        _;
    }
/*
    function getPlayersCount() public view returns (uint256){
        return players.length;
    }

    function draw() public onlyManager {
        //��������ʱ�䡢�����Ѷȡ������������������
        bytes memory v1 = abi.encodePacked(block.timestamp, block.difficulty, players.length);
        bytes32 v2 = keccak256(v1);
        uint256 v3 = uint256(v2);
        uint256 index = v3 % players.length;
        //��¼��һ���н���
        winner = players[index];
        //ת��
        uint256 money = address(this).balance * 90 / 100;
        uint256 money2 = address(this).balance - money;
        winner.transfer(money);
        manager.transfer(money2);
        //����������������һ����ղ����
        round++;
        delete players;
    }

    function refund() public onlyManager {
        for (uint256 i = 0; i < players.length; i++) {
            players[i].transfer(0.1 ether);
        }
        round++;
        delete players;
    }
    
    function getPlayers() public view returns(address payable[] memory){
        return players;
    }
*/
    function getBalance() public view returns (uint256){
        return address(this).balance;
    }

}