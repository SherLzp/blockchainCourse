import { Component, React } from 'react'
import { Card, List, Button, Input, Modal, Divider } from 'antd'
import crowdfundingInstance from '../eth/Crowdfunding'
import { toWei, fromWei } from '../utils/convert'

let web3 = require('../utils/InitWeb3')
class MyFundings extends Component {
    constructor() {
        super()
        this.state = {
            myFundingList: [],
            myCreation: {},
            myCreationNum: 0,
            myCreationList: [],
            launchVote: {
                title: '',
                usage: 0,
                deadline: 0//days in the input and seconds here
            },
            voteDetail: { title: '', usage: 0 },
            showVoteModal: false,
            showVoteDetail: false
        }

        this.onAgreeButtonPressed = this.onAgreeButtonPressed.bind(this)
        this.handleVoteCanceled = this.handleVoteCanceled.bind(this)
        this.handleVoteOk = this.handleVoteOk.bind(this)
        this.onAgreeButtonPressed = this.onAgreeButtonPressed.bind(this)
        this.isFinished = this.isFinished.bind(this)
        this.getFundingState = this.getFundingState.bind(this)
        this.getCreationState = this.getCreationState.bind(this)
    }

    async componentDidMount() {
        this.setState({ account: this.props.account })
        let numOfProjects = await crowdfundingInstance.methods.numOfProjects().call();
        var list = []
        var myList = []
        for (var i = 0; i < numOfProjects; ++i) {
            let projectDetail = await crowdfundingInstance.methods.getProject(i).call();
            if (projectDetail['owner'] == this.props.account) {
                this.setState({
                    myCreation: projectDetail,
                    myCreationNum: i
                })

                myList.push(projectDetail)
            }
            for (var j = 0; j < projectDetail['numOfFunders']; ++j) {
                let funderDetail = await crowdfundingInstance.methods.getFunder(i, j).call();
                console.log(funderDetail[0])
                if (funderDetail[0] == this.props.account) {
                    list.push(projectDetail)
                }
            }
        }
        this.setState({
            myFundingList: list,
            myCreationList: myList
        })

    }

    onAgreeButtonPressed = (pid) => {
        crowdfundingInstance.methods.vote(pid).send({
            from: this.props.account,
            gas: 1000000
        })
        crowdfundingInstance.methods.checkVoteAgreed(pid).send({
            from: this.props.account,
            gas: 1000000
        })
    }

    handleVoteOk = (pid, title, usage, deadline) => {
        crowdfundingInstance.methods.launchVote(pid, title, toWei(usage), deadline).send({
            from: this.props.account,
            gas: 300000
        })
        this.setState({ showVoteModal: false })
    }

    handleVoteCanceled = () => {
        this.setState({ showVoteModal: false })
    }

    async getVoteDetail(pid) {
        let d = await crowdfundingInstance.methods.getProjectVote(pid).call()
        this.setState({
            voteDetail: {
                title: d.title,
                usage: d.usage
            }
        })
    }

    showVoteDetail = () => {
        this.setState({
            showVoteDetail: true
        })
    }

    handleVoteDetailCanceled = () => {
        this.setState({
            showVoteDetail: false
        })
    }

    isFinished = (item) => {
        var start = item['time']
        var deadline = item['deadline']
        var d = new Date()
        return ((d.getTime() / 1000 > (start + deadline)) || (item.isFinished))
    }

    getFundingState = (item) => {
        if (this.isFinished(item)) {
            var s = "已经使用：" + fromWei(item.goal - item.amount)
            if (item.isVoting) {
                s = s + "\t\n正在投票中"
            }
            return s
        }
        else {
            return "未结束"
        }
    }

    getCreationState = (item) => {
        return (
            <div>
                <p>正在投票中：{item.isVoting ? "是" : "否"}</p>
                <p>筹集总量 {fromWei(item.goal)}</p>
                <p>还可以使用 {fromWei(item.amount)}</p>
                <p>
                    <Button type='primary'
                        onClick={e => { e.preventDefault(); this.setState({ showVoteModal: true }) }}
                        disabled={JSON.stringify(item) === "{}" || !this.isFinished(item) || item.amount <= 0}>
                        发起使用请求
            </Button>
                </p>
            </div>)
    }

    render() {
        return (
            <div>
                <Divider>我发起的项目</Divider>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <List
                        bordered
                        dataSource={this.state.myCreationList}
                        renderItem={item => (
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <p>
                                    <Card title={item.title} style={{ width: 300 }} loading={!JSON.stringify(item) === "{}"}>
                                        <p>{!this.isFinished(item) ? "未结束，已经筹集" + item.amount : ""}</p>
                                        <p>{this.isFinished(item) ? this.getCreationState(item) : ""}</p>
                                    </Card>
                                </p>

                                <Modal
                                    title='发起使用申请'
                                    visible={this.state.showVoteModal}
                                    onOk={e => {
                                        e.preventDefault();
                                        this.handleVoteOk(item.pid, this.state.launchVote.title, this.state.launchVote.usage, this.state.launchVote.deadline)
                                    }}
                                    onCancel={this.handleVoteCanceled}>
                                    <p>
                                        <Input placeholder='使用原因'
                                            style={{ width: 300 }}
                                            onChange={e => {
                                                this.setState(prevState => ({
                                                    launchVote: {
                                                        ...prevState.launchVote,
                                                        ['title']: e.target.value
                                                    }
                                                }))
                                            }} />
                                    </p>
                                    <p>
                                        <Input placeholder='使用量'
                                            style={{ width: 300 }}
                                            onChange={e => {
                                                this.setState(prevState => ({
                                                    launchVote: {
                                                        ...prevState.launchVote,
                                                        ['usage']: e.target.value
                                                    }
                                                }))
                                            }} />
                                    </p>
                                    <Input placeholder='投票截止时间（天）'
                                        style={{ width: 300 }}
                                        onChange={e => {
                                            this.setState(prevState => ({
                                                launchVote: {
                                                    ...prevState.launchVote,
                                                    ['deadline']: e.target.value * 24 * 3600
                                                }
                                            }))
                                        }} />
                                </Modal>
                            </div>
                        )}
                    />
                </div>
                <Divider>我参与的项目</Divider>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <List
                        bordered
                        dataSource={this.state.myFundingList}
                        renderItem={item => (
                            <List.Item>

                                <Card title={item.title} style={{ width: 300 }}>
                                    <p>筹款总数：{fromWei(item.goal)}</p>
                                    <p>{this.getFundingState(item)}</p>
                                    &nbsp;
                                            <Button type='primary'
                                        onClick={e => { e.preventDefault(); this.getVoteDetail(item.pid); this.setState({ showVoteDetail: true }) }}
                                        disabled={!item.isVoting}>
                                        查看使用申请
                                            </Button>
                                    <Modal
                                        title="众筹经费使用详情"
                                        visible={this.state.showVoteDetail}
                                        onCancel={this.handleVoteDetailCanceled}
                                        onOk={e => { e.preventDefault(); this.onAgreeButtonPressed(item.pid); this.setState({ showVoteDetail: false }) }}
                                    >
                                        <p>如果您不想同意该使用申请，请直接点击取消</p>
                                        <p>使用说明：{this.state.voteDetail.title}</p>
                                        <p>使用量：{fromWei(this.state.voteDetail.usage)}</p>

                                    </Modal>
                                </Card>

                            </List.Item>
                        )}
                    />
                </div>
            </div>
        )
    }
}

export default MyFundings;