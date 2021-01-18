// @ts-nocheck
import React, {Component} from 'react';

import { Layout, Tabs, Button, Modal, Form, Input, InputNumber, message } from 'antd';

import MyCampaignTab from "./my-campaign";
import AllCampaignTab from "./all-campagin";
import web3 from "../../utils/web3";
import contract from "../../utils/contracts";
import InvolvedCampaignTab from "./involved-campaign";

const { Content } = Layout;
const { TabPane } = Tabs;

class HomePage extends Component {

    formRef = React.createRef()

    state = {
        modalVisible: false,
        isConnected: false,
        address: ""
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
        }
    }

     async campaignFormSubmit(values: any){
        let durTime = values.durTime;
        let targetMoney = values.targetMoney;
        let projectDescription = values.projectDescription;
        let projectName = values.projectName;
        try {
            let ret = await contract.methods.newCampaign(projectName, projectDescription, this.state.address, targetMoney, durTime).send({
                from: this.state.address,
                gas: 1000000
            })
            message.success('成功创建合约!');
            window.location.href = '/home';
        }
        catch(e){
            message.error('发送合约失败，请检查！');
        }
    }

    render() {

        // @ts-ignore
        return (
            <Content style={{ padding: '50px' }}>
                <Tabs defaultActiveKey="1" tabBarExtraContent={
                    <Button
                        disabled={!this.state.isConnected}
                        type={"primary"}
                        onClick={() => {
                            this.setState({
                                modalVisible: true
                            })
                        }}>
                        发起众筹
                    </Button>
                }>
                    <TabPane tab="所有项目" key="1">
                        <AllCampaignTab />
                    </TabPane>
                    <TabPane tab="我发起的项目" key="2">
                        <MyCampaignTab />
                    </TabPane>
                    <TabPane tab="我参与的项目" key="3">
                        <InvolvedCampaignTab />
                    </TabPane>
                </Tabs >
                <Modal
                    visible={this.state.modalVisible}
                    title="新建众筹项目"
                    okText="提交"
                    cancelText="取消"
                    onCancel={() => {
                        this.setState({
                            modalVisible: false
                        })
                    }}
                    onOk={() => {
                        // @ts-ignore
                        this.formRef
                            .current
                            .validateFields()
                            .then((values: any) => {
                                // 重置表单并且提交表单
                                this.formRef.current.resetFields();
                                this.campaignFormSubmit(values);
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
                            name="projectName"
                            label="项目名称"
                            rules={[{ required: true, message: '必须填写名称!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="targetMoney"
                            label="筹集金额（ETH）"
                            rules={[{ required: true, message: '必须填写金额!' }]}
                        >
                            <InputNumber min={1} max={200} />
                        </Form.Item>
                        <Form.Item
                            name="durTime"
                            label="持续时间（天）"
                            rules={[{ required: true, message: '必须填写时间!' }]}
                        >
                            <InputNumber min={1} max={100} />
                        </Form.Item>
                        <Form.Item
                            name="projectDescription"
                            label="项目描述"
                        >
                            <Input type="textarea" />
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>

        )
    }
}

export default HomePage;