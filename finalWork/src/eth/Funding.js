let web3 = require('../uitls/web3mod')
let abi=[
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "fundId",
        "type": "uint256"
      }
    ],
    "name": "contribute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "issueAmount",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "desc",
        "type": "string"
      }
    ],
    "name": "issue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "beneficiary",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "goal",
        "type": "uint256"
      }
    ],
    "name": "newFunding",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
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
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllFunds",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "starter",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "goal",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "sum",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "votedSum",
            "type": "uint256"
          },
          {
            "internalType": "address payable[]",
            "name": "funders",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "money",
            "type": "uint256[]"
          },
          {
            "internalType": "bool[]",
            "name": "hasVoted",
            "type": "bool[]"
          },
          {
            "internalType": "bool",
            "name": "isIssued",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isTransferred",
            "type": "bool"
          },
          {
            "internalType": "string",
            "name": "desc",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "issueAmount",
            "type": "uint256"
          }
        ],
        "internalType": "struct Fund[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
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
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getFund",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "starter",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "goal",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "sum",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "votedSum",
            "type": "uint256"
          },
          {
            "internalType": "address payable[]",
            "name": "funders",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "money",
            "type": "uint256[]"
          },
          {
            "internalType": "bool[]",
            "name": "hasVoted",
            "type": "bool[]"
          },
          {
            "internalType": "bool",
            "name": "isIssued",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isTransferred",
            "type": "bool"
          },
          {
            "internalType": "string",
            "name": "desc",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "issueAmount",
            "type": "uint256"
          }
        ],
        "internalType": "struct Fund",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFundNum",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
let address = '0x8c797C6775f66fE10f743a566c15448FB2834196'
let contractInstance = new web3.eth.Contract(abi, address)
module.exports = contractInstance



//
// Private Keys
// ==================
// (0) 0x09d41b29574cb6b4200c4245321f1b7a618336b8bd0bb0580c9e074aa9c7858a
// (1) 0x7cec80d21399baa0e1eff40ef3be1f3a55d4d369591111fb370562e55e346d2b
// (2) 0xee97670fc3b192248c3bff2903aee96f05843428341d0e28da9e746b9802f09b
// (3) 0xe7e130dc9d4d2905cd55a8bddb05eb21d5a371d7dfe75a63c444d6e657c301e9
// (4) 0xf252aaf70394a5d477f97485472601ca3215b7c015ac5875a34b321e003179fb
// (5) 0xd13464415601336377f4d146c527f37444ac5bff740b190fdb119c0629edf870
// (6) 0x9c68cab31e45311979f1fd305e77d673a03a2c1389d8c6357603267110cb4bf2
// (7) 0x7cba3617446f12057313d101d03e31736a56bd7b06c62d9d33e62816dc71c334
// (8) 0x3ab22c3f21864b3538c11d1d6d2b6a200266c2d509ba307db260f8deaafb8a04
// (9) 0x7a78a4dc8977da3647cce27a2cbe84c1b0012eaec6f56f170ae1a4dddd2f2b2e
//



// Private Keys
// ==================
// (0) 0x09d41b29574cb6b4200c4245321f1b7a618336b8bd0bb0580c9e074aa9c7858a
// (1) 0x7cec80d21399baa0e1eff40ef3be1f3a55d4d369591111fb370562e55e346d2b
// (2) 0xee97670fc3b192248c3bff2903aee96f05843428341d0e28da9e746b9802f09b
// (3) 0xe7e130dc9d4d2905cd55a8bddb05eb21d5a371d7dfe75a63c444d6e657c301e9
// (4) 0xf252aaf70394a5d477f97485472601ca3215b7c015ac5875a34b321e003179fb
// (5) 0xd13464415601336377f4d146c527f37444ac5bff740b190fdb119c0629edf870
// (6) 0x9c68cab31e45311979f1fd305e77d673a03a2c1389d8c6357603267110cb4bf2
// (7) 0x7cba3617446f12057313d101d03e31736a56bd7b06c62d9d33e62816dc71c334
// (8) 0x3ab22c3f21864b3538c11d1d6d2b6a200266c2d509ba307db260f8deaafb8a04
// (9) 0x7a78a4dc8977da3647cce27a2cbe84c1b0012eaec6f56f170ae1a4dddd2f2b2e
//

