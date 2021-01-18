import React, { Component , useState } from 'react';
import './App.css';
import {GlobalTable, PersonalTable} from './utils/myUI';

let web3 = require('./utils/InitWeb3') //web3
var Funding = require('./Funding.json').abi  //contract abi
var fundManager = require('./FundManager.json').abi  //manager abi
// let managerAddr = "0x10885457D2912f2C02d21C2042e3E87cB259fBA5" //manager address
let managerAddr = "0x6995F5B3327a2D3BB7757244B0d60Bf2af2Fe557" //manager address
let managerInstance = new web3.eth.Contract(fundManager, managerAddr)

class App extends Component{
  constructor(){
    super()
    this.state = {
       myaccount : '',
      totalcount: -1,
      FundList: [],
      GoalList: [],
      GotList: [],
      VoteProposal: [],
      VoteNeed: [],
      VoteState: [],
      InvestIndex: [],
      StartIndex: []
    }
  }
  newProposal = async(addr,str,num) =>{
    console.log("str: "+str)
    console.log("num: "+num)
    try{
      let FundingInstance = new web3.eth.Contract(Funding,addr)
      await FundingInstance.methods.newProposal(str, num).send({
        from: this.state.myaccount,
        value: '0',
        gas: '3000000'
      })
      window.location.reload()
      alert('Success, F5 to refresh!')
    }catch(e){
      console.log(e)
      alert('Error!')
    }
    return;
  }
  newFunding = async(projname,details,time,goal)=>{
    console.log("starter: "+this.state.myaccount)
    console.log("details: "+details)
    console.log("goal: "+goal)
    goal = web3.utils.toWei(goal,'ether')
    try{
      let addr = await managerInstance.methods.newFunding(this.state.myaccount,projname,details,time,goal).send({
        from: this.state.myaccount,
        value: '5000',
        gas: '3000000'
      })
      console.log(addr)
      alert('Success, F5 to refresh!')
    }catch(e){
      console.log(e)
      alert('Error!')
    }
    return;
  }

  vote = async(addr,res)=>{
    if(res !== 1 && res !==2)return
    console.log("addr: "+addr)
    console.log("res: "+res)
    try{
      let FundingInstance = new web3.eth.Contract(Funding,addr)
      await FundingInstance.methods.vote(this.state.myaccount,res).send({
        from: this.state.myaccount,
        value: '0',
        gas: '3000000'
      })
      window.location.reload()
      alert('Vote Success!')
    }catch(e){
      console.log(e)
      alert('Vote Failed!')
    }
    return
  }

  donate = async(addr,mvalue)=>{
    console.log("addr: "+addr)
    console.log("value: "+mvalue)
    mvalue = web3.utils.toWei(mvalue,'ether')
    try{
      let FundingInstance = new web3.eth.Contract(Funding,addr)
      let _starter =  await FundingInstance.methods.getStarter().call()
      console.log("starter")
      console.log(_starter)
      await FundingInstance.methods.donate().send({
        from: this.state.myaccount,
        value: mvalue,
        gas: '3000000'
      })
      
      alert("Please pay twice to add to the invest list!")
      await managerInstance.methods.addInvestedProject(this.state.myaccount, addr).send({
        from: this.state.myaccount,
        value:'0',
        gas:'3000000'
      })
      alert('donate success!')
      // window.location.reload()
    }catch(e){
      console.log(e)
      alert('donate fail!')
    }
    return;
  }
  Prepare = async()=>{
    let accounts = await web3.eth.getAccounts()
    var _FundList = await managerInstance.methods.getFundList().call({from:accounts[0]})
    console.log(_FundList)
    var _Goallist = []
    var _Gotlist = []
    var _StrList = []
    var _timelist = []
    var _VoteState = []
    var _VoteProposal = []
    var _VoteNeed = []
    var _StartIndex = await managerInstance.methods.getStartedProject(accounts[0]).call({from:accounts[0]})
    var _InvestIndex = await managerInstance.methods.getInvestedProject(accounts[0]).call({from:accounts[0]})
    // Query each in the funding least
    for (let i in _FundList){
      var tmpaddr  = _FundList[i]
      let FundingInstance = new web3.eth.Contract(Funding,tmpaddr)
      console.log(tmpaddr)
      //Query details
      var tmpDetails = await FundingInstance.methods.getDetails().call({from:accounts[0]}) 
      _StrList.push(tmpDetails)
      // query Goal
      var tmpGoal = await FundingInstance.methods.getGoal().call({from:accounts[0]})
      tmpGoal = web3.utils.fromWei(tmpGoal,'ether')
      _Goallist.push(tmpGoal)
      // current balance
      var tmpGot = await FundingInstance.methods.getBalance().call({from:accounts[0]})
      tmpGot = web3.utils.fromWei(tmpGot,'ether')
      _Gotlist.push(tmpGot)
      //查询时间
      var tmpDDL = await FundingInstance.methods.getDDL().call({from:accounts[0]})
      tmpDDL = String(new Date(tmpDDL*1000))
      _timelist.push(tmpDDL)
      // Vote info
      var tmpVstate = await FundingInstance.methods.getVoteState().call({from:accounts[0]})
      _VoteState.push(tmpVstate)
      var tmpProposal = await FundingInstance.methods.getProposal().call({from:accounts[0]})
      _VoteProposal.push(tmpProposal)
      var tmpNeed = await FundingInstance.methods.getNeed().call({from:accounts[0]})
      _VoteNeed.push(tmpNeed)
    }
    this.setState({
      myaccount: accounts[0],
      totalcount: _FundList['length'],
      StrList : _StrList,
      FundList: _FundList,
      GoalList : _Goallist,
      GotList : _Gotlist,
      TimeList : _timelist,
      VoteProposal: _VoteProposal,
      VoteNeed: _VoteNeed,
      VoteState: _VoteState,
      StartIndex: _StartIndex,
      InvestIndex: _InvestIndex
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
          <h1>Crowd Funding</h1>
        </header>
        <div>
          <GlobalTable 
            totalcount={this.state.totalcount} 
            strlist={this.state.StrList}
            fundlist={this.state.FundList}
            goallist={this.state.GoalList}
            gotlist={this.state.GotList}
            timelist={this.state.TimeList}
            voteproposal={this.state.VoteProposal}
            votestate={this.state.VoteState}
            voteneed={this.state.VoteNeed}
          />
        </div>
        <div>
          <PersonalTable
            myaddress={this.state.myaccount}
            newFunding={this.newFunding}
            newProposal={this.newProposal}
            donate ={this.donate}
            vote={this.vote}
            InvestIndex={this.state.InvestIndex}
            StartIndex={this.state.StartIndex}
            fundlist={this.state.FundList}
            goallist={this.state.GoalList}
            gotlist={this.state.GotList}
          />
        </div>
      </div>
    );
  }
}

export default App;
