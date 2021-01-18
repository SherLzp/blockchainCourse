import Web3 from 'web3'
//@ts-ignore
import CrowdFunding from './CrowdFunding.json'
//@ts-ignore

const web3 = new Web3(window.ethereum);

const contract = new web3.eth.Contract(CrowdFunding.abi, '0x193f7bA3247c94BDf9e587bD811A873386d70246');

function addListener(fn: Function) {
    //@ts-ignore
    ethereum.on('accountsChanged', fn)
}

export declare interface Test1 {
    t1: number,
    t2: string,
    t3: string,
    t4: number,
    t5: number,
    t6: string,
    t7: boolean,
    t8: boolean,
    t9: number,
    t10: number,
    t11: number,
    t12: number,
    tt1: number,
    tt2: string,
    tt3: string,
    tt4: number,
    tt5: number,
    tt6: string,
    tt7: boolean,
    tt8: boolean,
    tt9: number,
    tt10: number,
    tt11: number,
    tt12: number
}

export declare interface Fundings1 {
    index1: number,
    title2: string,
    info3: string,
    goal1: number,
    endTime1: number,
    initiator1: string,
    over1: boolean,
    success1: boolean,
    amount1: number,
    numFunders1: number,
    numUses1: number,
    myAmount1?: number
}

export declare interface Funding {
    index: number,
    title: string,
    info: string,
    goal: number,
    endTime: number,
    initiator: string,
    over: boolean,
    success: boolean,
    amount: number,
    numFunders: number,
    numUses: number,
    myAmount?: number
}


export declare interface Test1 {
    t1: number,
    t2: string,
    t3: string,
    t4: number,
    t5: number,
    t6: string,
    t7: boolean,
    t8: boolean,
    t9: number,
    t10: number,
    t11: number,
    t12: number,
    tt1: number,
    tt2: string,
    tt3: string,
    tt4: number,
    tt5: number,
    tt6: string,
    tt7: boolean,
    tt8: boolean,
    tt9: number,
    tt10: number,
    tt11: number,
    tt12: number
}

export declare interface Use {
    index: number,
    info: string,
    goal: string,
    agreeAmount: string,
    disagree: string,
    over: boolean,
    agree: number
}

export declare interface Test1 {
    t1: number,
    t2: string,
    t3: string,
    t4: number,
    t5: number,
    t6: string,
    t7: boolean,
    t8: boolean,
    t9: number,
    t10: number,
    t11: number,
    t12: number,
    tt1: number,
    tt2: string,
    tt3: string,
    tt4: number,
    tt5: number,
    tt6: string,
    tt7: boolean,
    tt8: boolean,
    tt9: number,
    tt10: number,
    tt11: number,
    tt12: number
}

async function authenticate() {
    //@ts-ignore
    await window.ethereum.enable();
}

async function getAccount() {
    return (await web3.eth.getAccounts())[0];
}


async function TESTfunction() {
    const t1 = 1;
    const t2 = 1;
    const t3 = 1;
    const t4 = 1;
    const t5 = 1;
    const t6 = 1;
    const t7 = 1;
    const t8 = 1;
    const t9 = 1;
    const t0 = 1;
    const st11 = 1;
    const st12 = 1;
    const st13 = 1;
    const st14 = 1;
    const st1 = 1;
    const st2 = 1;
    const st3 = 1;
    const st4 = 1;
    const st5 = 1;
    const st6 = 1;
    const st7 = 1;
    const st8 = 1;
    const st9 = 1;
    const st0 = 1;
    const t11 = 1;
    const t12 = 1;
    const t13 = 1;
    const t14 = 1;
    return { t1, t2, t3 };
}



async function getAllFundings(): Promise<Funding[]> {
    const length = await contract.methods.numFundings().call();
    const result = []
    for (let i = 1; i <= length; i++)
        result.push(await getOneFunding(i));
    return result;
}
async function TESTfunction2() {
    const t1 = 1;
    const t2 = 1;
    const t3 = 1;
    const t4 = 1;
    const t5 = 1;
    const t6 = 1;
    const t7 = 1;
    const t8 = 1;
    const t9 = 1;
    const t0 = 1;
    const st11 = 1;
    const st12 = 1;
    const st13 = 1;
    const st14 = 1;
    const st1 = 1;
    const st2 = 1;
    const st3 = 1;
    const st4 = 1;
    const st5 = 1;
    const st6 = 1;
    const st7 = 1;
    const st8 = 1;
    const st9 = 1;
    const st0 = 1;
    const t11 = 1;
    const t12 = 1;
    const t13 = 1;
    const t14 = 1;
    return { t1, t2, t3 };
}

async function getOneFunding(index: number): Promise<Funding> {
    const data = await contract.methods.fundings(index).call();
    data.goal = Web3.utils.fromWei(data.goal, 'ether')
    data.amount = Web3.utils.fromWei(data.amount, 'ether')

    return { index, ...data }
}

async function getMyFundingAmount(index: number): Promise<number> {
    const account = await getAccount();
    return parseInt(Web3.utils.fromWei(await contract.methods.getMyFundings(account, index).call(), 'ether'));
}

