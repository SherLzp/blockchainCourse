import React, {Component} from 'react';
import web3 from './utils/InitWeb3'
import {fundingFactoryInstance} from './eth/instance'
import TabCenter from "./display/TabCenter";
import {Header} from 'semantic-ui-react'

import AllFundingTab from "./display/allFundingTab/AllFundingTab";
import CreatorFundingTab from "./display/creatorFundingTab/CreatorFundingTab";
import SupporterFundingTab from "./display/supporterFundingTab/SupporterFundingTab";

class App extends Component {
    constructor() {
        super();

        this.state = {
            currentAccount: '',
        }
    }

    async componentWillMount() {
        let accounts = await web3.eth.getAccounts()
        console.log(accounts)

        let platformManager = await fundingFactoryInstance.methods.platformManager().call()
        // console.log('manager :', platformManager)

        console.log(this.state.currentAccount);
        this.setState({
            currentAccount: accounts[0],
        })
        console.log(this.state.currentAccount);
    }


    render() {
        return (
            <div>
                <Header as='h1' color='Black'>众筹DAPP</Header>
                <p>我的账户：{this.state.currentAccount}</p>
                <h2>所有项目</h2>
                <AllFundingTab/>
                <h2>我的项目</h2>
                <CreatorFundingTab/>
                <h2>我的投资</h2>
                <SupporterFundingTab/>
            </div>
        );
    }
}

export default App;
