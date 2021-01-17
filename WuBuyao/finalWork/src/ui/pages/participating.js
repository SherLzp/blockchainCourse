import React from 'react';
import { Layout, Breadcrumb, Typography, Table, Tag, Modal, Space } from 'antd';

const { Paragraph, Text } = Typography;
const { Header, Content, Footer } = Layout;

let crowdfundingIns = require("../../eth/crowdfunding")
let web3 = require('../../utils/InitWeb3')
class Participating extends React.Component {
    constructor() {
        super();
        this.state = {
            requests_info: [],
            columns: [],
            columns_in: [],
            visible: false,
            ind: -1,
        };
    }

    getRequest = async (id) => {
        var tmp_requests = [];
        console.log('get request');
        var num_request = await crowdfundingIns.methods.get_num_request(id).call();
        for (var i = 0; i < num_request; i++) {
            var r_info = await crowdfundingIns.methods.get_request(id, i, this.props.current_account).call();

            var request_info = new Object();
            request_info.index = i;
            request_info.purpose = r_info[0];
            request_info.amount = web3.utils.fromWei(r_info[1]) + ' ETH';
            request_info.status = r_info[2];
            request_info.reply_status = r_info[3];
            tmp_requests.push(request_info);
        }
        this.setState({ requests_info: tmp_requests });
    }

    reply = async (index, agree) => {
        console.log('reply');
        console.log(index);
        try {
            crowdfundingIns.methods.reply(this.state.ind, index, agree).send({
                from: this.props.current_account,
                gas: '3000000'
            });
            alert("Reply succeeded")
        } catch (e) {
            console.log(e);
            alert('Reply failed');
        }
        this.getRequest(this.state.ind);
    }

    showModal = (index) => {
        this.getRequest(index);

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
        this.props.createRequest(this.state.ind, values.purpose, values.amount);
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
                        //console.log(text);
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
                        //console.log(record.status);

                        if (record.status == 1) return (

                            <div>
                                <a onClick={() => this.showModal(record.index)}>查看资金请求</a>
                                <Modal
                                    title="Contribute"
                                    visible={this.state.visible}
                                    onCancel={this.handleCancel}
                                    footer={null}
                                    width="10000px"
                                    destroyOnClose="true" >
                                    <Table
                                        columns={this.state.columns_in}
                                        dataSource={this.state.requests_info}
                                    />
                                </Modal>
                            </div>
                        );

                        else if (record.status == 1) return (<></>);
                        else if (record.status == 2) return (<></>);

                    },
                },
            ],

            columns_in: [
                { title: '序号', dataIndex: 'index', key: 'index' },
                { title: '金额', dataIndex: 'amount', key: 'amount' },
                { title: '目的', dataIndex: 'purpose', key: 'purpose' },
                {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (text) => {
                        let color = 'geekblue';
                        var cont = "Processing";
                        if (text == 0) { cont = "Processing"; color = 'green'; }
                        else if (text == 1) { cont = "Success"; color = 'volcano'; }
                        else if (text == 2) { cont = "Failed"; color = 'gold'; }
                        return (
                            <Tag color={color} key={text}>
                                {cont}
                            </Tag>
                        );
                    },
                },
                {
                    title: '操作',
                    dataIndex: '',
                    key: 'x',
                    render: (text, record, index) => {
                        if (record.status == 0 && record.reply_status == 0) return (
                            <Space size="middle">
                                <a onClick={() => this.reply(index, true)}>接受</a>
                                <a onClick={() => this.reply(index, false)}>拒绝</a>
                            </Space>
                        ); else if (record.reply_status == 1) return (
                            <Space size="middle">
                                <a >已接受</a>
                            </Space>
                        ); else if (record.reply_status == 2) return (
                            <Space size="middle">
                                <a >已拒绝</a>
                            </Space>
                        )

                        else return (<></>);
                    }
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
                        <Breadcrumb.Item>我发起的众筹</Breadcrumb.Item>
                    </Breadcrumb>

                    <Table
                        columns={this.state.columns}
                        expandable={{
                            expandedRowRender: record => <div>
                                <Typography>
                                    <Paragraph>
                                        <Text strong>Title:</Text> {record.title}
                                    </Paragraph>
                                    <Paragraph>
                                        <Text strong>Your Contribution:</Text> {record.contribution}
                                    </Paragraph>
                                    <Paragraph>
                                        <Text strong>Description:</Text> {record.info}
                                    </Paragraph>
                                </Typography>
                            </div>
                        }}
                        dataSource={this.props.part_fundings_info}
                    />
                </Content>

                <Footer style={{ textAlign: 'center' }}>Crowdfunding-ETH ©2021 Created by chronoby</Footer>
            </Layout>
        )
    }
}

export default Participating;
