// SPDX-License-Identifier: MIT

pragma solidity >=0.4.16;

interface token{
    function transfer(address receiver, uint amount) external;
}

contract Crowdfund{
    struct Funder{
        address payable addr;
        uint amount;
    }
    
    struct useReq{
        uint amount;
        uint progress;
        bool passed;
        //address[] agreer;
        //mapping(address => bool) agreed;
    }
    
    struct Product{
        address payable launcher;
        uint goal;
        uint curr;
        uint funders_num;
        bool finished;
        uint ddl;
        //useReq[] requests;
        mapping(address => uint) funders;
    }
    
    mapping(uint=>mapping(uint=>mapping(address=>bool))) public agreed;
    
    mapping(uint => uint) public reqNums;
    mapping(uint => useReq[]) public requests;
    
    // Product[] public products;
    mapping(address => uint) public userFundsLen;
    mapping(address => uint[]) public userFunds;
    
    mapping(address => uint) public userLaunchsLen;
    mapping(address => uint[]) public userLaunchs;
    
    uint public productsNum;
    mapping(uint => Product) public products;

    function launch(uint goal, uint ddl) public returns(uint){
        Product storage p = products[productsNum];
        p.launcher = msg.sender;
        p.goal = goal;
        p.ddl = ddl;
        p.curr = 0;
        p.funders_num = 0;
        p.finished = false;
        userLaunchs[msg.sender].push(productsNum);
        userLaunchsLen[msg.sender] = userLaunchs[msg.sender].length;
        productsNum++;
        return productsNum;
    }

    function vote(uint index) public payable returns(bool){
        require(msg.value > 0 ether);
        Product storage p = products[index];
        require(p.finished == false);
        
        if(p.funders[msg.sender] == 0){
            p.funders_num++;
        }
        p.funders[msg.sender] += msg.value / 1 ether;
        p.curr += msg.value * 1 wei / 1 ether;
        
        uint[] storage prods = userFunds[msg.sender];
        uint i = 0;
        for(i=0; i<prods.length; i++){
            if(prods[i] == index) break;
        }
        if(i == prods.length){
            prods.push(index);
        }
        userFundsLen[msg.sender] = prods.length;
        
        check(index);
        return true;
    }
    
    function check(uint index) public payable returns(bool){
        Product storage p = products[index];
        if(p.curr < p.goal){
            return false;
        }
        p.finished = true;
        return true;
    }

    function request_use(uint index, uint money) public{
        Product storage p = products[index];
        require(msg.sender == p.launcher);
        require(p.finished);
        require(money <= p.curr);
        
        requests[index].push(useReq(money, 0, false));
        reqNums[index]++;
    }
    
    function agree(uint ind_p, uint ind_r) public payable{
        Product storage p = products[ind_p];
        require(p.funders[msg.sender] > 0 ether);
        require(agreed[ind_p][ind_r][msg.sender] == false);
        
        useReq storage req = requests[ind_p][ind_r];
        
        req.progress += 100 * p.funders[msg.sender] / p.goal;
        agreed[ind_p][ind_r][msg.sender] = true;
        
        if(req.progress <= 50){
            return;
        }
        
        req.passed = true;
        p.launcher.transfer(req.amount * 1 ether);
        p.curr -= req.amount;
    }
}