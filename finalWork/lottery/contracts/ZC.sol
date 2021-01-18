pragma solidity >=0.4.17 <0.9.0;

contract ZC{

    struct Contributor{  //众筹人
        address addr; 
        uint money; 
    }

    struct Recipient{ //投资人
        address reciaddr; 
        uint goal;
        uint amount; 
        uint number; 
        mapping(uint => Contributor) map; 
    }
    
    uint public recid; 
    mapping(uint => Recipient) recimap; 

    function create_zhongchou(address _address,uint _goal) public {
        recid++;
        recimap[recid] = Recipient(_address,_goal,0,0);
        
    }
    function touzi(address Newaddress,uint _recid) public  payable{
        Recipient storage _recipient = recimap[_recid];
        _recipient.amount += msg.value;
        _recipient.number++;
        _recipient.map[ _recipient.number] = Contributor(Newaddress,msg.value);
        
    }
    
    function panduan(uint _recid)public returns(bool){
        Recipient storage _recipient = recimap[_recid];
        if(_recipient.amount >= _recipient.goal){
            _recipient.reciaddr.transfer(_recipient.amount);
            return true;
        }return false;
    }
}


