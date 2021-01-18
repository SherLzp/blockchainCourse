// SPDX-License-Identifier: MIT

pragma solidity >=0.4.0;

contract CrowdFunding{
	
	struct User{
		address payable uaddr;	// user address
		bool isUsed;			
		uint[] fidinv;			// investment id (as investor)
		uint[] fidspn;			// fund id (as fund sponsor)
		uint[] ridList;         // request list
	}

	enum FundState {FUND_PENDING, FUND_FAIL, FUND_SUCCESS}

	struct Fund{
		uint fid;				// fund id (idx in funds)
		FundState state;		// fund state
		string introduction;	// fund in0troduction
		uint goalFund;			// fund goal
		uint currentFund;		// fund current money
		uint ddl;				// fund ddl
		uint sponsorid;			// fund sponsor
		uint[] invid;			// invest id
		uint[] reqid;			// request id
	}

	enum InvestState {INVEST_PENDING, INVEST_FAIL, INVEST_SUCCESS}

	struct Investment{
		InvestState state;	// invest state
		uint fid;			// fund id
		uint investorid;	// investor id
		uint amount;		// investment amount
		uint time;			// investment time
	}

	enum RequestState {REQUEST_PENDING, REQUEST_FAIL, REQUEST_SUCCESS}
	enum InvestorState {INV_PENDING, INV_AGREE, INV_DISAGREE}

	struct Request{
		RequestState state;			// request state
		uint fid;					// fund id
		string introduction;		// request introduction
		uint amount;				// request money
		uint current;				// request current amount
		uint ddl;					// request ddl
		InvestorState[] invstate;	// investor state
	}

	User[] private users;				// users
	Fund[] private funds;				// funds stored in struct Fund
	Investment[] private investments;	// investments 
	Request[] private requests;			// requests
	mapping (address => uint) private UID;	// user addr to uid

    function getFundNum() public view returns(uint){
        return funds.length;
    }
    
    function getInvNum() public returns(uint){
        return users[getUserID(msg.sender)].fidinv.length;
    }
    
    function getSpnNum() public returns(uint){
        return users[getUserID(msg.sender)].fidspn.length;
    }
    
    function getInvest(uint iid) public returns(uint, uint, string memory, uint, uint, uint){   // fid, fstate, fintro, fgoal, investamt, investtime
        require(iid < getInvNum());
        Fund storage f = funds[investments[users[getUserID(msg.sender)].fidinv[iid]].fid];
        uint state = f.state == FundState.FUND_PENDING ? 0 : (f.state == FundState.FUND_SUCCESS ? 1 : 2);
        return(f.fid, state, f.introduction, f.goalFund, investments[users[getUserID(msg.sender)].fidinv[iid]].amount, investments[users[getUserID(msg.sender)].fidinv[iid]].time);
    }
    
    function getSponsor(uint sid) public returns(uint, uint, string memory, uint, uint, uint){
        require(sid < getSpnNum());
        Fund storage f = funds[users[getUserID(msg.sender)].fidspn[sid]];
        uint state = f.state == FundState.FUND_PENDING ? 0 : (f.state == FundState.FUND_SUCCESS ? 1 : 2);
        return(f.fid, state, f.introduction, f.goalFund, f.currentFund, f.ddl);
    }
    
    function getAvaNum() public view returns(uint){
        uint cnt = 0;
        for(uint i = 0; i < funds.length; i++) 
            if(funds[i].state == FundState.FUND_PENDING) cnt++;
        return cnt;
    }
    
    function getAva(uint tid) public view returns(uint, uint, string memory, uint, uint, uint){
        require(tid < getAvaNum());
        uint cnt = 0;
        uint i;
        for(i = 0; i < funds.length; i++) 
        {
            if(funds[i].state == FundState.FUND_PENDING) cnt++;
            if(cnt == tid + 1) break;
        }
        Fund storage f = funds[i];
        uint state = f.state == FundState.FUND_PENDING ? 0 : (f.state == FundState.FUND_SUCCESS ? 1 : 2);
        return(f.fid, state, f.introduction, f.goalFund, f.currentFund, f.ddl);
    }
    
    function getRequestList() public returns(uint[] memory){
        return users[getUserID(msg.sender)].ridList;
    }
    
    function getRequest(uint rid) public view returns(uint, uint, string memory, uint, uint, uint){
        require(rid < requests.length);
        uint state = requests[rid].state == RequestState.REQUEST_PENDING ? 0 : (requests[rid].state == RequestState.REQUEST_SUCCESS ? 1 : 2);
        return(state, requests[rid].fid, requests[rid].introduction, requests[rid].amount, requests[rid].current, requests[rid].ddl);
    }
    
	function getUserID (address _user) public returns(uint){
		if(users[UID[_user]].isUsed) return UID[_user];
		else{
			User memory newUser = User(payable(_user), true, new uint[](0), new uint[](0), new uint[](0)); // ?, new uint[], new uint[]
			UID[newUser.uaddr] = users.length;
			users.push(newUser);
			return UID[newUser.uaddr];
		}
	}

	function updateFundState() public{
		for(uint i = 0; i < funds.length; i++){
			if(funds[i].state == FundState.FUND_PENDING && block.timestamp > funds[i].ddl){
				funds[i].state = FundState.FUND_FAIL;
				for(uint j = 0; j < funds[i].invid.length; j++)  {
					users[investments[funds[i].invid[j]].investorid].uaddr.transfer(investments[funds[i].invid[j]].amount);	// return back the investors' money
					investments[funds[i].invid[j]].state = InvestState.INVEST_FAIL;
				}
			}
		}
	}

	function createFund (string memory _introduction, uint _goal, uint _ddl) public{
		require(_ddl > 0, "DDL too early!");
		require(_goal > 0, "GOAL = 0!");
		uint sponsorid = getUserID(msg.sender);
		users[sponsorid].fidspn.push(funds.length);
		Fund memory newFund = Fund(funds.length, FundState.FUND_PENDING, _introduction, _goal, 0, _ddl + block.timestamp, sponsorid, new uint[](0), new uint[](0)); // ?, new uint[], new uint[]
		funds.push(newFund);
	}

	function investFund (uint fid) public payable{
		require(funds.length > fid, "Fund Index Error!");
		updateFundState();
		require(funds[fid].state == FundState.FUND_PENDING, "Fund already closed!");
		Investment memory newInvest = Investment(InvestState.INVEST_PENDING, fid, getUserID(msg.sender), msg.value, block.timestamp);
		if(msg.value > funds[fid].goalFund - funds[fid].currentFund){
			payable(msg.sender).transfer(msg.value + funds[fid].currentFund - funds[fid].goalFund);
			newInvest.amount = funds[fid].goalFund - funds[fid].currentFund;
		}
		funds[fid].currentFund += newInvest.amount;
		if(funds[fid].currentFund >= funds[fid].goalFund) 
		{
			funds[fid].state = FundState.FUND_SUCCESS;	// update fund state
			newInvest.state = InvestState.INVEST_SUCCESS;
			for(uint i = 0; i < funds[fid].invid.length; i++) investments[funds[fid].invid[i]].state = InvestState.INVEST_SUCCESS;
		}
		funds[fid].invid.push(investments.length);
		users[getUserID(msg.sender)].fidinv.push(investments.length);
		investments.push(newInvest);
	}

	function createRequest(uint _fid, string memory _introduction, uint _amount, uint _ddl) public{
		require(funds.length > _fid, "Fund Index Error!");
		require(_ddl > block.timestamp, "DDL too early!");
		updateFundState();
		require(funds[_fid].sponsorid == getUserID(msg.sender), "You're not fund sponsor!");
		require(funds[_fid].state == FundState.FUND_SUCCESS, "Fund not success!");
		require(funds[_fid].currentFund >= _amount, "Request too much!");
		Request memory newRequest = Request(RequestState.REQUEST_PENDING, _fid, _introduction, _amount, 0, _ddl, new InvestorState[](funds[_fid].invid.length));
		for(uint i = 0; i < newRequest.invstate.length; i++) 
		{
		    newRequest.invstate[i] = InvestorState.INV_PENDING;
		    users[investments[funds[_fid].invid[i]].investorid].ridList.push(requests.length);
		}
		funds[_fid].reqid.push(requests.length);
		requests.push(newRequest);
		funds[_fid].currentFund -= _amount;
	}

	function updateRequestState() public{
		for(uint i = 0; i < requests.length; i++){
			if(requests[i].state == RequestState.REQUEST_PENDING && block.timestamp > requests[i].ddl){
				requests[i].state = RequestState.REQUEST_FAIL;
			}
		}
	}

	function agreeRequest(uint fid, uint reqid) public{
		require(fid < funds.length, "Fund Index Error!");
		require(reqid < requests.length, "Request Index Error!");
		require(funds[fid].state == FundState.FUND_SUCCESS, "Fund not success!");
		updateRequestState();
		require(requests[reqid].state == RequestState.REQUEST_PENDING, "Request closed!");
		for(uint i = 0; i < funds[fid].invid.length; i++) 
		{
			if(investments[funds[fid].invid[i]].investorid == getUserID(msg.sender))
			{
				requests[reqid].current += investments[funds[fid].invid[i]].amount;
				requests[reqid].invstate[i] = InvestorState.INV_AGREE;	
			}
		}
		if(requests[reqid].current * 2 >= requests[reqid].amount)
		{
			requests[reqid].state = RequestState.REQUEST_SUCCESS;
			users[funds[requests[reqid].fid].sponsorid].uaddr.transfer(requests[reqid].amount);
		}
	}

	function disagreeRequest(uint fid, uint reqid) public{
		require(fid < funds.length, "Fund Index Error!");
		require(reqid < requests.length, "Request Index Error!");
		require(funds[fid].state == FundState.FUND_SUCCESS, "Fund not success!");
		updateRequestState();
		require(requests[reqid].state == RequestState.REQUEST_PENDING, "Request closed!");
		for(uint i = 0; i < funds[fid].invid.length; i++) 
		{
			if(investments[funds[fid].invid[i]].investorid == getUserID(msg.sender) && requests[reqid].invstate[i] == InvestorState.INV_PENDING)
			{
				requests[reqid].invstate[i] = InvestorState.INV_DISAGREE;	
			}
		}
	}

}