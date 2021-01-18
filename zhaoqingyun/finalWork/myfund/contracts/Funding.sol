pragma solidity ^0.4.24;
contract Funding {
    address admin;// funding owner
    string txt;// funding description
    string project; // project name
    uint money; // money need to raise
    uint endtime; // funding end time
    uint raise; // money now raised
    bool finished;// if funding finished
    uint number; // inverstor numbers
    mapping(uint => Record) records;// each inverstors
    
    struct Record {// investor imformation
        address investor; // inverstor address
        uint coin; // investor money
    }
    SupportFunding supportFunding;//used for record investors and fund address pairs
    
    constructor(string _project, string _txt, uint _money, uint _endtime) public {
        project = _project;
        txt = _txt;
        money = _money * 10**18;//transform to wei
        raise = 0;
        finished = false;
        number=0;
        endtime = _endtime;
    }
    function createFund (address creator,SupportFunding _supportFunding) public{// add information
        admin = creator;
        supportFunding = _supportFunding;
    }
    modifier onlyManager { // add restriction
        require(msg.sender == admin);
        _;
    }

    function getInvestors() public view returns(address[]) {//get all investor
        address[] memory investors = new address[](number);
        uint i;
        for(i=0;i<number;i++){
            investors[i] = records[i].investor;
        }
        return investors;
    }

    function checkEnd() public returns(bool){//check end condition
        if(endtime >= now || raise >= money){//time and money condition
            finished=false;
        }
        return finished;
    }

    function getLeftTime() public view returns(uint) {//check left time
        return endtime - now;
    }

    function invest() public payable returns(uint) {
        require(!finished);
        if(now<endtime){// the funding has not reach endtime
            raise += msg.value;
            bool flag = false;
            for(uint i = 0;i<number; i++){
                if(records[i].investor==msg.sender){//check if the investor already has invested
                    records[i].coin+=msg.value;//if already has records, then change the invest money
                    flag=true;
                }
            }
            if(flag==false){//if has not invested, add new records
                records[number++] = Record(msg.sender, msg.value);  
                supportFunding.setFunding(msg.sender, this);
            }
            finished = raise >= money * 1 ether ? true : false; //check if funding finished
        }
        else{
            finished = true;
        }
    }
  
    enum RequestStates {//requerst states
        Voting, Approved, Completed
    }

    struct Request {
        uint rid;//index of request
        string purpose;// request purpose
        uint cost;// request asked money
        address seller; // transfrom money to this address
        uint approveCount;// use 100 count to represent all and calculate each investors'count
        RequestStates states; // now states
        mapping(address=>bool) isVotedMap; // check if the investor has already voted
    }

    Request[] requests;//all requests for fundings
    
    function createRequest(string _purpose, uint _cost, address _seller) onlyManager public {
        Request memory req = Request({
            rid : requests.length,
            purpose : _purpose,
            cost : _cost * 10**18,//transform to wei
            seller : _seller,
            approveCount : 0,
            states : RequestStates.Voting
        });
        requests.push(req);
    }
    

    function approveRequest(uint i) public {
        Request storage req = requests[i];
        for(uint j=0;j<number;j++){
            if(records[j].investor==msg.sender){//check if this person already invest
                // transform to 100 count as invest money shares
                req.approveCount+=(uint)(records[j].coin*100/money);
                req.isVotedMap[msg.sender] = true;
            }
        }
    }
 
    function payRequest(uint256 i) onlyManager public {
        Request storage req = requests[i];
        require(address(this).balance >= req.cost);//if money is enough
        require(req.approveCount >= 50);//if more than 50% investor agrees
        req.seller.transfer(req.cost);//pay the bill
        req.states = RequestStates.Completed;//change state
    }
        
    function getRequestCount() public view returns(uint) {
        return requests.length;
    }
        
    function getRequest(uint256 i) public view returns(uint,string, uint, address, uint, RequestStates) {
        Request memory req = requests[i];
        return (req.rid, req.purpose, req.cost, req.seller, req.approveCount, req.states);
    }
}
contract SupportFunding {//all fundings supported by one address
    mapping(address=>address[]) supportMap;
    function setFunding(address _supportor, address _funding) public {//add a pair in maps
        if(checkFundings(_supportor, _funding)==false){//one fund will not be added twice
            supportMap[_supportor].push(_funding);
        }
    }
    function getFundings(address _supportor) public view returns(address[]) {//get all funds supported by address
        return supportMap[_supportor];
    }
    function checkFundings(address _supportor, address _funding) public view returns (bool){//check if the address already support the fund
        for(uint i = 0 ;i<supportMap[_supportor].length;i++){
            if(supportMap[_supportor][i]==_funding){
                return true;//address already support this fund
            }
        }
        return false;
    }
}
contract FundingFactory {
    address manager;
    address[] Funds;//records all funds
    mapping(address=>address[]) creatorFundings;//all fundings created by one address
    SupportFunding support;//all fundings supported by one address
    
    constructor() public {
        manager = msg.sender;
        support = new SupportFunding();
    }
    
    function createFunding(string _name, uint _money, string _txt, uint _endtime) public {
        Funding funding = new Funding(_name, _txt, _money, _endtime);
        funding.createFund(msg.sender,support);//send support for fund to maintain
        Funds.push(funding);
        creatorFundings[msg.sender].push(funding);
    }
    
    function getAllFundings() public view returns(address[]) {//get all funds
        return Funds;
    }
        
    function getCreatorFunding() public view returns(address[]) {//get all funds created by address
        return creatorFundings[msg.sender];
    }
     
    function getSupportorFunding() public view returns(address[]) {//get all funds supported by address
        return support.getFundings(msg.sender);
    }
}