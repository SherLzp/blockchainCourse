let web3 = require('../utils/InitWeb3')
let abi = 
[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "fundingID",
				"type": "uint256"
			}
		],
		"name": "check_goal_reached",
		"outputs": [
			{
				"internalType": "bool",
				"name": "reached",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"name": "check_part",
		"outputs": [
			{
				"internalType": "bool",
				"name": "r",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "fundingID",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "requestID",
				"type": "uint256"
			}
		],
		"name": "check_pass",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "check_time",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "info",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "e_time",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "create_funding",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "fundingID",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "fundingID",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "p",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "a",
				"type": "uint256"
			}
		],
		"name": "create_request",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "get_funding",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount_get",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "start_time",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "end_time",
				"type": "uint256"
			},
			{
				"internalType": "enum crowdfunding.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "info",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "s",
				"type": "address"
			}
		],
		"name": "get_funding_con",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount_get",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "start_time",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "end_time",
				"type": "uint256"
			},
			{
				"internalType": "enum crowdfunding.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "info",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "contribution",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "get_num_fundings",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "n",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "get_num_request",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "n",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "rid",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "inv",
				"type": "address"
			}
		],
		"name": "get_request",
		"outputs": [
			{
				"internalType": "string",
				"name": "purpose",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "enum crowdfunding.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "r",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "fundingID",
				"type": "uint256"
			}
		],
		"name": "participant_funding",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "fundingID",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "requestID",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "agree",
				"type": "bool"
			}
		],
		"name": "reply",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "fundingID",
				"type": "uint256"
			}
		],
		"name": "return_eth",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const address = '0x3E18DA3B478408fdD28Afd84a34FF73218143e44';
const instance = new web3.eth.Contract(abi, address);

module.exports = instance;
