import './App.css';
import AllFundings from './components/AllFundings'
import MyFundings from './components/MyFundings';
import LaunchFunding from './components/LaunchFunding'
import { Divider } from 'antd'
import { Component, React } from 'react';
let web3 = require('./utils/InitWeb3')

class App extends Component {

  constructor() {
    super();
    this.state = {
      account: 0
    }

  }

  async componentDidMount() {
    let account = (await web3.eth.getAccounts())[0];
    this.setState({
      account: account
    })
    console.log(account)
    window.ethereum.on('accountsChanged', (accounts) => {
      //let account = (await web3.eth.getAccounts())[0];
      this.setState({
        account: accounts[0]
      })
      console.log(accounts)
    })
  }

  render() {
    return (
      <div className="App" >
        <center><h2>当前地址：{this.state.account}</h2></center>
        <Divider>全部众筹项目</Divider>
        <AllFundings account={this.state.account} />
        <Divider>我的众筹项目</Divider>
        <MyFundings account={this.state.account} />
        <Divider></Divider>
        <LaunchFunding account={this.state.account} />
      </div>
    );
  }
}

export default App;
