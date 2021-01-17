import React from 'react';
import UI from './ui/ui';
import './App.css';
import moment from 'moment';

let web3 = require('./utils/InitWeb3')
let crowdfundingIns = require("./eth/crowdfunding")
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            current_account: '',
            fundings_info: [],
            my_fundings_info: [],
            part_fundings_info: [],
            num_fundings: 0,
        }
    }
    getFundings = async () => {
        var tmp_fundings_info = [];
        var num_fundings = await crowdfundingIns.methods.get_num_fundings().call();
        for (var i = 0; i < num_fundings; i++) {
            var ins = await crowdfundingIns.methods.get_funding(i).call();
            var funding_info = new Object();
            funding_info.index = ins[0];
            funding_info.address = ins[1];
            funding_info.amount = web3.utils.fromWei(ins[2]) + ' ETH';
            funding_info.amount_get = web3.utils.fromWei(ins[3]) + ' ETH';
            funding_info.start_time = moment.unix(ins[4]).format("MMMM Do YYYY, HH:mm:ss");
            funding_info.end_time = moment.unix(ins[5]).format("MMMM Do YYYY, HH:mm:ss");
            funding_info.status = ins[6];
            if (ins[6] == 0 && ins[5] < moment().format('X')) {
                funding_info.status = 2;
            }
            //console.log(funding_info.status);

            funding_info.info = ins[7];
            funding_info.title = ins[8];
            tmp_fundings_info.push(funding_info);
        }
        this.setState({ fundings_info: tmp_fundings_info });
    }

    getMyFundings = async () => {
        var tmp_my_fundings_info = [];
        var num_fundings = await crowdfundingIns.methods.get_num_fundings().call();
        for (var i = 0; i < num_fundings; i++) {
            var ins = await crowdfundingIns.methods.get_funding(i).call();
            var funding_info = new Object();
            funding_info.index = ins[0];
            funding_info.address = ins[1];
            if (funding_info.address == this.state.current_account) {
                funding_info.amount = web3.utils.fromWei(ins[2]) + ' ETH';
                funding_info.amount_get = web3.utils.fromWei(ins[3]) + ' ETH';
                funding_info.start_time = moment.unix(ins[4]).format("MMMM Do YYYY, HH:mm:ss");
                funding_info.end_time = moment.unix(ins[5]).format("MMMM Do YYYY, HH:mm:ss");
                funding_info.status = ins[6];
                if (ins[6] == 0 && ins[5] < moment().format('X')) {
                    funding_info.status = 2;
                }
                //console.log(funding_info.status);

                funding_info.info = ins[7];
                funding_info.title = ins[8];
                tmp_my_fundings_info.push(funding_info);
            }
        }
        this.setState({ my_fundings_info: tmp_my_fundings_info });
    }

    getPartFundings = async () => {
        var tmp_part_fundings_info = [];
        var num_fundings = await crowdfundingIns.methods.get_num_fundings().call();
        for (var i = 0; i < num_fundings; i++) {
            var part_in = await crowdfundingIns.methods.check_part(i, this.state.current_account).call();
            if (part_in == false) {
                continue;
            }
            var ins = await crowdfundingIns.methods.get_funding_con(i, this.state.current_account).call();
            var funding_info = new Object();
            funding_info.index = ins[0];
            funding_info.address = ins[1];
            funding_info.amount = web3.utils.fromWei(ins[2]) + ' ETH';
            funding_info.amount_get = web3.utils.fromWei(ins[3]) + ' ETH';
            funding_info.start_time = moment.unix(ins[4]).format("MMMM Do YYYY, HH:mm:ss");
            funding_info.end_time = moment.unix(ins[5]).format("MMMM Do YYYY, HH:mm:ss");
            funding_info.status = ins[6];
            
            if (ins[6] == 0 && ins[5] < moment().format('X')) {
                funding_info.status = 2;
            }
            
            console.log(funding_info.status);
            funding_info.info = ins[7];
            funding_info.title = ins[8];
            funding_info.contribution = web3.utils.fromWei(ins[9]) + ' ETH';
            tmp_part_fundings_info.push(funding_info);
        }
        this.setState({ part_fundings_info: tmp_part_fundings_info });
    }

    refresh_account = async () => {
        const accounts = await web3.eth.getAccounts();
        this.setState({ current_account: accounts[0] });
    }

    createFunding = async (title, info, end_time, amount) => {
        try {
            console.log('create a funding');
            var id = await crowdfundingIns.methods.create_funding(
                title, info, end_time, web3.utils.toWei(amount.toString())
            ).send({
                from: this.state.current_account,
                gas: '3000000',
            });
            alert('Create succeeded');
        } catch (e) {
            console.log(e);
            alert('Create failed');
        }
        this.getFundings();
    }

    createRequest = async (id, purpose, amount) => {
        try {
            console.log('create a request');
            await crowdfundingIns.methods.create_request(
                id, purpose, web3.utils.toWei(amount.toString())
            ).send({
                from: this.state.current_account,
                gas: '3000000',
            });
            alert('Create succeeded');
        } catch (e) {
            console.log(e);
            alert('Create failed');
        }
        this.getFundings();
    }

    Participate = async (index, amount) => {
        try {
            console.log('participate');
            await crowdfundingIns.methods.participant_funding(index).send({
                from: this.state.current_account,
                value: web3.utils.toWei(amount, 'ether'),
                gas: '3000000',
            })
            alert('Participate succeeded');
        } catch (e) {
            console.log(e);
            alert('Participate failed');
        }
        this.getFundings();
        this.getMyFundings();
        this.getPartFundings();
    }

    async componentDidMount() {
        

        this.timer = setInterval(() => {
            this.refresh_account();
            this.getFundings();
            this.getMyFundings();
            this.getPartFundings();
        }, 1000);
    }

    render() {
        return (
            <UI
                current_account={this.state.current_account}
                fundings_info={this.state.fundings_info}
                my_fundings_info={this.state.my_fundings_info}
                part_fundings_info={this.state.part_fundings_info}

                getFundings={this.getFundings}
                getMyFundings={this.getMyFundings}
                getPartFundings={this.getPartFundings}
                refresh_account={this.refresh_account}
                createFunding={this.createFunding}
                createRequest={this.createRequest}
                Participate={this.Participate}
            ></UI>
        );
    }
}

export default App;