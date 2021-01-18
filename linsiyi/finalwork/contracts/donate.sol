// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
contract donate {
    
    uint total=0;
    mapping(uint => project)public all_projects;

    struct project{
        address payable owner;
        string summary;
        string intro;
        uint start_time;
        uint end_time;
        uint money_needed;
        uint money_raised; 
        uint use_count;
        uint p_count;
        uint money_available;
        mapping(uint=>participant)participants;
        mapping(uint=>use)uses;
        
    }

    struct participant{
        address payable addr;
        uint money;
        int agree;//1 for agree, -1 for disagree
    }
    
    struct use{
        string info;
        uint money_needed;
        uint money_agree;
        uint money_disagree;
        int result;
    }
   
    function createProject(string memory s,string memory i,uint st,uint en,uint money,address payable addr)public {
        require(en>=block.timestamp);

        total=total+1;
        project storage cur=all_projects[total];
        cur.owner=addr;
        cur.summary=s;
        cur.intro=i;
        cur.start_time=st;
        cur.end_time=en;
        cur.money_needed=money;
        cur.money_raised=0;
        cur.money_available=0;
        cur.use_count=0;
    } 
    function createUse(uint prjID,uint money_needed,string memory info)public {
        require(prjID<=total&&prjID>=1);
        require(money_needed<=all_projects[prjID].money_raised);
       // require(msg.sender==all_projects[prjID].owner);

        project storage p =all_projects[prjID];
        p.use_count=p.use_count+1;
        use storage u=p.uses[p.use_count];
        u.info=info;
        u.money_needed=money_needed;
        u.money_agree=0;
        u.money_disagree=0;
        u.result=0;
       //p.money_raised-=money_needed;
    }
    function getAddress() public view returns(address payable){
        return address(uint160(address(this)));
    }
    function invest(uint prjID,uint amount,address payable addr)public payable{
        require(prjID>=1&&prjID<=total);
        require(all_projects[prjID].end_time>=block.timestamp);
        require(amount+all_projects[prjID].money_raised<=all_projects[prjID].money_needed);
        project storage p=all_projects[prjID];
        participant storage funder=p.participants[p.p_count+1];
        p.money_raised+=amount;
        p.money_available+=amount;
        
        p.p_count=p.p_count+1;
        //funder=p.participants[p.p_count];
        funder.addr=addr;
        funder.money=amount;
        //address payable addr=getAddress();
        //addr.transfer(amount);

    }
    function vote(uint pid,uint uid,address payable addr,int agree)public {
        require(pid>=1&&pid<=total);
        require((uid<=all_projects[uid].use_count));
        project storage p=all_projects[pid];
        //participant storage funder=p.participants[0];
        for(uint i=1;i<=p.p_count;i++){
            if(p.participants[i].addr==addr){
                participant storage funder=p.participants[i];
                use storage u=p.uses[uid];
                funder.agree=agree;
                if(agree>0)u.money_agree+=funder.money;
                else u.money_disagree+=funder.money;
                break;
            }
        }
       // participant storage funder= p.participants[fid];
        
    }

    function checkResult(uint pid,uint uid)public returns (int){
        require(pid>=1&&pid<=total);
        require((uid<=all_projects[uid].use_count));
        project storage p=all_projects[pid];
        use storage u=p.uses[uid];
        if(u.result!=0)return u.result;
        if(u.money_agree+u.money_disagree==p.money_raised){
            if(u.money_agree*2>=p.money_needed){
                u.result=1;
                p.money_available-=u.money_needed;
               // p.owner.transfer(u.money_needed);
            }
            else u.result=-1;
        }
        return u.result;
    }
    function getUseNum(uint pid)public view returns (uint){
        return all_projects[pid].use_count;
    }
    
    function getUseInfo(uint pid,uint uid)public view returns(string memory){
        return all_projects[pid].uses[uid].info;
    }
    function getUseMoney(uint pid,uint uid)public view returns(uint){
        return all_projects[pid].uses[uid].money_needed;
    }
    function getUseAgree(uint pid,uint uid)public view returns(uint){
        return all_projects[pid].uses[uid].money_agree;
    }
    function getUseDisagree(uint pid,uint uid)public view returns(uint){
        return all_projects[pid].uses[uid].money_disagree;
    }

    function getTotalNum()public view returns(uint){
        return total;
    }
    function getsummary(uint i)public view returns (string memory){
        return all_projects[i].summary;
    }
    function getowner(uint i)public view returns(address payable){
        return all_projects[i].owner;
    }
    function getend_time(uint i)public view returns (uint){
        return all_projects[i].end_time;
    }
    function getstart_time(uint i)public view returns (uint){
        return all_projects[i].start_time;
    }
    function getmoney_needed(uint i)public view returns (uint){
        return all_projects[i].money_needed;
    }
    function getmoney_raised(uint i)public view returns (uint){
        return all_projects[i].money_raised;
    }
    function getmoney_available(uint i)public view returns (uint){
        return all_projects[i].money_available;
    }
    function getInfo(uint i)public view returns (string memory){
        return all_projects[i].intro;
    }
    function getFunderMoney(uint id,address payable addr)public view returns(uint){
        
        project storage p=all_projects[id];
        for(uint i=1;i<=p.p_count;i++){
            if(p.participants[i].addr==addr){
                return p.participants[i].money;

            }
        }
        return 0;
        
    }
    
    
}