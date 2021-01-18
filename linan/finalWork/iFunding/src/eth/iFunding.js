import web3 from '../utils/InitWeb3';
let abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			}
		],
		"name": "getFundingAddress",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			}
		],
		"name": "getFundingCurrentAmount",
		"outputs": [
			{
				"internalType": "uint128",
				"name": "",
				"type": "uint128"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			}
		],
		"name": "getFundingDeadline",
		"outputs": [
			{
				"internalType": "uint64",
				"name": "",
				"type": "uint64"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			}
		],
		"name": "getFundingDescription",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			},
			{
				"internalType": "address",
				"name": "_sender",
				"type": "address"
			}
		],
		"name": "getFundingInvestment",
		"outputs": [
			{
				"internalType": "uint128",
				"name": "",
				"type": "uint128"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			}
		],
		"name": "getFundingLauncher",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			}
		],
		"name": "getFundingLeftAmount",
		"outputs": [
			{
				"internalType": "uint128",
				"name": "",
				"type": "uint128"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			}
		],
		"name": "getFundingName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			},
			{
				"internalType": "uint32",
				"name": "j",
				"type": "uint32"
			}
		],
		"name": "getFundingRequestApproveVotes",
		"outputs": [
			{
				"internalType": "uint128",
				"name": "",
				"type": "uint128"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			}
		],
		"name": "getFundingRequestCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			},
			{
				"internalType": "uint32",
				"name": "j",
				"type": "uint32"
			}
		],
		"name": "getFundingRequestDisapproveVotes",
		"outputs": [
			{
				"internalType": "uint128",
				"name": "",
				"type": "uint128"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			},
			{
				"internalType": "uint32",
				"name": "j",
				"type": "uint32"
			}
		],
		"name": "getFundingRequestIsVoted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			},
			{
				"internalType": "uint32",
				"name": "j",
				"type": "uint32"
			}
		],
		"name": "getFundingRequestPurpose",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			},
			{
				"internalType": "uint32",
				"name": "j",
				"type": "uint32"
			}
		],
		"name": "getFundingRequestTotalAmount",
		"outputs": [
			{
				"internalType": "uint128",
				"name": "",
				"type": "uint128"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			}
		],
		"name": "getFundingTotalAmount",
		"outputs": [
			{
				"internalType": "uint128",
				"name": "",
				"type": "uint128"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getFundingsCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			}
		],
		"name": "invest",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint128",
				"name": "_totalAmount",
				"type": "uint128"
			},
			{
				"internalType": "uint64",
				"name": "_deadline",
				"type": "uint64"
			}
		],
		"name": "launch",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			},
			{
				"internalType": "string",
				"name": "_purpose",
				"type": "string"
			},
			{
				"internalType": "uint128",
				"name": "_totalAmount",
				"type": "uint128"
			}
		],
		"name": "request",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "i",
				"type": "uint32"
			},
			{
				"internalType": "uint32",
				"name": "j",
				"type": "uint32"
			},
			{
				"internalType": "bool",
				"name": "approve",
				"type": "bool"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
let address = '0xF70c6BA357d6e9498D4a8d13DD830dc292a74196'
let contractInstance = new web3.eth.Contract(abi, address)
export default contractInstance