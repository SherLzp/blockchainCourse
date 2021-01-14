import { Component, React } from 'react'
import { Card, List, Button, Input, Modal, Divider } from 'antd'
import crowdfundingInstance from '../eth/Crowdfunding'
import { toWei, fromWei } from '../utils/convert'

let web3 = require('../utils/InitWeb3')

class LaunchFunding extends Component {
    constructor() {
        super()
        this.state = {
            launchFunding: {
                title: '',
                goal: 0,
                deadline: 0 //days in the input and seconds here
            }
        }
    }

    onCreateProject = () => {
        crowdfundingInstance.methods.createProject(
            this.state.launchFunding.title,
            toWei(this.state.launchFunding.goal),
            this.state.launchFunding.deadline).send({
                from: this.props.account,
                gas: 300000
            })
    }

    render() {
        return (
            <div>
                <Divider>发起项目</Divider>
                <Card>
                    <center>
                        <p>
                            <Input placeholder='众筹标题'
                                style={{ width: 300 }}
                                onChange={e => {
                                    this.setState(prevState => ({
                                        launchFunding: {
                                            ...prevState.launchFunding,
                                            ['title']: e.target.value
                                        }
                                    }))
                                }} />
                        </p>
                        <p>
                            <Input placeholder='目标资金'
                                style={{ width: 300 }}
                                onChange={e => {
                                    this.setState(prevState => ({
                                        launchFunding: {
                                            ...prevState.launchFunding,
                                            ['goal']: e.target.value
                                        }
                                    }))
                                }} />
                        </p>
                        <p>
                            <Input placeholder='时间限制（天数）'
                                style={{ width: 300 }}
                                onChange={e => {
                                    this.setState(prevState => ({
                                        launchFunding: {
                                            ...prevState.launchFunding,
                                            ['deadline']: e.target.value * 24 * 3600
                                        }
                                    }))
                                }} />
                        </p>
                        <Button type='primary' onClick={e => { e.preventDefault(); this.onCreateProject(); }}>创建众筹</Button>
                    </center>
                </Card>
            </div>
        )
    }
}

export default LaunchFunding;