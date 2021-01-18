import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import 'antd/dist/antd.css';
import web3 from './utils/InitWeb3';

//合约
import crowdFunding from './eth/CrowdFunding';
import Funding from './eth/Funding';

//路由
import Fundings_all from './page/Fundings_all';
import Fundings_created from './page/Fundings_created';
import Fundings_contributed from './page/Fundings_contributed';
import Fundings_create from './page/Fundings_create';
import Fundings_detail from './page/Fundings_detail';

class App extends Component {

  constructor() {
    super();
    this.state = {
      currentAccount: '',
      FundingsInfo: [],
      myFundingsInfo: [],
      contributedFundingsInfo: [],
    };
  };

  getFundings = async () => {
    const newFundingsInfo = [];
    const Fundings = await crowdFunding.methods.getFundings().call();
    let cnt = 1;
    await Promise.all(
      Fundings.map(async FundingAddress => {
        const FundingInstance = Funding(FundingAddress);
        console.log('get instance');
        const FundingInfo = await FundingInstance.methods.getDetail().call({
          from: this.state.currentAccount,
        });
        const FundingTime = await FundingInstance.methods.getTime().call(
          {
            from: this.state.currentAccount,
          }
        );
        console.log(FundingInfo);
        console.log(FundingTime);
        FundingTime.FundingStartTime = new Date(Number(FundingInfo.FundingStartTime) * 1000).toLocaleString("en-GB");
        FundingInfo.contract = FundingInstance;
        FundingInfo.Targetnum = Number(web3.utils.fromWei(FundingInfo.FundingTarget));
        FundingInfo.Totalnum = Number(web3.utils.fromWei(FundingInfo.FundingTotal));
        FundingInfo.FundingTarget_eth = web3.utils.fromWei(FundingInfo.FundingTarget) + 'ETH';
        FundingInfo.FundingBalance_eth = web3.utils.fromWei(FundingInfo.FundingBalance) + 'ETH';
        FundingInfo.FundingTotal_eth = web3.utils.fromWei(FundingInfo.FundingTotal) + 'ETH';
        FundingInfo.FundingContribution_eth = web3.utils.fromWei(FundingInfo.FundingContribution) + 'ETH';
        FundingInfo.Percentage = String(FundingInfo.Totalnum / FundingInfo.Targetnum);
        if (FundingInfo.FundingState === "0") {
          let timestamp = (new Date()).getTime();
          if (timestamp > Number(FundingInfo.FundingDeadline) * 1000) FundingInfo.FundingState = 'Failed';
          else FundingInfo.FundingState = 'Ongoing';
        }
        else if (FundingInfo.FundingState === "1") FundingInfo.FundingState = 'Outdated';
        else if (FundingInfo.FundingState === "2") FundingInfo.FundingState = 'Succeeded';
        else if (FundingInfo.FundingState === "3") FundingInfo.FundingState = 'Failed';
        else if (FundingInfo.FundingState === "4") FundingInfo.FundingState = 'Paidoff';
        FundingInfo.FundingTarget += 'WEI';
        FundingInfo.FundingBalance += 'WEI';
        FundingInfo.FundingTotal += 'WEI';
        FundingInfo.FundingContribution += 'WEI';
        FundingInfo.FundingStartTime = new Date(Number(FundingInfo.FundingStartTime) * 1000).toLocaleString("en-GB");
        FundingInfo.FundingDeadline = new Date(Number(FundingInfo.FundingDeadline) * 1000).toLocaleString("en-GB");
        if (FundingInfo.FundingCompleteTime === "0")
          FundingInfo.FundingCompleteTime = 'None';
        else
          FundingInfo.FundingCompleteTime = new Date(Number(FundingInfo.FundingCompleteTime) * 1000).toLocaleString("en-GB");
        if (FundingInfo.FundingEndTime === "0")
          FundingInfo.FundingEndTime = 'None';
        else
          FundingInfo.FundingEndTime = new Date(Number(FundingInfo.FundingEndTime) * 1000).toLocaleString("en-GB");
        FundingInfo.key = cnt++;
        console.log(FundingInfo);
        newFundingsInfo.push(FundingInfo);
      })
    );
    this.setState({ FundingsInfo: newFundingsInfo });
  }

