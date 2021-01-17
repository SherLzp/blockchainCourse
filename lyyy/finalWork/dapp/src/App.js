import React, {Component} from 'react';
import web3 from './utils/initWeb3';
import {fundingCompanyInstance} from './eth/fundingCompanyInstance';
import DappCenter from './display/DappCenter';
import Navbar from './Navbar.js';
import { Card, Image, List, Progress } from 'semantic-ui-react';

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
              <Navbar account={this.state.currentAccount} />
              <Image src='/images/up.jpg' wrapped ui={false} height="200" />
        <DappCenter/>
      </div>
    );
  }

}

export default App;
