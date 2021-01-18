let web3 = require('../utils/getWeb3')

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
                "name": "applyID",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "approve",
                "type": "bool"
            }
        ],
        "name": "agreeApply",
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
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "funds",
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
                "name": "detail",
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
                "name": "isFinished",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "applyAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "numOfFunder",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "numOfApply",
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
                "name": "applyID",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "addr",
                "type": "address"
            }
        ],
        "name": "getApply",
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
        "name": "getApplyLength",
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
        "name": "getMyFunds",
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
        "name": "getUserAdd",
        "outputs": [
            {
                "internalType": "address",
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
                "name": "detail",
                "type": "string"
            }
        ],
        "name": "newApply",
        "outputs": [],
        "stateMutability": "nonpayable",
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
                "name": "detail",
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
        "name": "newFund",
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
        "inputs": [],
        "name": "numOfFunds",
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

let address = '0x9C8515c84618aC7D771E920Fa83F5Ef472E35632'

let crowdFundInstance = new web3.eth.Contract(abi, address)

async function getAccount() {
    return (await web3.eth.getAccounts())[0];
}

export interface Fund {
    index: number,
    title: string,
    detail: string,
    goal: number,
    endTime: number,
    initiator: string,
    over: boolean,
    success: boolean,
    amount: number,
    numOfFunders: number,
    numOfApply: number,
    myAmount?: number

}

export interface Apply {
    index: number,
    detail: string,
    goal: string,
    approveAmount: string,
    disapproveAmount: string,
    over: boolean,
    approve: number
}

async function getAllFunds() : Promise<Fund[]> {
    const length = await crowdFundInstance.methods.numOfFunds().call();
    const result = []
    for(let i = 1; i <= length; i++)
        result.push(await getOneFund(i));
    return result;
}

async function getOneFund(index:number) : Promise<Fund> {
    const data = await crowdFundInstance.methods.funds(index).call();
    data.goal = web3.utils.fromWei(data.goal, 'ether')
    data.amount = web3.utils.fromWei(data.amount, 'ether')

    return {index, ...data}
}

async function getMyFundAmount(index:number) : Promise<number> {
    const account = await getAccount();
    return parseInt(web3.utils.fromWei(await crowdFundInstance.methods.getMyFunds(account, index).call(), 'ether'));
}

async function getMyFunds() : Promise<{init: Fund[], contr: Fund[]}> {
    const account = await getAccount();
    const all = await getAllFunds();
    const result : {
        init: Fund[],
        contr: Fund[]
    } = {
        init: [],
        contr: []
    };
    for(let fund of all) {
        const myAmount = await getMyFundAmount(fund.index);
        if(fund.initiator === account) {
            result.init.push({
                myAmount,
                ...fund
            })
        }
        if(myAmount !== 0) {
            result.contr.push({
                myAmount,
                ...fund
            })
        }
    }
    return result;
}

async function contribute(id:number, value:number) {
    return await crowdFundInstance.methods.contribute(id).send({from: await getAccount(), value: web3.utils.toWei(value.toString(10), 'ether')});
}

async function newFund(account:string, title:string, detail:string, amount:number, seconds:number) {
    return await crowdFundInstance.methods.newFund(account, title, detail, web3.utils.toWei(amount.toString(10), 'ether'), seconds).send({
        from: account,
        gas: 1000000
    });
}

async function getAllApply(id:number) : Promise<Apply[]> {
    const length = await crowdFundInstance.methods.getApplyLength(id).call();
    const account = await getAccount();
    const rusult : Apply[] = []
    for(let i=1; i<=length; i++) {
        const apply = await crowdFundInstance.methods.getApply(id, i, account).call();
        rusult.push({
            index: i,
            detail: apply[0],
            goal: web3.utils.fromWei(apply[1], 'ether'),
            approveAmount: web3.utils.fromWei(apply[2], 'ether'),
            disapproveAmount: web3.utils.fromWei(apply[3], 'ether'),
            over: apply[4],
            approve: apply[5]
        });
    }
    return rusult;
}

async function approveApply(id, applyID, approve) {
    const account = await getAccount();
    return await crowdFundInstance.methods.agreeApply(id, applyID, approve).send({
        from: account,
        gas: 1000000
    })
}

async function newApply(id, goal, detail) {
    const account = await getAccount();
    const eth = web3.utils.toWei(goal.toString(10), 'ether')
    return await crowdFundInstance.methods.newApply(id, eth, detail).send({
        from: account,
        gas: 1000000
    })
}
export {
    getAccount,
    crowdFundInstance,
    getAllFunds,
    getOneFund,
    getMyFundAmount,
    contribute,
    newFund,
    getAllApply,
    approveApply,
    newApply,
    getMyFunds
}