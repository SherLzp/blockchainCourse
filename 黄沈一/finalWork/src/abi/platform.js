import web3 from '../utils/web3'
export const PlatformAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "projectAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "projectCreator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "projectName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "projectDescription",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "projectDeadline",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "aimedGoal",
        "type": "uint256"
      }
    ],
    "name": "ProjectStarted",
    "type": "event"
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
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "durationInDays",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountToRaise",
        "type": "uint256"
      }
    ],
    "name": "startProject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "returnAllProjects",
    "outputs": [
      {
        "internalType": "contract Project[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
]

const PlatformAdd = '0x7ca1EFD8827DDDdDa47A6271C46752AF9A80Dde0';
const platform = new web3.eth.Contract(PlatformAbi, PlatformAdd);
export default platform;