// @ts-nocheck
import React,{Component} from 'react'
import {PageHeader, Tabs, Button, Descriptions, Tag, Modal, Input, Form, InputNumber, message} from 'antd';

import web3 from "../../utils/web3";
import contract from "../../utils/contracts";

const { TabPane } = Tabs;

/**
 * footer
 */
interface IProps {
    campaign: any
    use: any
}

class CardAllCampaign extends Component<IProps> {

    formRef = React.createRef()

    constructor(props: IProps) {
        super(props)
    }

    state = {
        isConnected: false,
        address: "",
        tabInUse: 1,
        modalVisible: false,
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

            this.canInvolvedIn(campaign);
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

    async involveFormSubmit(values: any){
        let amount = web3.utils.toWei(values.amount.toString(), 'ether');
        let id = this.props.campaign.index;
        try {
            let ret = await contract.methods.contribute(id).send({
                from: this.state.address,
                value: amount
            })
            message.success('成功参与众筹!');
            window.location.href = '/home';
        }
        catch(e){
            message.error('参与众筹失败，请检查！');
        }
    }

    async canInvolvedIn(campaign: any) {
        console.log(campaign)
        // 状态是否为募集中
        // 是否超时
        // 经理是否是自己
        if(campaign.state != 0 || campaign.overTime == true || campaign.manager == this.state.address) {
            this.setState({
                buttonDisable: true
            })
        }
        // 是否已经参与了该项目
        else {
            let hasInvolved = false;
            let ret = await contract.methods.getInvestors(campaign.index).call()
            for(let i = 0; i < ret.length; i++) {
                if(ret[i] == this.state.address) {
                    hasInvolved = true;
                    break;
                }
            }
            if(hasInvolved == true) {
                this.setState({
                    buttonDisable: true
                })
            }
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
                        <Button key="1" type="primary" disabled={this.state.buttonDisable} onClick={() => {
                            this.setState({
                                modalVisible: true
                            })
                        }}>
                            尝试参与该项目
                        </Button>
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
                <Modal
                    visible={this.state.modalVisible}
                    title="参与该项目"
                    okText="提交"
                    cancelText="取消"
                    onCancel={() => {
                        this.setState({
                            modalVisible: false
                        })
                    }}
                    onOk={() => {
                        this.formRef
                            .current
                            .validateFields()
                            .then((values: any) => {
                                // 重置表单并且提交表单
                                this.formRef.current.resetFields();
                                this.involveFormSubmit(values);
                            })
                            .catch((info: any) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                >
                    <Form
                        ref={this.formRef}
                        layout="vertical"
                        name="campaignForm"
                        initialValues={{ modifier: 'public' }}
                    >
                        <Form.Item
                            name="amount"
                            label="投入金额（ETH）"
                            rules={[{ required: true, message: '必须填写金额!' }]}
                        >
                            <InputNumber min={1} max={this.props.campaign.targetMoney - this.props.campaign.collectedMoney} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }

    onTabChange = (activeKey: any) => {
        this.setState({
            tabInUse: activeKey
        })
    };
}

export default CardAllCampaign