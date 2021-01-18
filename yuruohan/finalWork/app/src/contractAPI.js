import CrowdFunding from "./contracts/CrowdFunding.json";
import Web3 from "web3";

// 得到所有项目的列表
async function getAllFund() {
    var instance = await getInstance();
    var fundCount = await instance.fundCount.call();

    var res = new Array();
    for (var i = 0; i < fundCount; i++) {
        var fund = await instance.allfunds.call(i);
        var status = await getStatus(fund.proID);
        var goal = Web3.utils.fromWei(fund.goal, "ether");

        var totalAmount = parseInt(Web3.utils.fromWei(fund.totalAmount, "ether"));
        var percentage = parseInt(totalAmount * 100 / goal);
        if (percentage > 100) percentage = 100;
        var currentAmount = parseInt(Web3.utils.fromWei(fund.currentAmount, "ether"));

        var e = {
            proID: parseInt(String(fund.proID)),
            title: fund.title,
            goal: goal,
            initiator: fund.initiator,
            description: fund.description,
            totalAmount: totalAmount,
            currentAmount: currentAmount,
            invCount: parseInt(String(fund.invCount)),
            reqCount: parseInt(String(fund.reqCount)),
            percentage: percentage,
            startTime: new Date(parseInt(String(fund.startTime)) * 1000).toLocaleString(),
            endTime: new Date(parseInt(String(fund.endTime)) * 1000).toLocaleString(),
            status: status
        }

        res.push(e);
    }
    return res;
}

// 获取相关的项目和投资ID
async function getMyProject(){
    var instance = await getInstance();
    var address = await getUserAddress();

    var res = await instance.GetMyFunds({from: address});
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

// 从id中构造项目列表
async function IDtoList(list){
    var instance = await getInstance();
    var arr = new Array();
    for (var i of list) {
        var fund = await instance.allfunds.call(i);
        var status = await getStatus(fund.proID);
        var goal = Web3.utils.fromWei(fund.goal, "ether");
        var totalAmount = parseInt(Web3.utils.fromWei(fund.totalAmount, "ether"));
        var percentage = parseInt(totalAmount * 100 / goal);
        if (percentage > 100) percentage = 100;
        var currentAmount = parseInt(Web3.utils.fromWei(fund.currentAmount, "ether"));
        var ifEnough = await instance.ifSupportEnough(fund.proID, 0);
        var e = {
            proID: parseInt(String(fund.proID)),
            title: fund.title,
            goal: goal,
            initiator: fund.initiator,
            description: fund.description,
            totalAmount: totalAmount,
            currentAmount: currentAmount,
            invCount: parseInt(String(fund.invCount)),
            reqCount: parseInt(String(fund.reqCount)),
            percentage: percentage,
            startTime: new Date(parseInt(String(fund.startTime)) * 1000).toLocaleString(),
            endTime: new Date(parseInt(String(fund.endTime)) * 1000).toLocaleString(),
            status: status,
            supportRate: ifEnough ? "success" : "no",
        }
        arr.push(e);
        console.log("get a fund:");
        console.log(e);
    }
    //console.log(arr);
    return arr;
}

// 获得项目当前状态
async function getStatus(proID) {
    var instance = await getInstance();

    var hasFinished = await instance.ifEnd(proID);
    if (!hasFinished) {
        return "";
    }
    var hasSuccess = await instance.ifSuccess(proID);
    return hasSuccess ? "success" : "exception";
}

// 从表单创建项目
async function newFund(formData) {
    var instance = await getInstance();
    var address = await getUserAddress();

    var duration = formData.duration * 24 * 60 * 60;
    var goal = Web3.utils.toWei(String(formData.target), "ether");

    await instance.NewProject(formData.title, formData.description, goal, duration, { from: address });
}

// 投资
async function newInvest(proID, amount) {
    var instance = await getInstance();
    var address = await getUserAddress();

    var val = Web3.utils.toWei(String(amount), "ether");

    var res = await instance.NewInvest(proID, { from: address, value: val });
    console.log(res);
}

// 创建请求
async function newRequest(proID, description, amount) {
    var instance = await getInstance();
    var address = await getUserAddress();

    var val = Web3.utils.toWei(String(amount), "ether");

    var res = await instance.NewRequest(proID, description, val, { from: address });
    console.log(res);
}

// 支持项目ID的请求ID
async function supportRequest(proID, reqID){
    var instance = await getInstance();
    var address = await getUserAddress();

    var res = await instance.SupportRequest(proID, reqID, {from: address});
    console.log(res);
}

// 获取当前用户address
async function getUserAddress() {
	await window.ethereum.enable();
	ethereum.on('accountsChanged', function () {
		window.location.reload();
	});
	return window.ethereum.selectedAddress;
}

// CrowdFunding实例化
let instance = null;
async function getInstance() {
	if (instance) return instance;
	var provider = window.ethereum;
	var contract = require("truffle-contract");
	var crowdFunding = contract(CrowdFunding);
	crowdFunding.setProvider(provider);
	instance = await crowdFunding.deployed();
	return instance;
}

// 似乎仍有bug
async function getSupportRate(proID, reqID) {
    var instance = await getInstance();
    var rate = await instance.GetSupportRate(proID, reqID);
    var a = parseInt(String(fund.invCount));
    console.log("a");
    console.log(a);
    return rate;
}


export {
    getUserAddress,
	getInstance,
    getAllFund,
    getMyProject,
    IDtoList,
    newFund,
    getStatus,
    newInvest,
    newRequest,
    supportRequest,
    getSupportRate,
};