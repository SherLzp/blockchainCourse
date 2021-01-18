import {Table, Tag, Space, Card, Button, message} from 'antd';
import React from "react";
import {Content} from "antd/es/layout/layout";
import {getAllFundings, addListener, getMyFundings} from "../../contracts/contract";
import {CheckCircleOutlined, CloseCircleOutlined, SyncOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

const columns = [
    {
        title: '众筹标题',
        dataIndex: 'title',
        key: 'title',
        render: text => <a>{text}</a>,
    },
    {
        title: '目标金额(eth)',
        dataIndex: 'goal',
        key: 'goal',
    },
    {
        title: '目前金额(eth)',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: '我投资的金额',
        dataIndex: 'myAmount',
        key: 'amount'
    },
    {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        render: text => (
            new Date(text* 1000).toLocaleString()
        ),
    },
    {
        title: '当前状态',
        key:  'success',
        dataIndex:  'success',
        render: (text,record) => (
            text?
                <Tag icon={<CheckCircleOutlined />} color="success">
                    众筹成功
                </Tag>:
                new Date(record.endTime * 1000) > new Date()?
                    <Tag icon={<SyncOutlined spin />} color="processing">
                        正在众筹
                    </Tag>:
                    <Tag icon={<CloseCircleOutlined />} color="error">
                        众筹失败
                    </Tag>
        ),
    },
    {
        title: '详情',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <Link to={"/fund/"+JSON.stringify(record.index)} >查看详情</Link>
            </Space>
        ),
    },
];


class MyFundPage extends React.Component {
    constructor() {
        super();
        this.state={
            loading:true,
            init:[],
            contr:[]
        }

    }

    fetchData = async() => {
        this.setState({
            loading : true
        })
        try {
            let res = await getMyFundings()
            console.log(res);
            this.setState({
                init: res.init,
                contr: res.contr,
                loading:false
            })
        } catch (e) {
            console.log(e);
            message.error('获取众筹失败!');
        }
    }

    async  componentWillMount() {
        await this.fetchData();
        addListener(this.fetchData);
    }


    render(){
        return (
            <Content lassName="site-layout-background" style={{padding: 24, margin: 0, minHeight: 460, background: '#fff'}}>
                <Card title="我发起的"

                      style={{ width:1150}}>
                    <Table columns={columns} dataSource={this.state.init} />
                </Card>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <Card title="我投资的"
                      style={{ width:1150}}>
                    <Table columns={columns} dataSource={this.state.contr} />
                </Card>
            </Content>

        );
    }
}
export default MyFundPage;