  getCreatedFundings = async () => {
    console.log(this.state.currentAccount);
    console.log(this.state.FundingsInfo);
    console.log(this.state.myFundingsInfo);
    let temp = this.state.FundingsInfo;
    let str = this.state.currentAccount;
    let cnt = 1;
    temp.forEach((fund) => {
      if (fund.FundingCreator === str) {
        let f = Object.assign({}, fund); //深拷贝
        f.key = cnt;
        this.state.myFundingsInfo.push(f);
      }
      cnt++;
    });
  }
  getContributedFundings = async () => {
    console.log(this.state.currentAccount);
    console.log(this.state.FundingsInfo);
    console.log(this.state.contributedFundingsInfo);
    let temp = this.state.FundingsInfo;
    let cnt = 1;
    temp.forEach((fund) => {
      if (fund.FundingContribution !== '0WEI') {
        let f = Object.assign({}, fund); //深拷贝
        f.key = cnt;
        this.state.contributedFundingsInfo.push(fund);
      }
      cnt++;
    });
  }

  createFunding = async (title, description, deadline, target) => {
    try {
      await crowdFunding.methods.createFunding(
        title, description, Math.round(deadline / 1000), web3.utils.toWei(target.toString())
      ).send({
        from: this.state.currentAccount,
        gas: '3000000',
      });
      alert('创建众筹项目成功');
    } catch (e) {
      alert('创建众筹项目失败');
    }
    this.getFundings();
  }

  createRequest = async (index, title, description, amount) => {
    try {
      console.log("********");
      console.log(index);
      console.log(title, description, amount);
      const FundingContract = this.state.FundingsInfo[index].contract;
      await FundingContract.methods.createUsage(title, description, web3.utils.toWei(amount)).send({
        from: this.state.currentAccount,
        gas: '3000000',
      });
      alert('创建请求成功');
    } catch (e) {
      alert('创建请求失败');
    }
  }

  contribute = async (index, amount) => {
    try {
      const FundingContract = this.state.FundingsInfo[index].contract;
      await FundingContract.methods.contribute().send({
        from: this.state.currentAccount,
        value: web3.utils.toWei(amount, 'ether'),
        gas: '3000000',
      });
      alert('投资成功');
    } catch (e) {
      alert('投资失败');
    }
    this.getFundings();
  }
  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ currentAccount: accounts[0] });
    await this.getFundings();
    console.log(this.getFundings);
    await this.getCreatedFundings();
    console.log(this.getCreatedFundings);
    await this.getContributedFundings();
    console.log(this.getContributedFundings);
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/Funding/:index" children={
              <Fundings_detail
                currentAccount={this.state.currentAccount}
                FundingsInfo={this.state.FundingsInfo}
                getFundings={this.getFundings}
                createRequest={this.createRequest}
                contribute={this.contribute}
              ></Fundings_detail>
            }>
            </Route>
            <Route exact path="/Fundings_created">
              <Fundings_created
                currentAccount={this.state.currentAccount}
                FundingsInfo={this.state.myFundingsInfo}
                getFundings={this.getCreatedFundings}
                index='2'
              ></Fundings_created>
            </Route>
            <Route exact path="/Fundings_contributed">
              <Fundings_contributed
                currentAccount={this.state.currentAccount}
                FundingsInfo={this.state.contributedFundingsInfo}
                getFundings={this.getContributedFundings}
                index='3'
              ></Fundings_contributed>
            </Route>
            <Route exact path="/Fundings_create">
              <Fundings_create
                currentAccount={this.state.currentAccount}
                createFunding={this.createFunding}
                index='4'
              ></Fundings_create>
            </Route>
            <Route path="/">
              <Fundings_all
                currentAccount={this.state.currentAccount}
                FundingsInfo={this.state.FundingsInfo}
                getFundings={this.getFundings}
                index='1'
              ></Fundings_all>
            </Route>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App;
