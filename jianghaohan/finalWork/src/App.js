import logo from './logo.svg';
import React, { Component, useState } from 'react';
import './App.css';
import { GlobalTable, LocalTable } from './utils/UI';

let web3 = require('./utils/InitWeb3') 
var CrowdFunding = require('./CrowdFunding.json').abi  
let Conaddr = "0x2C84350CE644Ea3A5C0CDcC8AefBedfB6C1a2a2D" // contract address
let CFI = new web3.eth.Contract(CrowdFunding, Conaddr)  // crowd funding instance

class App extends Component {
    constructor() {
        super()
        this.state = {
            globalAva: 0,
            globalFid: [],
            globalFstate: [],
            globalFintro: [],
            globalFgoal: [],
            globalFcurr: [],
            globalFddl: [],
            localAddr: "",
            localIid: [],
            localIstate: [],
            localIintro: [],
            localIgoal: [],
            localIinv: [],
            localItime: [],
            localSid: [],
            localSstate: [],
            localScurr: [],
            localSddl: [],
            localRstate: [],
            localRid: [],
            localRamount: [],
            localRcurr: [],
            localRddl: []
        }
    }
    createFund = async (introduction, goal, ddl) => {
        console.log("sponsor: " + this.state.localAddr)
        console.log("introduction: " + introduction)
        console.log("ddl: " + ddl)
        console.log("goal: " + goal)
        goal = web3.utils.toWei(goal, 'ether')
        try {
            await CFI.methods.createFund(introduction, goal, ddl).send({ from: this.state.localAddr })
            alert('Successfully created a fund')
        } catch (err) {
            console.log(err)
            alert('Create Failed')
        }
        return;
    }
    investFund = async (fid, amount) => {
        console.log("fid: " + fid)
        console.log("amount: " + amount)
        amount = web3.utils.toWei(amount, 'ether')
        try {
            await CFI.methods.investFund().send({
                from: this.state.localAddr,
                value: amount
            })
            alert('Invest Success!')
        } catch (err) {
            console.log(err)
            alert('Invest Failed!')
        }
        return;
    }
    createRequest = async (introduction, amount, ddl) => {
        console.log("introduction: " + introduction)
        console.log("amount: " + amount)
        console.log("ddl: " + ddl)
        try {
            await CFI.methods.createRequest(introduction, amount, ddl).send({ from: this.state.localAddr })
            alert('Create Request Success!')
        } catch (err) {
            console.log(err)
            alert('Create Request Failed!')
        }
        return;
    }
    agreeRequest = async (fid, reqid) => {
        console.log("fid: " + fid)
        console.log("reqid: " + reqid)
        try {
            await CFI.methods.agreeRequest(fid, reqid).send({ from: this.state.localAddr })
            alert('Vote Agree Succeed!')
        } catch (err) {
            console.log(err)
            alert('Vote Agree Failed!')
        }
        return
    }
    disagreeRequest = async (fid, reqid) => {
        console.log("fid: " + fid)
        console.log("reqid: " + reqid)
        try {
            await CFI.methods.disagreeRequest(fid, reqid).send({ from: this.state.localAddr })
            alert('Vote Disagree Succeed!')
        } catch (err) {
            console.log(err)
            alert('Vote Disagree Failed!')
        }
        return
    }

