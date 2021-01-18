import React from 'react';
import {Badge, Button, Card, Descriptions, Input, message, Progress, Space, Table, Tag} from 'antd';
import {Content} from "antd/es/layout/layout";
import CollectionsPage1 from "../tools/CollectionsPage/CollectionsPage1";
import {withRouter} from "react-router";
import {
    addListener, agreeUse,
    contribute, getAccount, getAllUse,
    getMyFundingAmount,
    getMyFundings,
    getOneFunding,
    newFunding, newUse
} from "../../contracts/contract";
import {CheckCircleOutlined, CloseCircleOutlined, SyncOutlined} from "@ant-design/icons";
import CollectionsPage2 from "../tools/CollectionsPage/CollectionsPage2";


const { Column} = Table;

class InfoPage extends React.Component {
    constructor(props) {
        super(props);
        let index = this.props.location.pathname.slice(6);
        this.state= {
            data: {},
            loading: true,
            myAmount: 0,
            index: index,
            amount: 0,
            allUse: [],
            account:null
        }
    }
    fetchData = async() => {
        this.setState({
            loading : true
        })

        try {
            let data = await getOneFunding(this.state.index);
            let myAmount = await  getMyFundingAmount(this.state.index);
            let allUse = await getAllUse(this.state.index);
            let account = await getAccount();
            this.setState({
                data: data,
                allUse:allUse,
                myAmount: myAmount,
                loading:false,
                account:account
            })
        } catch (e) {
            console.log(e);
            message.error('获取详情失败!');
        }
    }

    Contribute = async(amount) => {
        this.setState({
            amount: amount
        })
        try {
            await contribute(this.state.index,this.state.amount);
            message.success('投资成功');
            await this.fetchData();
        } catch (e) {
            console.log(e);
            message.error('投资失败')
        }
    }
     NewUse = async (values)=>{
         try {
             await newUse(this.state.index, values.goal, values.info);
             message.success('发起请求成功')
             await this.fetchData();
         } catch (e) {
             message.error('发起请求失败')
         }
     }

    clickAgreeUse = async(agree , useID) =>{
        try {
            await agreeUse(this.state.index, useID, agree);
            message.success('操作成功')
            await this.fetchData();
        } catch (e) {
            console.log(e);
            message.error('操作失败')
        }
    }

    async  componentWillMount() {
        await this.fetchData();
        addListener(this.fetchData);
    }


    render(){
        let t=1
        return (
            <Content lassName="site-layout-background" style={{padding: 24, margin: 0, minHeight: 460, background: '#fff'}}>
                <Card title="项目介绍"
                      extra={
                          <div style={{alignItems:"center",display: "flex"}}>
                              <span>{"你投资了  "+this.state.myAmount+"  Eth"} &nbsp;&nbsp;&nbsp;&nbsp;</span>
                              <span><CollectionsPage1 limit={this.state.data.goal-this.state.data.amount} Contribute={this.Contribute}/></span>
                            </div>}
                      style={{ width:1150}}>
                    <Descriptions title={this.state.data.title} bordered>
                        <Descriptions.Item label="众筹标题">{this.state.data.title}</Descriptions.Item>
                        <Descriptions.Item label="众筹发起人" span={2} >{this.state.data.initiator}</Descriptions.Item>
                        <Descriptions.Item label="截止日期">{new Date(this.state.data.endTime * 1000).toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="当前状态" span={2}>
                            {this.state.data.success === true?
                            <Badge status="success" text="众筹成功" />:
                                new Date(this.state.data.endTime * 1000) > new Date()?
                                <Badge status="processing" text="正在众筹" />:
                                    <Badge status="error" text="众筹失败" />}
                        </Descriptions.Item>
                        <Descriptions.Item label="目标金额" >{this.state.data.goal+" Eth"}</Descriptions.Item>
                        <Descriptions.Item label="当前金额">{this.state.data.amount+" Eth"}</Descriptions.Item>
                        <Descriptions.Item label="众筹进度" >
                            <Progress
                                type="circle"
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                                percent={
                                    this.state.data.success === true?100:
                                        this.state.data.amount===0? 0:
                                            (this.state.data.amount/this.state.data.goal*100).toFixed(2)
                                }
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="众筹介绍">
                            {this.state.data.info+'\n'}
                        </Descriptions.Item>
                    </Descriptions>,
                </Card>
                <p>&nbsp;</p>
                <Card title="使用情况"
                      extra={
                          <CollectionsPage2 isShow={this.state.account === this.state.data.initiator && this.state.data.success} NewUse={this.NewUse}/>}
                      style={{ width:1200}}>
                    <Table dataSource={this.state.allUse}>
                        <Column title="使用说明" dataIndex="info" key="info" />
                        <Column title="使用金额(eth)" dataIndex="goal" key="goal" />
                        <Column title="同意请求数额(eth)" dataIndex="agreeAmount" key="agreeAmount" />
                        <Column title="不同意请求数额(eth)" dataIndex="disagree" key="disagree" />
                        <Column
                            title="当前状态"
                            dataIndex='over'
                            key='over'
                            render={(text, record) => (
                                record.over === false?
                                    <Tag icon={<SyncOutlined spin />} color="processing">
                                        正在等待通过
                                    </Tag>:
                                    record.agreeAmount >= (this.state.data.goal / 2)?
                                        <Tag icon={<CheckCircleOutlined />} color="success">
                                            批准使用
                                        </Tag>:
                                        <Tag icon={<CloseCircleOutlined />} color="error">
                                            拒绝请求
                                        </Tag>
                            )}
                        />
                        <Column
                            title="操作"
                            key="action"
                            render={(text, record) => (
                                (record.over === true || this.state.myAmount===0)?{}:
                                    record.agree==="0"?
                                        <div style={{alignItems:"center",display: "flex"}}>
                                            <span><Button type="primary" onClick={()=>this.clickAgreeUse(true,record.index)}>同意</Button>&nbsp;&nbsp;</span>
                                            <span><Button type="danger"  onClick={()=>this.clickAgreeUse(false,record.index)}>不同意</Button></span>
                                        </div>:
                                        record.agree==="1"? <Button type="primary" disabled>已同意</Button>:
                                            record.agree==="2"? <Button type="danger" disabled>已不同意</Button>:{}
                            )}
                        />
                    </Table>
                </Card>
            </Content>
        );
    }
}
export default withRouter(InfoPage);