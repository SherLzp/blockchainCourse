import React, { Component } from 'react';
import { Table, Tag, Space } from 'antd';

let crowdfundingIns = require("../../eth/crowdfunding")

class DrawTable extends Component {
    constructor() {
        super();
        this.state = {
            columns: [],
        };
    }

    componentDidMount() {
        this.setState({
            columns: [
                { title: 'ID', dataIndex: 'index', key: 'index' },
                { title: '目的', dataIndex: 'purpose', key: 'purpose' },
                { title: '金额', dataIndex: 'amount', key: 'amount' },
                // { title: '发起人', dataIndex: 'address', key: 'address' },
                // { title: 'Approval', dataIndex: 'approval', key: 'approval' },
                // { title: 'Disapproval', dataIndex: 'disapproval', key: 'disapproval'},
                // { title: 'Start Time', dataIndex: 'usageStartTime', key: 'usageStartTime' },
                // { title: 'End Time', dataIndex: 'usageEndTime', key: 'usageEndTime' },
                {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (text, status) => {
                        let color = 'geekblue';
                        if (status == 0) { text = "Processing"; color = 'green'; }
                        else if (status == 2) { text = "Failed"; color = 'volcano'; }
                        else if (status == 1) { text = "Success"; color = 'gold'; }
                        return (
                            <Tag color={color} key={text}>
                                {text}
                            </Tag>
                        );
                    },
                },
                {
                    title: '操作',
                    dataIndex: '',
                    key: 'x',
                    render: (text, record, index) => {
                        var part_in = crowdfundingIns.methods.check_part(index, this.state.current_account).call();
                        if (part_in == false) return (<></>);
                        else {
                            if (record.status === 0 && record.voted === false) return (
                                <Space size="middle">
                                    <a onClick={() => this.props.reply(index, true)}>同意</a>
                                    <a onClick={() => this.props.reply(index, false)}>不同意</a>
                                </Space>
                            );
                            else return (<></>);
                        }
                    },
                },
            ],
        });
    }

    render() {
        return (
            <Table
                columns={this.state.columns}
                expandable={{
                    expandedRowRender: record => <div>
                        <p style={{ marginLeft: 30 }}>Index: {record.index}</p>
                        <p style={{ marginLeft: 30 }}>Status: {record.status}</p>
                        <p style={{ marginLeft: 30 }}>Request Amount: {record.amount}</p>
                        {/* <p style={{ marginLeft: 30 }}>Approval Rate: {record.approval}</p>
                        <p style={{ marginLeft: 30 }}>Disapproval Rate: {record.disapproval}</p>
                        <p style={{ marginLeft: 30 }}>Request Start Time: {record.usageStartTime}</p>
                        <p style={{ marginLeft: 30 }}>Request End Time: {record.usageEndTime}</p> */}
                        <p style={{ marginLeft: 30 }}>Purpose: {record.purpose}</p>
                    </div>
                }}
                dataSource={this.props.requests_info}
            />
        )
    }
};

export default DrawTable;