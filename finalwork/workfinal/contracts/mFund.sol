pragma solidity >=0.4.24;
import "./Fproject.sol";

contract mFund{
    address[] public pro;
    mapping (address=>uint16) private addr_index;
    mapping (address=>uint16[]) private paid;
    mapping (address=>uint16[]) private hosting;
    function GetProList()view public returns(address[] memory){
        return pro;
    }
    function GetHostIdx(address from) view public returns (uint16[] memory idx){
        idx = hosting[from];
        return idx;
    }
    function GetPaidIdx(address from) view public returns (uint16[] memory idx){
        idx = paid[from];
        return idx;
    }
    function AddHostIdx(address from,address proj_addr) public{
        hosting[from].push(addr_index[proj_addr]);
    }
    function AddPaidIdx(address from,address proj_addr) public{
        paid[from].push(addr_index[proj_addr]);
    }
    function RaiseProject(address payable from,string memory summary,uint256 target,uint time) payable public returns(address){
        //创建合约
        Fproject newProject = new Fproject(summary,target,time,from,address(this));
        address res = address(newProject);
        //返回生成的合约的地址
        uint16 idx = uint16(pro.length);
        pro.push(res);
        addr_index[res] = idx;
        AddHostIdx(from, res);
        return res;
    }
}