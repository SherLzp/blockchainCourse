import { Component, React } from 'react'
import { Card, List, Button, Input } from 'antd'

import crowdfundingInstance from '../eth/Crowdfunding'
import { toWei, fromWei } from '../utils/convert'

//let web3 = require('../utils/InitWeb3')

class AllFundings extends Component {
    constructor() {
        super()
        this.state = {
            totalFundings: 0,
            account: 0,
            allFundingAddrList: [],
            allFundingList: [],
            fundAmount: 0
        }

        this.onFundButtonPressed = this.onFundButtonPressed.bind(this)
        this.isFinished = this.isFinished.bind(this)
    }

    async componentDidMount() {
        let numOfProjects = await crowdfundingInstance.methods.numOfProjects().call();
        var list = []
        for (var i = 0; i < numOfProjects; ++i) {
            let projectDetail = await crowdfundingInstance.methods.getProject(i).call();
            list.push(projectDetail)
        }

        this.setState({
            account: this.props.account,
            totalFundings: numOfProjects,
            allFundingList: list
        })

    }

    onFundButtonPressed = (index) => {
        crowdfundingInstance.methods.contribute(index).send({
            from: this.props.account,
            gas: 1000000,
            value: toWei(this.state.fundAmount)
        })
    }

    isFinished = (item) => {
        var start = item['time']
        var deadline = item['deadline']
        var d = new Date()
        return ((d.getTime() / 1000 > (start + deadline)) || (item.isFinished))
    }

    render() {
        console.log(this.state.allFundingList)
        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <List
                    bordered
                    dataSource={this.state.allFundingList}
                    renderItem={(item, index) => (
                        <List.Item>
                            <Card title={item.title} style={{ width: 300 }}>
                                <p>目标资金：{fromWei(item.goal)}</p>
                                <p>已经筹集：{item.isFinished ? "已结束" : fromWei(item.amount)}</p>
                                <p>截止时间：{item.isFinished ? "已结束" : item.deadline / 24 / 3600 + "天后"}</p>
                                <Input placeholder='投资资金' style={{ width: 100 }} onChange={e => { this.setState({ fundAmount: e.target.value }) }} />
                                <Button type='primary'
                                    disabled={this.isFinished(item) || item.owner === this.props.account}
                                    onClick={e => { e.preventDefault(); this.onFundButtonPressed(index) }}>
                                    参与
                                        </Button>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}

export default AllFundings;