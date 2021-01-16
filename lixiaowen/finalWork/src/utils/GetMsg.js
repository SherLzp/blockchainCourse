import web3 from './web3'
import web from './web3'
import {CROWDFUNDINHG_ADDRESS, CROWFUNDING, PROJECT} from './config.js'

let funding = new web3.eth.Contract(CROWFUNDING, CROWDFUNDINHG_ADDRESS)


let getPronum=async ()=>{
    let res=await funding.methods.projectsnum().call();
    console.log(res);
    return res;
};

let openPro=async(title,des,money,days)=>{
    let account = await web3.eth.getAccounts();
    return await funding.methods.openProject(title,des,money,days).send({
        from:account[0],
        gas:3000000,
    })
};

let returnProAdd=async ()=>{
    return await funding.methods.returnProjectsAdd().call();
};

let getAPro=async (i)=>{
    let AllAdd=await returnProAdd();
    return new web3.eth.Contract(PROJECT, AllAdd[i]);
};

let contribute=async (i,money)=>{
    let pro=await getAPro(i);
    let accounts=await web3.eth.getAccounts();
    let account=accounts[0];
    console.log(account);
    return await pro.methods.contribute().send({
        from:account,
        value:Number(money),
        gas:3000000,
    })
};

let getonecontribution=async (i,address)=>{
    let pro=await getAPro(i);
    return await pro.methods.contributions(address).call();
}

let getonerequire=async (i,index)=>{
    let pro=await getAPro(i);
    console.log(1);
    return await pro.methods.requirelist(index).call();
};

let needMoney=async(i,purpose,cost)=>{
    let pro=await getAPro(i);
    let accounts=await web3.eth.getAccounts();
    let account=accounts[0];
    let creator=await pro.methods.creator().call();
    if(account!==creator)
        alert("您无权使用此项目金额");
    else
        return await pro.methods.CreatorRequireMoney(purpose,cost).send({
            from:account,
            gas:3000000,
        });
};

let approveuse=async (i,index,agree)=>{
    let pro=await getAPro(i);
    let accounts=await web3.eth.getAccounts();
    let account=accounts[0];
    console.log(account);
    return await pro.methods.ApproveRequire(index,agree).send({
        from:account,
        gas:3000000,
    })
};

let isVoted=async (proid,address,id)=>{
    let pro=await getAPro(proid);
    let res=await pro.methods.isVoted(address,id).call();
    console.log(address);
    console.log(res);
    return res;
}

let getProMes=async (i)=>{
    let pro=await getAPro(i);
    let creator=await pro.methods.creator().call();
    let goal=await pro.methods.goal().call();
    let description = await pro.methods.prodescription().call();
    let ddl=await pro.methods.proddl().call();
    var timeStamp = Math.round(new Date() / 1000);
    let completetime=await pro.methods.completeTime().call();
    let totalMoney=await pro.methods.totalMoney().call();
    let nowmoney=await pro.methods.nowMoney().call();
    let state=await pro.methods.state().call();
    let requirenum=await pro.methods.requirelistnum().call();
    let personnum=await pro.methods.personnum().call();
    let title=await pro.methods.proname().call();
    return {
        creator: creator,
        goal: goal,
        description: description,
        ddl:ddl,
        now:timeStamp,
        completetime:completetime,
        totalMoney:totalMoney,
        nowmoney:nowmoney,
        state:state,
        requirenum:requirenum,
        personnum:personnum,
        title:title,
        id:i,
    };
};

let isMy=async (i)=>{
    let pro=await getAPro(i);
    let creator=await pro.methods.creator().call();
    let accounts=await web3.eth.getAccounts();
    let account=accounts[0];
    return creator === account;
};

let isMySupport=async (i)=>{
    let accounts=await web3.eth.getAccounts();
    let account=accounts[0];
    let money=await getonecontribution(i,account);
    return Number(money) !== 0;
}

let timestampToTime=(timestamp)=> {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate()<10?'0'+date.getDate():date.getDate()) + ' ';
    var h = (date.getHours()<10?'0'+date.getHours():date.getHours()) + ':';
    var m = (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()) + ':';
    var s = (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds());
    return Y + M + D + h + m + s;
}



export {getPronum,openPro,returnProAdd,getAPro,contribute,getProMes,needMoney,getonerequire,approveuse,timestampToTime,isMy,isMySupport,getonecontribution,isVoted};






