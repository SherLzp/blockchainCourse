import React, {Component} from "react";
import {Button, Form, Input, List, Modal} from "antd";
import CardAllCampaign from "../../../components/card/card-all-campaign";

import web3 from "../../../utils/web3";
import contract from "../../../utils/contracts";

class AllCampaignTab extends Component {

    state ={
        Campaigns: [],
        Uses: [],
        CampaignsNum: 0,
        isConnected: false,
        address: ""
    }

    async componentDidMount() {
        let accounts = await web3.eth.getAccounts()
        if(accounts.length == 0) {
            this.setState({
                isConnected: false
            })
        }
        else {
            await this.setState({
                isConnected: true,
                address: accounts[0]
            })
            let numCampaigns = await contract.methods.numCampaigns().call();
            let campaigns = [];
            let uses = [];
            for(let i = 0; i < numCampaigns; i++) {
                const campaign = await contract.methods.campaigns(i).call();
                this.formatCampaign(campaign, i)
                const use = await contract.methods.uses(i).call();
                this.formatUse(use, i)

                uses.push(use);
                campaigns.push(campaign);
            }
            this.setState({
                Campaigns: campaigns,
                Uses: uses,
                CampaignsNum: numCampaigns
            })
        }
    }

    private formatCampaign(data: any, index: number) {
        // 判断当前项目是否超时
        let curTime = new Date().getTime() / 1000;  // 当前的时间，距1970年的秒数
        if(data.endTime > curTime) {
            data.overTime = false;
        }
        else {
            data.overTime = true;
        }

        data.index = index;
        data.targetMoney = web3.utils.fromWei(data.targetMoney, 'ether')
        data.collectedMoney = web3.utils.fromWei(data.collectedMoney, 'ether')
        data.startTime = this.formatTime(data.startTime)
        data.endTime = this.formatTime(data.endTime)
    }

    private formatUse(data: any, index: number) {
        data.index = index;
        data.amount = web3.utils.fromWei(data.amount, 'ether')
        data.agreeAmount = web3.utils.fromWei(data.agreeAmount, 'ether')
        data.disagreeAmount = web3.utils.fromWei(data.disagreeAmount, 'ether')
    }

    private formatTime(time: string) {
        var d = new Date(parseInt(time) * 1000);
        return (d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
    }

    render() {
        // @ts-ignore
        return (
            <div>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.Campaigns}
                    renderItem={(item, index) => (
                        <List.Item>
                            <CardAllCampaign campaign={item} use={this.state.Uses[index]}/>
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}

export default AllCampaignTab;