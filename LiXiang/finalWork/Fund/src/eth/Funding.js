import web3 from '../utils/InitWeb3';

let abi = [
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "FundingCreator",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "FundingTitle",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "FundingDescription",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "FundingTarget",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "FundingStartTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "FundingDeadline",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "log",
          "type": "string"
        }
      ],
      "name": "Recordlog",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "createflag",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "currentAddress",
          "type": "address"
        }
      ],
      "name": "SuccessEvent",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "contributions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "contributors",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "creator",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "contribute",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "usageTitle",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "usageDescription",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "usageAmount",
          "type": "uint256"
        }
      ],
      "name": "createUsage",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bool",
          "name": "approve",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "usageId",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "FundingStartTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "FundingDeadline",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "FundingCompleteTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "FundingEndTime",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getDetail",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "FundingCreator",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "FundingTitle",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "FundingDescription",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "FundingTarget",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "FundingStartTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "FundingDeadline",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "FundingCompleteTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "FundingEndTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "FundingBalance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "FundingUsageBalance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "FundingTotal",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "FundingContribution",
          "type": "uint256"
        },
        {
          "internalType": "enum Funding.State",
          "name": "FundingState",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "usageId",
          "type": "uint256"
        }
      ],
      "name": "getVotingresult",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "usageApprovalnum",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "usageDisapprovalnum",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "usageApprovalContribution",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "usageDisapprovalContribution",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "usageId",
          "type": "uint256"
        }
      ],
      "name": "getUsageDetail",
      "outputs": [
        {
          "internalType": "string",
          "name": "usageTitle",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "usageDescription",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "usageAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "usageApprovalnum",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "usageDisapprovalnum",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "usageApprovalContribution",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "usageDisapprovalContribution",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "usageStartTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "usageEndTime",
          "type": "uint256"
        },
        {
          "internalType": "enum Funding.State",
          "name": "usageState",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "voted",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getUsageNum",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "usageId",
          "type": "uint256"
        }
      ],
      "name": "getUsageAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "usageId",
          "type": "uint256"
        }
      ],
      "name": "getUsagevoted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

export default (address) => {
  let instance = new web3.eth.Contract(abi, address);
  return instance;
};
  