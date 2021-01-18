
import './App.css';
import React, { Component } from 'react';
import Test1Mod from './display/ui1'
import Test2Mod from './display/ui2'
import Test3Mod from './display/ui3'
import Test4Mod from './display/ui4'
import moment from 'moment';
let web3 = require('./utils/InitWeb3');
let InvestInstance = require('./eth/Invest')

class App extends Component {


  constructor() {
    super()
    this.state = {
        manager: 'a',
        round: 'a',
        winner: 'a',       
        balance: 0,
        players: [],
        playerCounts: 0,
        currentAccount: 'a',
        isClicked: false,
        isShowButton: 'a',
        currentpage:'1',

        timeinput:'',
        target_amount: 0,
        new_project_name:'',
        new_project_des:'',

        showinvest:[],
        
    }
  }
  pageswitch = async(e) =>{
    this.setState({ currentpage: e.key })
  }

  onChange = (e,dateString) =>{
    console.log(e,dateString);
  }
  amountinput = v=>{
    this.setState({
      target_amount:v
    })
    console.log('value',v)
  }
  nameinput = v=>{
    this.setState({
      new_project_name:v.target.value
    })
    console.log('value',v)
  }
  desinput = v=>{
    this.setState({
      new_project_des:v.target.value
    })
    console.log('value',v)
  }
  dateinput = now=>{
    this.setState({
      timeinput:moment(now).valueOf()
    })
  }    
  chooseInvest = e =>{
    this.setState({
      invToShow:e.currentTarget.value,

    })
  }

  newfund = async()=>{
      
    console.log('newfund Button click')
    this.setState({ isClicked: true })
    let accounts = await web3.eth.getAccounts()
    console.log(this.state.new_project_name,this.state.new_project_des,this.state.timeinput,this.state.target_amount)
    try {
      await InvestInstance.methods.new_fund(this.state.new_project_name,this.state.new_project_des,this.state.timeinput,web3.utils.toWei(this.state.target_amount.toString(), 'ether')).send({
          from: accounts[0],
          // value: web3.utils.toWei('1', 'ether'),
          gas: '3000000',
      })
      window.location.reload()
      this.setState({ isClicked: false })
      alert('成功发起新的众筹')
  } catch (e) {
      console.log(e)
      this.setState({ isClicked: false })
      alert('众筹发起失败')
  }
  }

  
  render(){
    if(this.state.currentpage==='1'){
    return (
      <div style={{ paddingLeft: '0%', paddingTop: '0%' ,paddingBottom:'0'}}>
          <Test1Mod
            pageswitch={this.pageswitch}
            currentpage={this.state.currentpage}

          />

      </div>
    );
    }
    else if(this.state.currentpage==='2'){
      return (
        <div style={{ paddingLeft: '0%', paddingTop: '0%' ,paddingBottom:'0'}}>
            <Test2Mod
              pageswitch={this.pageswitch}
              currentpage={this.state.currentpage}
              onChange={this.onChange}
              chooseInvest={this.chooseInvest}
              investments={this.state.showinvest}
            />
        </div>
      );
    }
    else if(this.state.currentpage==='3'){
      return (
        <div style={{ paddingLeft: '0%', paddingTop: '0%' ,paddingBottom:'0'}}>
            <Test3Mod
              pageswitch={this.pageswitch}
              currentpage={this.state.currentpage}
            />
        </div>
      );
    }
    else if(this.state.currentpage==='4'){
      return (
        <div style={{ paddingLeft: '0%', paddingTop: '0%' ,paddingBottom:'0'}}>
            <Test4Mod
              pageswitch={this.pageswitch}
              currentpage={this.state.currentpage}

              timeinput={this.state.timeinput}
              dateinput={this.dateinput}
              amountinput={this.amountinput}
              target_amount={this.state.target_amount}
              nameinput={this.nameinput}
              new_project_name={this.state.new_project_name}
              new_project_des={this.state.new_project_des}
              desinput={this.desinput}
              isClicked= {this.state.isClicked}
              newfund={this.newfund}
            />
        </div>
      );
    }
    else return null;
  }
}

export default App;
