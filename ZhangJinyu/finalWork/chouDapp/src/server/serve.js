/* eslint-disable no-unused-vars */
import Web3 from 'web3'
import web3 from "../utils/InitWeb3";
import contractInstance from "../eth/chouDapp";

function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
      }
    }
    return fmt
  }
   
function padLeftZero(str) {
    return ('00' + str).substr(str.length)
}

function addListener(func) {
    // eslint-disable-next-line no-undef
    ethereum.on('accountsChanged', func)
}

async function Authenticate() {
    await window.ethereum.enable()
}

async function getAccount() {
    return (await web3.eth.getAccounts())[0];
}

async function getProject(index) {
    const data = await contractInstance.methods.projects(index).call();
    data.target = Web3.utils.fromWei(data.target, 'ether')
    data.raised = Web3.utils.fromWei(data.raised, 'ether')
    console.log(data)
    var date = new Date(parseInt(data.endTime) * 1000);
    var endTimeStr = formatDate(date, 'yyyy-MM-dd hh:mm')
    return {index, ...data, endTimeStr}
}

async function getAllProjects() {
    const length = await contractInstance.methods.projectsAmount().call()
    const result = []
    for(let i = 1; i <= length; i++)
        result.push(await getProject(i))
    return result;
}

async function getMyFundAmount(index) {
    const account = await getAccount();
    return parseFloat(Web3.utils.fromWei(await contractInstance.methods.getMyFund(account, index).call(), 'ether'))
}

async function getMyProjects() {
    const account = await getAccount()
    const all = await getAllProjects()
    const result = {
        init: [],
        contr: []
    };
    for(let funding of all) {
        const myAmount = await getMyFundAmount(funding.index);
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

async function fund(id, value) {
    return await contractInstance.methods.fund(id).send({from: await getAccount(), value: Web3.utils.toWei(value.toString(10), 'ether')});
}

async function launch(account, title, info, amount, seconds) {
    return await contractInstance.methods.launch(title, info, account, seconds, Web3.utils.toWei(amount.toString(10), 'ether')).send({
        from: account,
        gas: 1000000
    });
}

async function getAllWithdrawalVote(id) {
    const length = await contractInstance.methods.getWithdrawalsAmount(id).call();
    const account = await getAccount();
    const result = []
    for(let i = 1; i <= length; i++) {
        const withdrawal = await contractInstance.methods.getMyWithdrawalVote(id, i, account).call();
        result.push({
            index: i,
            purpose: withdrawal[0],
            amount: Web3.utils.fromWei(withdrawal[1], 'ether'),
            agree: Web3.utils.fromWei(withdrawal[2], 'ether'),
            disagree: Web3.utils.fromWei(withdrawal[3], 'ether'),
            isEnd: withdrawal[4],
            votes: withdrawal[5]
        })
    }
    return result;
}

async function vote(id, withdrawalID, agree) {
    const accont = await getAccount();
    return await contractInstance.methods.vote(id, withdrawalID, agree).send({
        from: accont,
        gas: 1000000
    })
}

async function requestWithdrawal(id, goal, info) {
    const account = await getAccount();
    const eth = Web3.utils.toWei(goal.toString(10), 'ether')
    return await contractInstance.methods.requestWithdrawal(id, info, eth).send({
        from: account,
        gas: 1000000
    })
}

async function refund(id) {
    const account = await getAccount();
    return await contractInstance.methods.refund(id).send({
        from: account,
        gas: 1000000
    })
}

export {
    addListener,
    Authenticate,
    getAccount,
    getProject,
    getAllProjects,
    getMyFundAmount,
    getMyProjects,
    fund,
    launch,
    getAllWithdrawalVote,
    vote,
    requestWithdrawal,
    refund
}