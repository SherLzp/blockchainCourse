import React, {Component} from 'react';
import web3 from './utils/initWeb3';
import {fundingCompanyInstance} from './eth/fundingCompanyInstance';
import DappCenter from './display/DappCenter';
import Navbar from './Navbar.js';

class App extends Component{
  constructor(){
    super()
    this.state = {
      currentAccount:'',
    }
  }
  
  async componentWillMount(){
    let accounts = await web3.eth.getAccounts()
    console.log('account:',accounts)
    
    let platformManager = await fundingCompanyInstance.methods.platformManager().call()
    console.log('Manager:',platformManager)
    this.setState({currentAccount:accounts[0]})
  }

  render(){
    return (
      <div>
        <Navbar account = {this.state.currentAccount}/>
        <h4>时间转换链接 : https://www.epochconverter.com/timezones?q=1610528400&tz=Asia%2FKuala_Lumpur</h4>
        <DappCenter/>
      </div>
    );
  }

}

export default App;
