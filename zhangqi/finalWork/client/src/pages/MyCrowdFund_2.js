import React, { Component } from "react";
import {Button, Card, Layout, List, Drawer, InputNumber, Tag, Form, Divider, Col, Row, Statistic, Progress, Modal, Collapse, Radio} from "antd";

import {
    contribute,
    getAllApply,
    approveApply,
    getMyFunds,
} from "../contracts/crowdfund"

import {CheckCircleOutlined, SyncOutlined, CaretRightOutlined} from "@ant-design/icons";
import "../App.css"

const {Content} = Layout;
const { Panel } = Collapse;

const DescriptionItem = ({ title, content }) => (
    <div className="site-description-item-profile-wrapper">
        <p className="site-description-item-profile-p-label">{title}:</p>
        {content}
    </div>
);

class MyTag extends Component {
    render() {
        if (!this.props.current) return(<Tag icon={<SyncOutlined spin />} color="processing">募集中</Tag>);
        else return(<Tag icon={<CheckCircleOutlined />} color="success">募集完成</Tag>);
    }
}

class Detail extends Component {
    render() {
        if (!this.props.item.isFinished) return (
            <>
                <Row gutter={30}>
                    <Col span={12}>
                        <Statistic title="目标资金(ETH)" value={this.props.item.goal} />
                    </Col>
                    <Col span={12}>
                        <Statistic title="已募集资金(ETH)" value={this.props.item.amount} />
                    </Col>
                </Row>
                <Divider/>
                <Progress type="circle" percent={(this.props.item.amount * 100 / this.props.item.goal).toFixed((2))} />
            </>
        )
        else return (
            <>
                <Row gutter={30}>
                    <Col span={12}>
                        <Statistic title="初始资金(ETH)" value={this.props.item.goal} />
                    </Col>
                    <Col span={12}>
                        <Statistic title="剩余资金(ETH)" value={this.props.item.amount} />
                    </Col>
                </Row>
                <Divider/>
                <Progress
                    type="circle"
                    strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                    }}
                    percent={(this.props.item.amount * 100 / this.props.item.goal).toFixed((2))}
                />
            </>
        )
    }
}

class MyCrowdFund_2 extends Component {
    constructor() {
        super();
        this.state = {
            dataSource: [],
            visible: false
        }
        this.fetchData()
        this.showDrawer = this.showDrawer.bind(this);
    }

    async fetchData() {
        let tmp = await getMyFunds()
        let tmp2 = tmp.contr
        for(let tmp3 in tmp2) {
            let index = tmp2[tmp3].index
            let AllApply = await getAllApply(index)
            let app = "app"
            tmp2[tmp3][app] = AllApply
        }
        console.log(tmp2)
        this.setState({dataSource: tmp2})
    }

    showDrawer = (e, item) => {
        console.log(item.index)
        this.setState({
            visible: item.index,
        });
    };

    onClose = () => {
        this.setState({
            visible: -1,
        });
    };

    showChildrenDrawer = (e, item) => {
        this.setState({
            childrenDrawer: item.index,
        });
    };

    onChildrenDrawerClose = () => {
        this.setState({
            childrenDrawer: -1
        });
    };

    onSubmit = async (values) => {
        console.log(values)
        await contribute(values.index, values.amount)
        Modal.success({
            content: '投资成功！',
        });
    };

    agree = async (values) => {
        let res
        if (values.opinion === "1") {
            res = approveApply(values.index, values.subIndex, true)
        }
        else {
            res = approveApply(values.index, values.subIndex, false)
        }
        console.log(res)
        Modal.success({
            content: '批准成功！',
        });
    }

