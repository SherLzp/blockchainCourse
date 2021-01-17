pragma solidity ^0.5.16;

contract cf {
    // sponsor struct
    struct Sponsor {
        address payable addr;                   // addr of sponsor
        uint EthSponsored;                        // amount sponsored
    }

    // request of using fund struct
    struct Bill {
        string billDescription;                 // description of the bill
        uint intention;                         // amount of the bill
        uint agreeAmount;                       // wight of sponsors who's agreed
        uint disagreeAmount;                    // wight of sponsors who's disagreed
        bool expire;                            // if the bill has expired
        mapping(uint => uint) agree;            // state of the bill, 0 means to be determined, 1 for approved ,2 for rejected
    }

    // project struct
    struct Project {
        address payable initiator;
        string title;
        string projectDescription;
        uint intentionAmount;                         // intended amount of eth
        uint endTime;

        bool success;

        uint EthSponsored;                        // current amount of eth raised
        uint numSponsors;
        uint numBills;
        mapping(uint => Sponsor) sponsors;      // dic of all sponsors
        mapping(uint => Bill) bills;            // dic of all bills
    }

    uint public numProjects;                    // num of projects
    mapping(uint => Project) public projects;   // dic of all projects


    function newProject(address payable initiator, string memory title, string memory projectDescription, uint intention, uint endTime) public returns (uint) {
        require(endTime > block.timestamp);

        numProjects = numProjects + 1;
        Project storage f = projects[numProjects];
        f.initiator = initiator;
        f.title = title;
        f.projectDescription = projectDescription;
        f.intentionAmount = intention;
        f.endTime = endTime;
        f.success = false;
        f.EthSponsored = 0;
        f.numSponsors = 0;
        f.numBills = 0;

        return numProjects;
    }

    function sponsorship(uint ID) public payable {

        require(msg.value > 0 && msg.value <= projects[ID].intentionAmount - projects[ID].EthSponsored);

        require(projects[ID].endTime > block.timestamp);

        require(projects[ID].success == false);

        Project storage f = projects[ID];
        f.EthSponsored += msg.value;
        f.numSponsors = f.numSponsors + 1;
        f.sponsors[f.numSponsors].addr = msg.sender;
        f.sponsors[f.numSponsors].EthSponsored = msg.value;

        f.success = f.EthSponsored >= f.intentionAmount;
    }


    function newBill(uint ID, uint intention, string memory billDescription) public {
        require(ID <= numProjects && ID >= 1);
        require(projects[ID].success == true);
        require(intention <= projects[ID].EthSponsored);
        require(msg.sender == projects[ID].initiator);

        Project storage f = projects[ID];
        f.numBills = f.numBills + 1;
        f.bills[f.numBills].billDescription = billDescription;
        f.bills[f.numBills].intention = intention;
        f.bills[f.numBills].agreeAmount = 0;
        f.bills[f.numBills].disagreeAmount = 0;
        f.bills[f.numBills].expire = false;
        f.EthSponsored = f.EthSponsored - intention;
    }


    function approveBill(uint ID, uint useID, bool agree) public {
        require(ID <= numProjects && ID >= 1);
        require(useID <= projects[ID].numBills && useID >= 1);
        require(projects[ID].bills[useID].expire == false);

        for (uint i = 1; i <= projects[ID].numSponsors; i++)
            if (projects[ID].sponsors[i].addr == msg.sender) {
                if (projects[ID].bills[useID].agree[i] == 1) {
                    projects[ID].bills[useID].agreeAmount -= projects[ID].sponsors[i].EthSponsored;
                } else if (projects[ID].bills[useID].agree[i] == 2) {
                    projects[ID].bills[useID].disagreeAmount -= projects[ID].sponsors[i].EthSponsored;
                }
                if (agree) {
                    projects[ID].bills[useID].agreeAmount += projects[ID].sponsors[i].EthSponsored;
                    projects[ID].bills[useID].agree[i] = 1;
                }
                else {
                    projects[ID].bills[useID].disagreeAmount += projects[ID].sponsors[i].EthSponsored;
                    projects[ID].bills[useID].agree[i] = 2;
                }
            }
        checkBill(ID, useID);
    }


    function checkBill(uint ID, uint useID) public {
        require(ID <= numProjects && ID >= 1);
        require(projects[ID].bills[useID].expire == false);

        if (projects[ID].bills[useID].agreeAmount >= projects[ID].intentionAmount / 2) {
            projects[ID].bills[useID].expire = true;
            projects[ID].initiator.transfer(projects[ID].bills[useID].intention);
        }
        if (projects[ID].bills[useID].disagreeAmount > projects[ID].intentionAmount / 2) {
            projects[ID].EthSponsored = projects[ID].EthSponsored + projects[ID].bills[useID].intention;
            projects[ID].bills[useID].expire = true;
        }
    }


    function getBillLength(uint ID) public view returns (uint) {
        require(ID <= numProjects && ID >= 1);
        return projects[ID].numBills;
    }


    function getBill(uint ID, uint useID, address addr) public view returns (string memory, uint, uint, uint, bool, uint) {
        require(ID <= numProjects && ID >= 1);
        require(useID <= projects[ID].numBills && useID >= 1);

        Bill storage u = projects[ID].bills[useID];
        uint agree = 0;
        for (uint i = 1; i <= projects[ID].numSponsors; i++)
            if (projects[ID].sponsors[i].addr == addr) {
                agree = projects[ID].bills[useID].agree[i];
                break;
            }
        return (u.billDescription, u.intention, u.agreeAmount, u.disagreeAmount, u.expire, agree);
    }


    function getBalance() public view returns (uint) {
        return address(this).balance;
    }


    function getMyProjects(address addr, uint ID) public view returns (uint) {
        uint res = 0;
        for (uint i = 1; i <= projects[ID].numSponsors; i++) {
            if (projects[ID].sponsors[i].addr == addr)
                res += projects[ID].sponsors[i].EthSponsored;
        }
        return res;
    }


}
