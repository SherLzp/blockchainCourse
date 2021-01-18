import Web3 from "web3";

let web3 = require("../page/tools/InitWeb3")

let abi = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "ID",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "useID",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "agree",
                "type": "bool"
            }
        ],
        "name": "agreeUse",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "ID",
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
                "internalType": "address payable",
                "name": "initiator",
                "type": "address"
            },
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
                "name": "goal",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            }
        ],
        "name": "newFunding",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
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
                "name": "ID",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "goal",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "info",
                "type": "string"
            }
        ],
        "name": "newUse",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "fundings",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "initiator",
                "type": "address"
            },
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
                "name": "goal",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "numInvestors",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "numUses",
                "type": "uint256"
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
                "internalType": "address",
                "name": "addr",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "ID",
                "type": "uint256"
            }
        ],
        "name": "getMyFundings",
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
                "name": "ID",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "useID",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "addr",
                "type": "address"
            }
        ],
        "name": "getUse",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            },
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
                "name": "ID",
                "type": "uint256"
            }
        ],
        "name": "getUseLength",
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
        "inputs": [],
        "name": "numFundings",
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
let crowdFundInstance = new web3.eth.Contract(abi, '0xebdFD67277b9604edEBa19Bb172f0BFE92E0467B')

function addListener(fn) {
    window.ethereum.on('accountsChanged', fn)
}

async function authenticate() {
    await window.ethereum.enable();
}

async function getAccount() {
    return (await web3.eth.getAccounts())[0];
}

async function getBlockNumber() {
    return (await web3.eth.getBlockNumber());
}

async function getAllFundings()  {
    const length = await crowdFundInstance.methods.numFundings().call();
    const result = []
    for(let i=1; i<=length; i++)
        result.push(await getOneFunding(i));
    return result;
}

async function getOneFunding(index)  {
    const data = await crowdFundInstance.methods.fundings(index).call();
    data.goal = Web3.utils.fromWei(data.goal, 'ether')
    data.amount = Web3.utils.fromWei(data.amount, 'ether')

    return {index, ...data}
}

async function getMyFundingAmount(index) {
    const account = await getAccount();
    return parseInt(Web3.utils.fromWei(await crowdFundInstance.methods.getMyFundings(account, index).call(), 'ether'));
}

async function getMyFundings() {
    const account = await getAccount();
    const all = await getAllFundings();
    const result = {
        init: [],
        contr: []
    };
    for(let funding of all) {
        const myAmount = await getMyFundingAmount(funding.index);
        if(funding.initiator === account) {
            result.init.push({
                myAmount,
                ...funding
            })
        }
        if(myAmount !== 0) {
            result.contr.push({
                myAmount,
                ...funding
            })
        }
    }
    return result;
}

async function contribute(id, value) {
    return await crowdFundInstance.methods.contribute(id).send({from: await getAccount(), value: Web3.utils.toWei(value.toString(10), 'ether')});
}

async function newFunding(account, title, info, amount, seconds) {
    return await crowdFundInstance.methods.newFunding(account, title, info, Web3.utils.toWei(amount.toString(10), 'ether'), seconds).send({
        from: account,
        gas: 1000000
    });
}

async function getAllUse(id) {
    const length = await crowdFundInstance.methods.getUseLength(id).call();
    const account = await getAccount();
    const rusult =[]
    for(let i=1; i<=length; i++) {
        const use = await crowdFundInstance.methods.getUse(id, i, account).call();
        rusult.push({
            index: i,
            info: use[0],
            goal: Web3.utils.fromWei(use[1], 'ether'),
            agreeAmount: Web3.utils.fromWei(use[2], 'ether'),
            disagree: Web3.utils.fromWei(use[3], 'ether'),
            over: use[4],
            agree: use[5]
        });
    }
    return rusult;
}

async function agreeUse(id, useID, agree) {
    const accont = await getAccount();
    return await crowdFundInstance.methods.agreeUse(id, useID, agree).send({
        from: accont,
        gas: 1000000
    })
}

async function newUse(id, goal, info) {
    const account = await getAccount();
    const eth = Web3.utils.toWei(goal.toString(10), 'ether')
    return await crowdFundInstance.methods.newUse(id, eth, info).send({
        from: account,
        gas: 1000000
    })
}

export {
    getAccount,
    authenticate,
    crowdFundInstance,
    getAllFundings,
    getOneFunding,
    getMyFundingAmount,
    contribute,
    newFunding,
    getAllUse,
    agreeUse,
    newUse,
    getMyFundings,
    addListener,
    getBlockNumber
}
