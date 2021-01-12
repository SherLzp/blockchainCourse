import React, { Component , useState } from 'react';
import './App.css';
import {GlobalTable, PersonalTable} from './utils/myUI';

let web3 = require('./utils/InitWeb3') //web3
var Fproject = require('./Fproject.json').abi  //生成的合约的abi
var mFund = require('./mFund.json').abi  //合约管理器mFund的abi
let mFund_addr = "0x6817Ba1b68B99361c1aDadd2796a2241f92f81D7" //mFund的合约地址
let mFundInstance = new web3.eth.Contract(mFund,mFund_addr)

class App extends Component {
  constructor(){
    super()
    this.state ={
      myaccount : '',
      totalcount: -1,
      ProList: [],
      GoalList: [],
      GotList: [],
      VoteStr: [],
      VoteTar: [],
      VoteState: [],
      PaidIndex: [],
      HostIndex: []
    }
  }
  RaiseVote = async(addr,str,num) =>{
    console.log("str: "+str)
    console.log("num: "+num)
    try{
      let FprojInstance = new web3.eth.Contract(Fproject,addr)
      await FprojInstance.methods.Raisevote(num, str).send({
        from: this.state.myaccount,
        value: '0',
        gas: '30000000'
      })
      window.location.reload()
      alert('创建成功，刷新查看结果')
    }catch(e){
      console.log(e)
      alert('创建失败')
    }
    return;
  }
  RaiseProject = async(summary,target)=>{
    console.log("host: "+this.state.myaccount)
    console.log("summary: "+summary)
    console.log("target: "+target)
    target = web3.utils.toWei(target,'ether')
    try{
      let resaddr = await mFundInstance.methods.RaiseProject(this.state.myaccount,summary,target,'100000000').send({
        from: this.state.myaccount,
        value: '5000',
        gas: '3000000'
      })
      console.log(resaddr)
      alert('创建成功，刷新查看结果')
    }catch(e){
      console.log(e)
      alert('创建失败')
    }
    return;
  }
  Votefor = async(addr,res)=>{
    if(res !== 1 && res !==2)return
    console.log("addr: "+addr)
    console.log("res: "+res)
    try{
      let FprojInstance = new web3.eth.Contract(Fproject,addr)
      await FprojInstance.methods.Checkvote(this.state.myaccount,res).send({
        from: this.state.myaccount,
        value: '0',
        gas: '3000000'
      })
      window.location.reload()
      alert('投票成功')
    }catch(e){
      console.log(e)
      alert('投票失败')
    }
    return
  }
  Payfor = async(addr,mvalue)=>{
    console.log("addr: "+addr)
    console.log("value: "+mvalue)
    mvalue = web3.utils.toWei(mvalue,'ether')
    try{
      let FprojInstance = new web3.eth.Contract(Fproject,addr)
      let thehost =  await FprojInstance.methods.getHost().call()
      console.log("host")
      console.log(thehost)
      await FprojInstance.methods.Payfund().send({
        from: this.state.myaccount,
        value: mvalue,
        gas: '3000000'
      })
      window.location.reload()
      alert('支付成功，刷新查看结果')
    }catch(e){
      console.log(e)
      alert('支付失败')
    }
    return;
  }

  Prepare = async()=>{
    let accounts = await web3.eth.getAccounts()
    var _ProList = await mFundInstance.methods.GetProList().call({from:accounts[0]})
    console.log(_ProList)
    var _Goallist = []
    var _Gotlist = []
    var _StrList = []
    var _timelist = []
    var _VoteState = []
    var _VoteStr = []
    var _VoteTar = []
    var _HostIndex = await mFundInstance.methods.GetHostIdx(accounts[0]).call({from:accounts[0]})
    var _PaidIndex = await mFundInstance.methods.GetPaidIdx(accounts[0]).call({from:accounts[0]})
    //对于每个地址，查询对应合约的状态：
    for (let i in _ProList){
      var tmpaddr  = _ProList[i]
      let FprojInstance = new web3.eth.Contract(Fproject,tmpaddr)
      console.log(tmpaddr)
      //查询简介
      var tmpSummary = await FprojInstance.methods.getSummary().call({from:accounts[0]}) 
      _StrList.push(tmpSummary)
      //查询详细描述
      //查询目标金额
      var tmpTarget = await FprojInstance.methods.getTarget().call({from:accounts[0]})
      tmpTarget = web3.utils.fromWei(tmpTarget,'ether')
      _Goallist.push(tmpTarget)
      //查询已获得金额
      var tmpGot = await FprojInstance.methods.getGot().call({from:accounts[0]})
      tmpGot = web3.utils.fromWei(tmpGot,'ether')
      _Gotlist.push(tmpGot)
      //查询时间
      var tmpDDL = await FprojInstance.methods.getDDL().call({from:accounts[0]})
      tmpDDL = String(new Date(tmpDDL*1000))
      _timelist.push(tmpDDL)
      //查询投票信息
      var tmpVstate = await FprojInstance.methods.getVoteState().call({from:accounts[0]})
      _VoteState.push(tmpVstate)
      var tmpVStr = await FprojInstance.methods.getVoteStr().call({from:accounts[0]})
      _VoteStr.push(tmpVStr)
      var tmpVtar = await FprojInstance.methods.getVoteTarget().call({from:accounts[0]})
      _VoteTar.push(tmpVtar)
    }
    this.setState({
      myaccount: accounts[0],
      totalcount: _ProList['length'],
      StrList : _StrList,
      ProList: _ProList,
      GoalList : _Goallist,
      GotList : _Gotlist,
      TimeList : _timelist,
      VoteStr: _VoteStr,
      VoteTar: _VoteTar,
      VoteState: _VoteState,
      HostIndex: _HostIndex,
      PaidIndex: _PaidIndex
    })
  }
  componentDidMount(){
   this.Prepare() 
  }

  render(){
    console.log("ac  "+this.state.myaccount)
    return (
      <div className="App">
        <header className="App-header">
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h1>测试型众筹DApp</h1>
        </header>
        <div>
          <GlobalTable 
            totalcount={this.state.totalcount} 
            strlist={this.state.StrList}
            prolist={this.state.ProList}
            goallist={this.state.GoalList}
            gotlist={this.state.GotList}
            timelist={this.state.TimeList}
            votestr={this.state.VoteStr}
            votestate={this.state.VoteState}
            votetar={this.state.VoteTar}
          />
        </div>
        <div>
          <PersonalTable
            raisepro={this.RaiseProject}
            raisevote={this.RaiseVote}
            payfor={this.Payfor}
            votefor={this.Votefor}
            myaddress={this.state.myaccount}
            paidindex={this.state.PaidIndex}
            hostindex={this.state.HostIndex}
            prolist={this.state.ProList}
            goallist={this.state.GoalList}
            gotlist={this.state.GotList}
          />
        </div>
      </div>
    );
  }
}

export default App;
