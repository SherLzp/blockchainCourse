import { getInstance, getCurrentAddress } from "./contract.js";
import Web3 from "web3";

async function getFundList() {
    var instance = await getInstance();

    var fundCount = await instance.projectCount.call();
    var arr = new Array();
    for (var i = 0; i < fundCount; i++) {
        var fund = await instance.projects.call(i);
        var status = await getStatus(fund.proID);
        var goal = Web3.utils.fromWei(fund.goal, "finney");
        var e = {
            proID: parseInt(String(fund.proID)),
            title: fund.title,
            goal: goal,
            startTime: new Date(parseInt(String(fund.startTime)) * 1000).toLocaleString(),
            endTime: new Date(parseInt(String(fund.endTime)) * 1000).toLocaleString(),
            status: status
        }
        arr.push(e);
    }
    //console.log(arr);
    return arr;
}

async function getInvList(proID, invCount) {
    var instance = await getInstance();

    var arr = new Array();
    for (var i = 0; i < invCount; i++) {
        var inv = await instance.GetInvestment(proID, i);
        var amount = Web3.utils.fromWei(inv[1], "finney");

        var e = {
            invID: i,
            investor: inv[0],
            amount: parseInt(amount),
            time: new Date(parseInt(String(inv[2])) * 1000).toLocaleString(),
        }
        arr.push(e);
    }
    return arr;
}

async function getProList(list){
    var instance = await getInstance();

    var arr = new Array();
    for (var i of list) {
        var fund = await instance.projects.call(i);
        var status = await getStatus(fund.proID);
        var goal = Web3.utils.fromWei(fund.goal, "finney");
        var e = {
            proID: parseInt(String(fund.proID)),
            title: fund.title,
            goal: goal,
            startTime: new Date(parseInt(String(fund.startTime)) * 1000).toLocaleString(),
            endTime: new Date(parseInt(String(fund.endTime)) * 1000).toLocaleString(),
            status: status
        }
        arr.push(e);
    }
    //console.log(arr);
    return arr;
}

async function getFundDetail(proID) {
    var instance = await getInstance();

    var fund = await instance.projects.call(proID);
    var goal = parseInt(Web3.utils.fromWei(fund.goal, "finney"));
    var totalAmount = parseInt(Web3.utils.fromWei(fund.totalAmount, "finney"));
    var percentage = parseInt(totalAmount * 100 / goal);
    if (percentage > 100) {
        percentage = 100;
    }
    var status = await getStatus(fund.proID);
    var currentAmount = parseInt(Web3.utils.fromWei(fund.currentAmount, "finney"));
    var e = {
        title: fund.title,
        initiator: fund.initiator,
        description: fund.description,
        goal: goal,
        totalAmount: totalAmount,
        currentAmount: currentAmount,
        invCount: parseInt(String(fund.invCount)),
        reqCount: parseInt(String(fund.reqCount)),
        startTime: new Date(parseInt(String(fund.startTime)) * 1000).toLocaleString(),
        endTime: new Date(parseInt(String(fund.endTime)) * 1000).toLocaleString(),
        percentage: percentage,
        status: status
    }
    console.log(e);
    return e;
}

async function getReqList(proID, reqCount) {
    var instance = await getInstance();

    var arr = new Array();
    for (var i = 0; i < reqCount; i++) {
        var req = await instance.GetRequest(proID, i);
        var passed = await instance.HasEnoughSupport(proID, i);
        //console.log(req);
        var supporters = new Array();
        for(var j = 0; j < req[2]; j++){
            supporters.push(parseInt(String(req[3][j])));
        }
        var amount = Web3.utils.fromWei(req[1], "finney");
        var e = {
            reqID: i,
            amount: amount,
            description: req[0],
            status: passed ? "success" : "danger",
            supporters: supporters
        }
        console.log(e);
        arr.push(e);
    }

    return arr;
}

//0->active 1->success 2->failed
async function getStatus(proID) {
    var instance = await getInstance();

    var hasFinished = await instance.HasEnded(proID);
    console.log(hasFinished);
    if (!hasFinished) {
        return "";
    }
    var hasSuccess = await instance.HasSuccess(proID);
    return hasSuccess ? "success" : "exception";
}

async function login() {
    var instance = await getInstance();
    var add = await getCurrentAddress();

    var address = await instance.Login({ from: add });
    //console.log(add);
    return address;
}

async function createProject(formData) {
    var instance = await getInstance();
    var add = await getCurrentAddress();

    var duration = formData.duration * 24 * 60 * 60;
    var goal = Web3.utils.toWei(String(formData.goal), "finney");

    await instance.CreateProject(formData.title, formData.description, goal, duration, { from: add });
}

async function invest(proID, amount) {
    var instance = await getInstance();
    var add = await getCurrentAddress();

    var val = Web3.utils.toWei(String(amount), "finney");

    var res = await instance.Invest(proID, { from: add, value: val });
    console.log(res);
}

async function createRequest(proID, description, amount) {
    var instance = await getInstance();
    var add = await getCurrentAddress();

    var val = Web3.utils.toWei(String(amount), "finney");

    var res = await instance.CreateRequest(proID, description, val, { from: add });
    console.log(res);
}

async function withdraw(proID) {
    var instance = await getInstance();
    var add = await getCurrentAddress();

    var res = await instance.Withdraw(proID, { from: add });
    console.log(res);
}

async function support(proID, reqID){
    var instance = await getInstance();
    var add = await getCurrentAddress();

    var res = await instance.GrantSupport(proID, reqID, {from: add});
    console.log(res);
}

async function collect(proID, reqID){
    var instance = await getInstance();
    var add = await getCurrentAddress();

    var res = await instance.Collect(proID, reqID, {from: add});
    console.log(res);
}

async function getRelated(){
    var instance = await getInstance();
    var add = await getCurrentAddress();

    var res = await instance.GetRelatedProjects({from: add});
    var arr1 = new Array();
    for(var num of res[0]){
        arr1.push(parseInt(String(num)));
    }
    var arr2 = new Array();
    for(var num of res[1]){
        arr2.push(parseInt(String(num)));
    }
    return {arr1, arr2};
}

export {
    getFundList,
    login,
    createProject,
    getStatus,
    getFundDetail,
    invest,
    getInvList,
    createRequest,
    getReqList,
    withdraw,
    support,
    collect,
    getRelated,
    getProList
};