import {Table, Tag, Space, Card, message, Button} from 'antd';
import React from "react";
import {Content} from "antd/es/layout/layout";
import {getAllFundings, addListener, getAccount, newFunding} from "../../contracts/contract";
import CollectionsPage from "../tools/CollectionsPage/CollectionsPage";
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


class FundPage extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            loading:true,
            account:null,
            data:[],
            values:[]
        }
    }
    fetchData = async() => {
        this.setState({
            loading : true
        })
        try {
            let data = await getAllFundings();
            let account = await getAccount();
            this.setState({
                data:data,
                account:account,
                loading:false
            })
            console.log(typeof (data));
        } catch (e) {
            console.log(e);
            message.error('获取众筹失败!');
        }
    }

    ChangeState= async(values) => {
        this.setState({
            values:values
        })
        const seconds = Math.ceil(new Date(this.state.values.date).getTime() / 1000);
        if(this.state.values.date <= new Date()){
            message.error('众筹截止时间设置有误！')
        }
        else{
            try {
                const res = await newFunding(this.state.values.account, this.state.values.title, this.state.values.description, this.state.values.amount, seconds);
                console.log(res)
                message.success('发起众筹成功')
                await this.fetchData();
            } catch(e) {
                console.log(e);
                message.error('发起众筹失败')
            }
        }
    }

    async  componentWillMount() {
        await this.fetchData();
        addListener(this.fetchData);
        console.log(this.state.data);
        console.log(this.state.account);
    }


    render(){
        return (
            <Content lassName="site-layout-background" style={{padding: 24, margin: 0, minHeight: 460, background: '#fff'}}>
                <Card title="所有众筹"
                      extra={<CollectionsPage account={this.state.account} ChangeState={this.ChangeState}/>}
                      style={{ width:1150}}>
                    <Table columns={columns} dataSource={this.state.data} />
                </Card>
            </Content>

        );
    }
}
export default FundPage;