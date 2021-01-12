// @ts-nocheck
import React,{Component} from 'react'
import {PageHeader, Tabs, Button, Statistic, Descriptions, Tag, Modal, Input, Form, message} from 'antd';
import contract from "../../utils/contracts";
import web3 from "../../utils/web3";

const { TabPane } = Tabs;

/**
 * footer
 */
interface IProps {
    campaign: any
    use: any
}

class CardMyInvolved extends Component<IProps> {

    constructor(props: IProps) {
        super(props)
    }

    state = {
        isConnected: false,
        address: "",
        tabInUse: 1,
        buttonDisable: false,
        tagColor: "blue",
        campaignState: "进行中"
    }

    async componentDidMount() {
        let accounts = await web3.eth.getAccounts()
        if (accounts.length == 0) {
            this.setState({
                isConnected: false
            })
        }
        else {
            await this.setState({
                isConnected: true,
                address: accounts[0]
            })

            let campaign = this.props.campaign;
            if(campaign.state == 1 || campaign.overTime == true) {
                this.setState({
                    campaignState: "项目失败",
                    tagColor:"red"
                })
            }
            else if(campaign.state == 2) {
                this.setState({
                    campaignState: "项目完成",
                    tagColor:"green"
                })
            }
            else {
                this.setState({
                    campaignState: "进行中",
                    tagColor:"blue"
                })
            }

            this.isVotable(campaign)
        }
    }

    async isVotable(campaign: any) {
        // 如果项目已经结束或者还不能开始投票
        if(campaign.state != 4) {
            this.setState({
                buttonDisable: true
            })
        }

        // 该用户是否投过票
        else {
            let hasVoted = false;
            let index = 0;
            let retFunders = await contract.methods.getInvestors(campaign.index).call()
            let retVoters = await contract.methods.getVotes(campaign.index).call()
            // 先找到该用户在所有用户中的序号
            for(let i = 0; i < retFunders.length; i++) {
                if(retFunders[i] == this.state.address) {
                    index = i;
                    break;
                }
            }
            // 用户和投票权一一对应，所以这个序号也是该用户投票权的索引
            if(retVoters[index] != 0) {
                hasVoted = true;
            }
            if(hasVoted == true) {
                this.setState({
                    buttonDisable: true
                })
            }
        }
    }

    renderCampaignContent = (column = 2) => (
        <Descriptions size="small" column={column}>
            <Descriptions.Item label="发起人">{this.props.campaign.manager}</Descriptions.Item>
            <Descriptions.Item label="众筹金额">
                <a>{this.props.campaign.targetMoney} ETH</a>
            </Descriptions.Item>
            <Descriptions.Item label="参与人数">{this.props.campaign.numFunders}</Descriptions.Item>
            <Descriptions.Item label="已筹金额">
                <a>{this.props.campaign.collectedMoney} ETH</a>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{this.props.campaign.startTime}</Descriptions.Item>
            <Descriptions.Item label="结束时间">{this.props.campaign.endTime}</Descriptions.Item>
            <Descriptions.Item label="项目描述">
                {this.props.campaign.projectDescription}
            </Descriptions.Item>
        </Descriptions>
    );

    renderUseContent = (column = 2) => (
        <Descriptions size="small" column={column}>
            <Descriptions.Item label="发起人">{this.props.campaign.manager}</Descriptions.Item>
            <Descriptions.Item label="众筹金额">
                <a>{this.props.campaign.targetMoney} ETH</a>
            </Descriptions.Item>
            <Descriptions.Item label="参与人数">{this.props.campaign.numFunders}</Descriptions.Item>
            <Descriptions.Item label="使用金额">
                <a>{this.props.use.amount} ETH</a>
            </Descriptions.Item>
            <Descriptions.Item label="同意者所持股份">{(this.props.use.agreeAmount / this.props.campaign.targetMoney).toFixed(2) * 100} %</Descriptions.Item>
            <Descriptions.Item label="同意人数">{this.props.use.numVote}</Descriptions.Item>
            <Descriptions.Item label="使用描述">
                {this.props.use.useDescription}
            </Descriptions.Item>
        </Descriptions>
    );

    // @ts-ignore
    Content = ({ children }) => (
        <div className="content">
            <div className="main" >{children}</div>
        </div>
    );

    async vote(b: boolean){
        let id = this.props.campaign.index;
        try {
            let ret = await contract.methods.agreeUse(id, b).send({
                from: this.state.address,
                gas: 1000000
            })
            message.success('成功完成投票!');
            window.location.href = '/home';
        }
        catch(e){
            message.error('投票失败，请检查！');
        }
    }

    render() {
        return (
            <div style={{boxShadow: "2px 2px 1px 2px #888", margin: "5px"}}>
                <PageHeader
                    className="site-page-header-responsive"
                    title={this.props.campaign.projectName}
                    tags={<Tag color={this.state.tagColor}>{this.state.campaignState}</Tag>}
                    extra={[
                        <div>
                            <Button key="1" style={{marginRight:"10px"}} type="primary" disabled={this.state.buttonDisable} onClick={() => {
                                this.vote(true)
                            }}>
                                同意使用请求
                            </Button>
                            <Button key="2" type="primary" danger disabled={this.state.buttonDisable} onClick={() => {
                                this.vote(false)
                            }}>
                                拒绝使用请求
                            </Button>
                        </div>
                    ]}
                    footer={
                        <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
                            <TabPane tab="募集" key="1" />
                            <TabPane tab="使用" disabled={!(this.props.campaign.state == 2 || this.props.campaign.state == 4)} key="2" />
                        </Tabs>
                    }
                >
                    {this.state.tabInUse==1&&<this.Content >{this.renderCampaignContent()}</this.Content>}
                    {this.state.tabInUse==2&&<this.Content >{this.renderUseContent()}</this.Content>}
                </PageHeader>
            </div>
        )
    }

    onTabChange = (activeKey: any) => {
        this.setState({
            tabInUse: activeKey
        })
    };
}

export default CardMyInvolved