    Display = async () => {
        await CFI.methods.updateFundState().call({ from: this.state.localAddr })
        await CFI.methods.updateRequestState().call({ from: this.state.localAddr })
        let _localAddr = await web3.eth.getAccounts()
        var _globalFid = []
        var _globalFstate = []
        var _globalFintro = []
        var _globalFgoal = []
        var _globalFcurr = []
        var _globalFddl = []
        var _globalAva = await CFI.methods.getAvaNum().call({from: _localAddr[0]})
        for (let i = 0; i < _globalAva[0]; i++) {
            var F = await CFI.methods.getAva(i)
            _globalFid.push(F[0])
            _globalFstate.push(F[1])
            _globalFintro.push(F[2])
            _globalFgoal.push(F[3])
            _globalFddl.push(F[4])
        }

        var _localIid = []
        var _localIstate = []
        var _localIintro = []
        var _localIgoal = []
        var _localIinv = []
        var _localItime = []
        var _localINum = await CFI.methods.getInvNum().call({ from: _localAddr[0] })
        for (let i = 0; i < _localINum[0]; i++) {
            var I = await CFI.methods.getInvest(i);
            _localIid.push(I[0])
            _localIstate.push(I[1])
            _localIintro.push(I[2])
            _localIgoal.push(I[3])
            _localIinv.push(I[4])
            _localItime.push(I[5])
        }

        var _localSid = []
        var _localSstate = []
        var _localSintro = []
        var _localSgoal = []
        var _localScurr = []
        var _localSddl = []
        var _localSNum = await CFI.methods.getSpnNum().call({ from: _localAddr[0] })
        for (let i = 0; i < _localSNum[0]; i++) {
            var S = await CFI.methods.getSponsor(i);
            _localSid.push(S[0])
            _localSstate.push(S[1])
            _localSintro.push(S[2])
            _localSgoal.push(S[3]) 
            _localScurr.push(S[4])
            _localSddl.push(S[5])
        }

        var _localRstate = []
        var _localRid = []
        var _localRamount = []
        var _localRcurr = []
        var _localRddl = []
        var _localRNum = await CFI.methods.getRequestList.call({ from: _localAddr[0] })
        for (let i = 0; i < _localRNum[0].length; i++) {
            var R = await CFI.methods.getRequest(_localRNum[0][i]).call({ from: _localAddr[0] })
            _localRstate.push(R[0])
            _localRid.push(R[1])
            _localRamount.push(R[2])
            _localRcurr.push(R[3])
            _localRddl.push(R[4])
        }

        this.setState({
            globalAva: _globalAva[0],
            globalFid: _globalFid,
            globalFstate: _globalFstate,
            globalFintro: _globalFintro,
            globalFgoal: _globalFgoal,
            globalFcurr: _globalFcurr,
            globalFddl: _globalFddl,
            localAddr: _localAddr[0],
            localIid: _localIid,
            localIstate: _localIstate,
            localIintro: _localIintro,
            localIgoal: _localIgoal,
            localIinv: _localIinv,
            localItime: _localItime,
            localSid: _localSid,
            localSstate: _localSstate,
            localSintro: _localSintro,
            localSgoal: _localSgoal,
            localScurr: _localScurr,
            localSddl: _localSddl,
            localRstate: _localRstate,
            localRid: _localRid,
            localRamount: _localRamount,
            localRcurr: _localRcurr,
            localRddl: _localRddl
        })
    }

    componentDidMount() {
        this.Display()
    }

    render() {
        console.log("Current Acount:  " + this.state.myaccount)
        return (
            <div className="App">
                <header className="App-header">
                    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
                    <h1>去中心化众筹DApp</h1>
                </header>
                <div>
                    <GlobalTable
                        globalAva={this.state.globalAva}
                        globalFid={this.state.globalFid}
                        globalFstate={this.state.globalFstate}
                        globalFintro={this.state.globalFintro}
                        globalFgoal={this.state.globalFgoal}
                        globalFcurr={this.state.globalFcurr}
                        globalFddl={this.state.globalFddl}
                    />
                </div>
                <div>
                    <LocalTable
                        createFund={this.createFund}
                        investFund={this.investFund}
                        createRequest={this.createRequest}
                        agreeRequest={this.agreeRequest}
                        disagreeRequest={this.disagreeRequest}

                        localAddr={this.state.localAddr}
                        localIid={this.state.localIid}
                        localIstate={this.state.localIstate}
                        localIintro={this.state.localIintro}
                        localIgoal={this.state.localIgoal}
                        localIinv={this.state.localIinv}
                        localItime={this.state.localItime}
                        localSid={this.state.localSid}
                        localSstate={this.state.localSstate}
                        localSintro={this.state.localSintro}
                        localSgoal={this.state.localSgoal}
                        localScurr={this.state.localScurr}
                        localSddl={this.state.localSddl}
                        localRstate={this.state.localRstate}
                        localRid={this.state.localRid}
                        localRamount={this.state.localRamount}
                        localRcurr={this.state.localRcurr}
                        localRddl={this.state.localRddl}
                    />
                </div>
            </div>
        );
    }
}

export default App;
