import React from 'react';
import { Layout, Breadcrumb, Typography, Table, Tag, Modal, Form, Button, Input, Col, Row } from 'antd';

const { Header, Content, Footer } = Layout;

class All extends React.Component {
    constructor() {
        super();
        this.state = {
            columns: [],
            visible: false,
            ind: -1,
        };
    }

    showModal = (index) => {
        this.setState({
            visible: true,
            ind: index,
        });
        
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            index: -1,
        });
    }

    onFinish = (values) => {
        this.props.Participate(this.state.ind, values.amount);
        this.setState({ visible: false });
    };

    componentDidMount() {
        this.props.refresh_account();
        this.setState({
            columns: [
                {
                    title: 'ID',
                    dataIndex: 'index',
                    key: 'index',
                    render: (text, record, index) => {
                        const url = '/project/' + (record.index);
                        return (
                            <a href={url}>{text}</a>
                        );
                    }
                },
                { title: '发起人', dataIndex: 'address', key: 'address' },
                { title: '金额', dataIndex: 'amount', key: 'amount' },
                { title: '已筹集金额', dataIndex: 'amount_get', key: 'amount_get' },
                { title: '开始时间', dataIndex: 'start_time', key: 'start_time' },
                { title: '结束时间', dataIndex: 'end_time', key: 'end_time' },
                {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (text, record) => {
                        let color = 'geekblue';
                        var content = "Processing"
                        if (text == 0) { content = "Processing"; color = 'green'; }
                        else if (text == 2) { content = "Failed"; color = 'volcano'; }
                        else if (text == 1) { content = "Success"; color = 'gold'; }
                        return (
                            <Tag color={color} key={text}>
                                {content}
                            </Tag>
                        );
                    },
                },
                {
                    title: '操作',
                    dataIndex: '',
                    key: 'x',
                    render: (text, record, index) => {
                        if (this.props.current_account != record.address) {
                            // console.log(record.address);
                            // console.log(this.props.current_account);

                            if (record.status == 0 && record.address != this.props.current_account) return (
                                <div>
                                    <a onClick={() => this.showModal(index)}>Contribute</a>
                                    <Modal
                                        title="Contribute"
                                        visible={this.state.visible}
                                        onCancel={this.handleCancel}
                                        footer={null}
                                        width="400px"
                                        destroyOnClose="true" >
                                        <Form name="nest-messages" onFinish={this.onFinish} preserve={false}>
                                            <Form.Item name={['amount']} label="Amount" rules={[]}>
                                                <Input suffix="ETH" />
                                            </Form.Item>
                                            <Form.Item wrapperCol={{ span: 0, offset: 5 }}>
                                                <Row>
                                                    <Col span={12}>
                                                        <Button onClick={this.handleCancel}>
                                                            Cancel
                                                        </Button>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Button type="primary" htmlType="submit">
                                                            Submit
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Form.Item>
                                        </Form>
                                    </Modal>
                                </div>
                            );
                            else if (record.status == 1) return (<></>);
                            else if (record.status == 2) return (<></>);
                        }
                    },
                },
            ],
        });
    }

    render() {
        return (
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }} />
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>首页</Breadcrumb.Item>
                        <Breadcrumb.Item>所有众筹</Breadcrumb.Item>
                    </Breadcrumb>

                    <Table
                        columns={this.state.columns}
                        dataSource={this.props.fundings_info}
                    />
                </Content>

                <Footer style={{ textAlign: 'center' }}>Crowdfunding-ETH ©2021 Created by chronoby</Footer>
            </Layout>
        )
    }
}

export default All;