    timestampToTimeFormat(timestamp, format = 'Y-M-D h:m') {
        let time = parseInt(timestamp)
        let date = new Date(time);
        let obj = {
            Y: date.getFullYear(),
            M: (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
            D: (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()),
            h: (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()),
            m: (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()),
            s: (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
        }
        let newItem = format.split("").map(item => {
            for (let key in obj) {
                if (item === key) {
                    item = obj[key]
                }
            }
            return item;
        })
        return newItem.join("");
    }

    render () {
        return(
            <Content style={{height: '100%'}}>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 3,
                    }}
                    dataSource={this.state.dataSource}
                    renderItem={item => (
                        <List.Item>
                            <Card
                                title={"众筹名称：" + item.title}
                                extra={
                                    <>
                                        <MyTag current={item.isFinished}/>
                                        <Button size="small" onClick={e => this.showDrawer(e, item)}>详情</Button>
                                    </>
                                }
                            >
                                <p>{"众筹发起人：" + item.initiator}</p>
                                <Collapse
                                    bordered={true}
                                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                    className="site-collapse-custom-collapse"
                                >
                                    <Panel header="使用申请" key="1" className="site-collapse-custom-panel">
                                        <List
                                            itemLayout="vertical"
                                            size="large"
                                            dataSource={item.app}
                                            renderItem={subItem => (
                                                <List.Item
                                                    hidden={subItem.over || subItem.approve !== "0"}
                                                >
                                                    <DescriptionItem title="申请理由" content={subItem.detail}/>
                                                    <DescriptionItem title="申请金额" content={subItem.goal + "ETH"}/>
                                                    <Form
                                                        onFinish={this.agree}
                                                    >
                                                        <Form.Item
                                                            name="index"
                                                            label="众筹编号"
                                                            hidden={true}
                                                            initialValue={item.index}
                                                        >
                                                            <InputNumber/>
                                                        </Form.Item>
                                                        <Form.Item
                                                            name="subIndex"
                                                            label="申请编号"
                                                            hidden={true}
                                                            initialValue={subItem.index}
                                                        >
                                                            <InputNumber/>
                                                        </Form.Item>
                                                        <Form.Item
                                                            name="opinion"
                                                            rules={[{ required: true, message: '请选择是否同意！' }]}
                                                        >
                                                            <Radio.Group buttonStyle="solid">
                                                                <Radio.Button value="1">同意</Radio.Button>
                                                                <Radio.Button value="2">不同意</Radio.Button>
                                                            </Radio.Group>
                                                        </Form.Item>
                                                        <Form.Item>
                                                            <div style={{ display: "flex" }}>
                                                                <Button
                                                                    type="primary"
                                                                    htmlType="submit"
                                                                    style={{ marginLeft: "auto" }}
                                                                >
                                                                    提交
                                                                </Button>
                                                            </div>
                                                        </Form.Item>
                                                    </Form>
                                                </List.Item>
                                            )}
                                        >
                                        </List>
                                    </Panel>
                                </Collapse>
                            </Card>
                            <Drawer
                                title={item.title}
                                width={640}
                                closable={false}
                                onClose={this.onClose}
                                visible={this.state.visible === item.index}
                            >
                                <DescriptionItem title="发起人" content={item.initiator} />
                                <DescriptionItem title="项目介绍" content={item.detail} />
                                <DescriptionItem title="截止时间" content={this.timestampToTimeFormat(item.endTime * 1000, 'Y/M/D h:m:s')} />
                                <Divider/>
                                <Detail item={item}/>
                                <Divider/>
                                <Button
                                    type="primary"
                                    onClick={e => this.showChildrenDrawer(e, item)}
                                    disabled={item.isFinished}
                                >
                                    我要投资
                                </Button>
                                <Divider/>
                                <Drawer
                                    title="投资"
                                    width={320}
                                    closable={false}
                                    onClose={this.onChildrenDrawerClose}
                                    visible={this.state.childrenDrawer === item.index}
                                >
                                    <Form
                                        hideRequiredMark
                                        onFinish={this.onSubmit}
                                    >
                                        <Form.Item
                                            name="index"
                                            label="众筹编号"
                                            hidden={true}
                                            initialValue={item.index}
                                        >
                                            <InputNumber/>
                                        </Form.Item>
                                        <Form.Item
                                            name="amount"
                                            label="投资金额"
                                            rules={[{ required: true, message: '请输入投资金额！' }]}
                                        >
                                            <InputNumber min={1} max={item.goal-item.amount} />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">
                                                提交
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Drawer>
                            </Drawer>
                        </List.Item>
                    )}
                />
            </Content>
        )
    }
}

export default MyCrowdFund_2