// SPDX-License-Identifier: MIT
pragma solidity 0.4.24;

//与某个用户相关的所有众筹项目
contract relatedFundings{
    mapping(address => address[]) Fundings;
    function setFunding(address user,address funding) public {
        Fundings[user].push(funding);
    }
    function getFunding(address user)public view returns(address [] memory ){
        return Fundings[user];
    }
}

contract Funding{
    address public creator; //众筹发起者
    string public name; //众筹项目名
    uint public present;  //当前金额
    uint public target;  //目标金额
    uint public endTime; //结束时间
    address [] public investors;  //参与者
    uint[] public support;  //对应参与者的捐赠数
    mapping(address => bool) allInvestors;  //某个用户是否参与了众筹
    relatedFundings related;
    uint public requestNum;

    struct Request{
        string purpose;
        address seller;
        uint cost;
        uint approvedCount;
        uint status;   //0-投票中，1-已经取得大多数同意，2-已完成
        mapping(address => bool) isVoted;
    }
    Request [] public Requests;

    constructor(string memory _name, uint _target, uint _duration,address _creator, relatedFundings _related) public{
        creator = _creator;
        name = _name;
        target = _target;
        endTime = block.timestamp + _duration;
        related = _related;
        requestNum = 0;
    }
    //参与众筹
    function invest(uint money,address user) public payable{
        require(block.timestamp < endTime);
        require(money>0);
        require(present + money <= target);
        require(user != creator);
        require(allInvestors[user] == false);
        investors.push(user);
        support.push(money);
        allInvestors[user] = true;
        related.setFunding(user,this);
        present += money;
    }
    //获取剩余持续时间
    function getLastTime() public view returns(uint){
        return endTime - block.timestamp;
    }
    function investorCount() public view returns(uint){
        return investors.length;
    }
    function getRequestNum() public view returns(uint){
        return requestNum;
    }
    function get_investors() public view returns(address [] memory){
        return investors;
    }
    function find_user(address target_user) private returns(uint){
        for(uint i = 0;i<investors.length;i++){
            if(investors[i] == target_user){
                return i;
            }
        }
    }
    //单个用户退款
    function refund_for_one() public{
        uint i = find_user(msg.sender);
        investors[i].transfer(support[i]);
        allInvestors[msg.sender] = false;
        for(uint j = i;j<investors.length-1;j++){
            investors[j] = investors[j+1];
            support[j] = support[j+1];
        }
        investors.length -= 1 ;
        support.length -= 1;
    }
    //所有用户统一退款
    function refund_for_all() public{
        for(uint i = 0;i<investors.length;i++){
            allInvestors[investors[i]]= false;
            investors[i].transfer(support[i]);
            present -=support[i];
        }
        for(uint j = 0;j<investors.length;j++){
            delete investors[j];
            delete support[j];
        }
        investors.length=0;
        support.length=0;
    }
    //创建一个需求
    function createRequest(string memory _purpose,address _seller, uint _cost) public{
        Request memory req = Request({
            purpose: _purpose,
            seller: _seller,
            cost: _cost,
            approvedCount: 0,
            status: 0
        });
        requestNum++;
        Requests.push(req);
    }
    //用户同意需求
    function approveRequest(uint i) public {
        require(allInvestors[msg.sender]);
        Request storage req = Requests[i];
        require(req.isVoted[msg.sender] == false);
        req.approvedCount += support[find_user(msg.sender)];
        req.isVoted[msg.sender] = true;
        if(req.approvedCount * 2 >= target){
            req.status = 1;
        }
    }
    //用户拒绝需求
    function denyRequest(uint i)public{
        require(allInvestors[msg.sender]);
        Request storage req = Requests[i];
        require(req.isVoted[msg.sender] == false);
        req.isVoted[msg.sender] = true;
    }
    //完成需求
    function finishRequest(uint i) public {
        require(Requests[i].status == 1);
        require(address(this).balance >= Requests[i].cost);
        Requests[i].seller.transfer(Requests[i].cost);
        Requests[i].status = 2;
    }
    function getBalance() public view returns(uint256){
        return address(this).balance;
    }

}

