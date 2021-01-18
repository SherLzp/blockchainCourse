import Web3 from 'web3'
//@ts-ignore
import cf from './cf.json'

//@ts-ignore
const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(cf.abi, '0x919D014a9ED0c2D041d1bC6529070607CF6121C0\n');

export default contract;

function addListener(fn: Function) {
    //@ts-ignore
    ethereum.on('accountsChanged', fn)
}

export declare interface Project {
    index: number,
    title: string,
    projectDescription: string,
    intentionAmount: number,
    endTime: number,
    initiator: string,
    success: boolean,
    EthSponsored: number,
    numSponsors: number,
    numBills: number,
    myAmount?: number
}

export declare interface Bill {
    index: number,
    billDescription: string,
    intention: string,
    agreeAmount: string,
    disagreeAmount: string,
    expire: boolean,
    agree: number // 0: 没决定，1同意，2不同意
}

async function authenticate() {
    //@ts-ignore
    await window.ethereum.enable();
}

async function getAccount() {
    return (await web3.eth.getAccounts())[0];
}

async function getAllProjects() : Promise<Project[]> {
    const length = await contract.methods.numProjects().call();
    const result = []
    for(let i=1; i<=length; i++)
        result.push(await fetchOneProject(i));
    return result;
}

async function fetchOneProject(index:number) : Promise<Project> {
    const data = await contract.methods.projects(index).call();
    data.goal = Web3.utils.fromWei(data.goal, 'ether')
    data.amount = Web3.utils.fromWei(data.amount, 'ether')

    return {index, ...data}
}

async function getMyProjectAmount(index:number) : Promise<number> {
    const account = await getAccount();
    return parseInt(Web3.utils.fromWei(await contract.methods.getMyProjects(account, index).call(), 'ether'));
}

async function getMyProjects() : Promise<{init: Project[], contr: Project[]}> {
    const account = await getAccount();
    const all = await getAllProjects();
    const result : {
        init: Project[],
        contr: Project[]
    } = {
        init: [],
        contr: []
    };
    for(let funding of all) {
        const myAmount = await getMyProjectAmount(funding.index);
        if(funding.initiator == account) {
            result.init.push({
                myAmount,
                ...funding
            })
        }
        if(myAmount != 0) {
            result.contr.push({
                myAmount,
                ...funding
            })
        }
    }
    return result;
}

async function sponsorship(id:number, value:number) {
    return await contract.methods.sponsorship(id).send({from: await getAccount(), value: Web3.utils.toWei(value.toString(10), 'ether')});
}

async function newProject(account:string, title:string, info:string, amount:number, seconds:number) {
    return await contract.methods.newProject(account, title, info, Web3.utils.toWei(amount.toString(10), 'ether'), seconds).send({
        from: account,
        gas: 1000000
    });
}

async function getAllBills(id:number) : Promise<Bill[]> {
    const length = await contract.methods.getBillLength(id).call();
    const account = await getAccount();
    const rusult : Bill[] = []
    for(let i=1; i<=length; i++) {
        const use = await contract.methods.getBill(id, i, account).call();
        rusult.push({
            index: i,
            billDescription: use[0],
            intention: Web3.utils.fromWei(use[1], 'ether'),
            agreeAmount: Web3.utils.fromWei(use[2], 'ether'),
            disagreeAmount: Web3.utils.fromWei(use[3], 'ether'),
            expire: use[4],
            agree: use[5]
        });
    }
    return rusult;
}

async function approveBill(id:number, useID: number, agree:boolean) {
    const account = await getAccount();
    return await contract.methods.approveBill(id, useID, agree).send({
        from: account,
        gas: 1000000
    })
}

async function newBill(id:number, goal:number, info:string) {
    const account = await getAccount();
    const eth = Web3.utils.toWei(goal.toString(10), 'ether')
    return await contract.methods.newBill(id, eth, info).send({
        from: account,
        gas: 1000000
    })
}


export {
    getAccount,
    authenticate,
    contract,
    getAllProjects,
    fetchOneProject,
    getMyProjectAmount,
    sponsorship,
    newProject,
    getAllBills,
    approveBill,
    newBill,
    getMyProjects,
    addListener
}
