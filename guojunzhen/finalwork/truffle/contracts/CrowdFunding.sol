// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.7.5;

contract CrowdFunding {
    address public organizer;

    struct Project {
        uint project_id;
        address initiator;
        string title;
        string description;
        uint target;
        uint current_amount;
        uint total_amount;
        uint start;
        uint end;
        uint investment_count;
        Investment[100] investments;
        uint request_count;
        Request[10] requests;
    }

    struct Request{
        uint request_id;
        string description;
        uint amount;
        uint support_count;
        uint[] supporters;
    }

    struct Investment {
        uint investment_id;
        address investor;
        uint amount;
        uint time;
    }


    uint public project_count;
    Project[100] public projects;
    mapping(address => uint[][2]) public relations;

    constructor() public {
        organizer = msg.sender;
        project_count = 0;
    }

    function create_project(string memory title, string memory description, uint target, uint time) public {
        Project storage project = projects[project_count];
        project.project_id = project_count++;
        project.initiator = msg.sender;
        project.title = title;
        project.description = description;
        project.target = target;
        project.current_amount = 0;
        project.total_amount = 0;
        project.start = block.timestamp;
        project.end = project.start + time;
        project.investment_count = 0;
        project.request_count = 0;

        relations[msg.sender][0].push(project.project_id);
    }

    function create_request(uint project_id, string memory description, uint amount) public {
        Project storage project = projects[project_id];
        Request storage req = project.requests[project.request_count];
        req.request_id = project.request_count++;
        req.description = description;
        req.amount = amount;
        req.support_count = 0;
        req.supporters = new uint[](0);
    }

    function create_investment(uint project_id) public payable{
        Project storage project = projects[project_id];
        uint i = 0;
        while(i < project.investment_count){
            if(project.investments[i].investor == msg.sender){
                project.investments[i].amount += msg.value;
                project.investments[i].time = block.timestamp;
                break;
            }        
            i++;   
        }
        if(i ==  project.investment_count){
            require(project.investment_count < 100);
            Investment storage inv = project.investments[project.investment_count];
            inv.investment_id = project.investment_count++;
            inv.investor = msg.sender;
            inv.amount = msg.value;
            inv.time = block.timestamp;

            relations[msg.sender][1].push(project_id);
        }
        project.total_amount += msg.value;
        project.current_amount = project.total_amount;
    }

    function withdraw(uint project_id) public returns(bool){
        Project storage project = projects[project_id];
        bool flag = false;
        uint i = 0;
        while(i < project.investment_count){
            if(project.investments[i].investor == msg.sender){
                flag = true;
                break;
            }
            i++;
        }
        uint amount = project.investments[i].amount;
        if(amount > 0){
            project.investments[i].amount = 0;
            if(!msg.sender.send(amount)){
                project.investments[i].amount = amount;
                return false;
            }
        }
        return true;
    }

    function allow(uint project_id, uint request_id) public {
        bool flag = false;
        uint i = 0;
        uint j = 0;
        Project storage project = projects[project_id];
        while(project.investments[i].investor != msg.sender){
            i++;
        }
        Request storage req = project.requests[request_id];
        flag = true;
        while(j < req.support_count)
        while(j < req.support_count){
            if(req.supporters[j] == i){
                flag = false;
                break;
            }
            j++;
        }
        req.supporters.push(i);
        req.support_count++;
    }

    function check_support_amount(uint project_id, uint request_id) public view returns(bool) {
        uint supportAmount = 0;
        uint i = 0;
        bool result;       
        Project storage project = projects[project_id];
        Request storage req = project.requests[request_id];
        while(i < req.support_count){
            supportAmount += project.investments[req.supporters[i]].amount;
            i++;
        }
        result = supportAmount * 2 > project.total_amount;
        return result;
    }

    function support_rate(uint project_id, uint request_id) public view returns(uint) {
        uint supportAmount = 0;
        uint i = 0;
        uint result;
        Project storage project = projects[project_id];
        Request storage req = project.requests[request_id];
        while(i < req.support_count){
            supportAmount += project.investments[req.supporters[i]].amount;
            i++;
        }
        result = supportAmount * 100 / project.total_amount;
        return result;
    }

    function collect(uint project_id, uint request_id) public returns(bool){
        Project storage project = projects[project_id];
        uint amount = project.requests[request_id].amount;
        if(amount > 0) {
            project.requests[request_id].amount = 0;
            project.current_amount -= amount;
            if(!msg.sender.send(amount)){
                project.requests[request_id].amount = amount;
                project.current_amount += amount;
                return false;
            }
        }
        return true;
    }

    function get_projects() public view returns(uint[] memory, uint[] memory){
        return (relations[msg.sender][0], relations[msg.sender][1]);
    }

    function get_investment(uint project_id, uint investment_id) public view returns(address, uint, uint){
        Investment storage inv = projects[project_id].investments[investment_id];
        return (inv.investor, inv.amount, inv.time);
    }

    function get_request(uint project_id, uint request_id) public view returns(string memory, uint, uint, uint[] memory){
        Request storage req = projects[project_id].requests[request_id];
        return (req.description, req.amount, req.support_count, req.supporters);
    }
}
