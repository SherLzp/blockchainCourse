import logo from './logo.svg';
import './App.css';
  
import React, { Component } from 'react';
import Mainpage from './display/Mainpage'
import {Button,message} from 'antd'
let web3 = require('./utils/InitWeb3');
let donateInstance = require('./eth/donate')


class App extends React.Component {
  constructor(props){
      super(props);
      this.createProject = this.createProject.bind(this);
      this.invest = this.invest.bind(this);
      this.createUse = this.createUse.bind(this);
      this.vote = this.vote.bind(this);
      this.getData = this.getData.bind(this);
      //this.returnMoney = this.returnMoney.bind(this);
      this.state = {
          currentAccount: '游客',
          allData: [],
          isClicked: false
      }
  }

  componentDidMount() {
  }

  async getData(){
    try{
      let accounts = await web3.eth.getAccounts();
      let totalProject = await donateInstance.methods.getTotalNum().call();
      let allData = [];
      
      for(let i=1; i<=totalProject; i++){
          let key = i-1;
          let id = i;
         // let address = await donateInstance.methods.getAddress().call();
         
         let summary = await donateInstance.methods.getsummary(i).call();
          let owner = await donateInstance.methods.getowner(i).call();
          let end_time = await donateInstance.methods.getend_time(i).call();
          let start_time = await donateInstance.methods.getstart_time(i).call();
          let money_neededWei = await donateInstance.methods.getmoney_needed(i).call();
          let money_needed = web3.utils.fromWei(money_neededWei, 'ether');
          let money_raisedeWei = await donateInstance.methods.getmoney_raised(i).call();
          let money_raised = web3.utils.fromWei(money_raisedeWei, 'ether');
          let money_availableWei = await donateInstance.methods.getmoney_available(i).call();
          let money_available = web3.utils.fromWei(money_availableWei, 'ether');
          let info = await donateInstance.methods.getInfo(i).call();
          let myMoneyWei = await donateInstance.methods.getFunderMoney(i, accounts[0]).call();
          let myMoney = web3.utils.fromWei(myMoneyWei, 'ether');
         
          
          let allUses = []
          let useNum = await donateInstance.methods.getUseNum(i).call();
          for(let j=1; j<=useNum; j++){
              let info = await donateInstance.methods.getUseInfo(i, j).call();
              let uesMoneyWei = await donateInstance.methods.getUseMoney(i, j).call();
              let uesMoney = web3.utils.fromWei(uesMoneyWei, 'ether');
              let useAgreeNumWei = await donateInstance.methods.getUseAgree(i, j).call();
              let useAgreeNum = web3.utils.fromWei(useAgreeNumWei, 'ether');
              let useDisagreeNumWei = await donateInstance.methods.getUseDisagree(i, j).call();
              let useDisagreeNum = web3.utils.fromWei(useDisagreeNumWei, 'ether');
              //let result = await donateInstance.methods.checkResult(i,j).call();
             // let isVote = await donateInstance.methods.getUseVote(i, j, accounts[0]).call();
              allUses.push({
                  id: j,
                  info: info,
                  uesMoney: uesMoney,
                  useAgreeNum: useAgreeNum,
                  useDisagreeNum: useDisagreeNum,
                 // result: result,
              })
          }
          //
          allData.push({
              key: key,
              id: id,
              //address: address,
              summary: summary,
              owner: owner,
              end_time: end_time,
              start_time:start_time,
              money_needed: money_needed,
              money_raised: money_raised,
              money_available: money_available,
              info: info,
              myMoney: myMoney,
              allUses: allUses
          })
          
      }
      
      this.setState({
        currentAccount: accounts[0],
          allData: allData,
          isClicked: false
      })
    } catch(e){
          message.error("众筹项目信息加载出错！");
    }
  }

  helpFunction = () => {
      window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts[0] !== this.state.currentAccount) {
              this.getData();
          }
      })
  }

  async componentWillMount() {
      await this.getData();
      this.helpFunction()
  }

  /*async returnMoney(id){
      const currentAccount = this.state.currentAccount;
      this.setState({isClicked:true})
      try{
          await donateInstance.methods.returnMoney(id).send({
              from: currentAccount,
              gas: '3000000',
          })
          window.location.reload();
          this.setState({isClicked:false})
          message.success("退钱成功！");
      } catch(e){
          this.setState({isClicked:false})
          message.error("退钱失败！");
      }
  }*/

  async createProject(summary, info,start_time,end_time, money_needed){
      const currentAccount = this.state.currentAccount;
      let money_neededWei = web3.utils.toWei(money_needed.toString(), 'ether');
      this.setState({isClicked:true})
      try{
          await donateInstance.methods.createProject(summary,info,start_time,end_time, money_neededWei,currentAccount).send({
              from: currentAccount,
              gas: '3000000',
          });
          window.location.reload();
          this.setState({isClicked:false})
          message.success("新众筹项目创建成功！");
      } catch(e){
          this.setState({isClicked:false})
          message.error("新众筹项目创建失败！");
      }
  }

  async invest(id, money){
      const currentAccount = this.state.currentAccount;
      let moneyWei=web3.utils.toWei(money.toString(), 'ether');
      this.setState({isClicked:true})
      try{
          await donateInstance.methods.invest(id,moneyWei,currentAccount).send({
              from: currentAccount,
              gas: '3000000'
          })
          window.location.reload();
          this.setState({isClicked:false})
          message.success("投资成功！");
      } catch(e){
          this.setState({isClicked:false})
          message.error("投资失败！");
      }
  }

  async createUse(id, money,info){
      const currentAccount = this.state.currentAccount;
      const moneyWei = web3.utils.toWei(money.toString(), 'ether');
      this.setState({isClicked:true})
      try{
          
          await donateInstance.methods.createUse(id,moneyWei,info).send({
              from: currentAccount,
              gas: '3000000'
          })
          window.location.reload();
          this.setState({isClicked:false})
          message.success("使用请求创建成功！");
      } catch(e){
          this.setState({isClicked:false})
          message.error("使用请求创建失败！");
      }
  }

  async vote(i, useId, fid, isAgree){
      const currentAccount = this.state.currentAccount;
      this.setState({isClicked:true})
      try{
          await donateInstance.methods.vote(i, useId,currentAccount,isAgree).send({
              from: currentAccount,
              gas: '3000000'
          })
          window.location.reload();
          this.setState({isClicked:false})
          message.success("投票成功！");
      } catch(e){
          this.setState({isClicked:false})
          message.error("投票失败！");
      }
  }

  render(){
      //this.helpFunction()
      return(
        <div>
          <Mainpage 
            currentAccount = {this.state.currentAccount}
            allData = {this.state.allData}
            createProject = {this.createProject}
            invest = {this.invest}
            createUse = {this.createUse}
            vote = {this.vote}
            //returnMoney = {this.returnMoney}
            isClicked = {this.state.isClicked}
          />        
        </div>
      );
  }

}

export default App;