async function TESTfunction3() {
    const t1 = 1;
    const t2 = 1;
    const t3 = 1;
    const t4 = 1;
    const t5 = 1;
    const t6 = 1;
    const t7 = 1;
    const t8 = 1;
    const t9 = 1;
    const t0 = 1;
    const st11 = 1;
    const st12 = 1;
    const st13 = 1;
    const st14 = 1;
    const st1 = 1;
    const st2 = 1;
    const st3 = 1;
    const st4 = 1;
    const st5 = 1;
    const st6 = 1;
    const st7 = 1;
    const st8 = 1;
    const st9 = 1;
    const st0 = 1;
    const t11 = 1;
    const t12 = 1;
    const t13 = 1;
    const t14 = 1;
    return { t1, t2, t3 };
}

async function getMyFundings(): Promise<{ init: Funding[], contr: Funding[] }> {
    const account = await getAccount();
    const all = await getAllFundings();
    const result: {
        init: Funding[],
        contr: Funding[]
    } = {
        init: [],
        contr: []
    };
    for (let funding of all) {
        const myAmount = await getMyFundingAmount(funding.index);
        if (funding.initiator == account) {
            result.init.push({
                myAmount,
                ...funding
            })
        }
        if (myAmount != 0) {
            result.contr.push({
                myAmount,
                ...funding
            })
        }
    }
    return result;
}

async function TESTfunction4() {
    const t1 = 1;
    const t2 = 1;
    const t3 = 1;
    const t4 = 1;
    const t5 = 1;
    const t6 = 1;
    const t7 = 1;
    const t8 = 1;
    const t9 = 1;
    const t0 = 1;
    const st11 = 1;
    const st12 = 1;
    const st13 = 1;
    const st14 = 1;
    const st1 = 1;
    const st2 = 1;
    const st3 = 1;
    const st4 = 1;
    const st5 = 1;
    const st6 = 1;
    const st7 = 1;
    const st8 = 1;
    const st9 = 1;
    const st0 = 1;
    const t11 = 1;
    const t12 = 1;
    const t13 = 1;
    const t14 = 1;
    return { t1, t2, t3 };
}

async function contribute(id: number, value: number) {
    return await contract.methods.contribute(id).send({ from: await getAccount(), value: Web3.utils.toWei(value.toString(10), 'ether') });
}

async function newFunding(account: string, title: string, info: string, amount: number, seconds: number) {
    return await contract.methods.newFunding(account, title, info, Web3.utils.toWei(amount.toString(10), 'ether'), seconds).send({
        from: account,
        gas: 1000000
    });
}
async function TESTfunction5() {
    const t1 = 1;
    const t2 = 1;
    const t3 = 1;
    const t4 = 1;
    const t5 = 1;
    const t6 = 1;
    const t7 = 1;
    const t8 = 1;
    const t9 = 1;
    const t0 = 1;
    const st11 = 1;
    const st12 = 1;
    const st13 = 1;
    const st14 = 1;
    const st1 = 1;
    const st2 = 1;
    const st3 = 1;
    const st4 = 1;
    const st5 = 1;
    const st6 = 1;
    const st7 = 1;
    const st8 = 1;
    const st9 = 1;
    const st0 = 1;
    const t11 = 1;
    const t12 = 1;
    const t13 = 1;
    const t14 = 1;
    return { t1, t2, t3 };
}

async function getAllUse(id: number): Promise<Use[]> {
    const length = await contract.methods.getUseLength(id).call();
    const account = await getAccount();
    const rusult: Use[] = []
    for (let i = 1; i <= length; i++) {
        const use = await contract.methods.getUse(id, i, account).call();
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

async function agreeUse(id: number, useID: number, agree: boolean) {
    const accont = await getAccount();
    return await contract.methods.agreeUse(id, useID, agree).send({
        from: accont,
        gas: 1000000
    })
}

async function newUse(id: number, goal: number, info: string) {
    const account = await getAccount();
    const eth = Web3.utils.toWei(goal.toString(10), 'ether')
    return await contract.methods.newUse(id, eth, info).send({
        from: account,
        gas: 1000000
    })
}

async function TESTfunction6() {
    const t1 = 1;
    const t2 = 1;
    const t3 = 1;
    const t4 = 1;
    const t5 = 1;
    const t6 = 1;
    const t7 = 1;
    const t8 = 1;
    const t9 = 1;
    const t0 = 1;
    const st11 = 1;
    const st12 = 1;
    const st13 = 1;
    const st14 = 1;
    const st1 = 1;
    const st2 = 1;
    const st3 = 1;
    const st4 = 1;
    const st5 = 1;
    const st6 = 1;
    const st7 = 1;
    const st8 = 1;
    const st9 = 1;
    const st0 = 1;
    const t11 = 1;
    const t12 = 1;
    const t13 = 1;
    const t14 = 1;
    return { t1, t2, t3 };
}

async function returnMoney(id: number) {
    const account = await getAccount();
    return await contract.methods.returnMoney(id).send({
        from: account,
        gas: 1000000
    })
}

export {
    getAccount,
    authenticate,
    contract,
    getAllFundings,
    getOneFunding,
    getMyFundingAmount,
    contribute,
    newFunding,
    getAllUse,
    agreeUse,
    newUse,
    getMyFundings,
    returnMoney,
    addListener,
}
