import web3 from '../utils/InitWeb3';

const abi = [
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "projectCreator",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "projectTitle",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "projectDescription",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "projectTarget",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "projectStartTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "projectDeadline",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "contribute",
    "outputs": [],
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
    "outputs": [],
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
    "name": "getDetail",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "projectCreator",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "projectTitle",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "projectDescription",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "projectTarget",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "projectStartTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "projectDeadline",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "projectCompleteTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "projectEndTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "projectBalance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "projectUsageBalance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "projectTotal",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "projectContribution",
        "type": "uint256"
      },
      {
        "internalType": "enum Project.State",
        "name": "projectState",
        "type": "uint8"
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
        "internalType": "enum Project.State",
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
  }
];

export default (address) => {
  const instance = new web3.eth.Contract(abi, address);
  return instance;
};
  