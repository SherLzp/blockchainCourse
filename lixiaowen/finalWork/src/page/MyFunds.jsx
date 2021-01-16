import React from 'react';
import '../assets/pages.css'
import {Button, List, Table,Modal,InputNumber,Form} from 'antd'
import {Link} from 'react-router-dom'
import web3 from "../utils/web3";

import {getPronum,needMoney,contribute, getProMes,approveuse, timestampToTime,getonecontribution,getonerequire,isVoted} from "../utils/GetMsg"
class MyFunds extends React.Component{
    constructor(props){
        super(props);
        this.state={
            allprojects:[],
            path:"",
            visible:false,
            visible:false,
            itemid:-1,
            money:0
        }
    }

    async componentDidMount() {
        let accounts=await web3.eth.getAccounts();
        let account=accounts[0];
        let pronum=await getPronum();
        var arr=[];
        var allpath=[];
        var count = 0;
        for(var i=0;i<pronum;i++){
            let message=await getProMes(i);
            let time=timestampToTime(Number(message.ddl)).substring(5,16);           
            var ele={
                no:count,
                name:message.title,
                money:message.goal,
                time:time,
                id:i,
                state:message.state,
                nowmoney:message.nowmoney,
            };
            if(message.creator===account){
                arr.push(ele);
                count=count+1
            }
                
        }
        this.setState({
            allprojects:arr,
        })
    }

    showModal=(num)=>{
        console.log(num)
        this.setState(
            {
                visible:true,
                itemid:num
            }
        )
        console.log(this.state.itemid)
        console.log(this.state.visible)
    }

    handleOk=async()=>{
        let message=await getProMes(Number(this.state.itemid));

        if(this.state.money===null||this.state.money===0)
            alert("请输入有效金额！");
        let accounts=await web3.eth.getAccounts();
        let account=accounts[0];
        if(message.creator===account)
            alert("无法给自己的项目进行投资！")
        else{
            if(Number(this.state.money)%1!==0)
                alert("众筹金额必须为正整数！");
            else{
                try{
                 await contribute(Number(this.state.itemid),Number(this.state.money));
                 alert('支持成功！感谢您！');
                 let message=await getProMes(Number(this.state.itemid));
                 let accounts=await web3.eth.getAccounts();
                 let account=accounts[0];
                 let money=await getonecontribution(Number(this.state.itemid),account);
                 this.setState({
                       message:message,
                       mymoney:money
                   })
                }catch(error){
                     console.log(error);
                }
            }
        }
        this.setState({ visible: false });
    }

    handleCancel=()=>{
        this.setState({ visible: false,visible2:false });
    }

    showModal2=(num)=>{
        
        this.setState({
           visible2: true,
           itemid:num
       });
    }
    handleOk2=async()=>{
        let message=await getProMes(this.state.itemid);
        console.log(message.nowmoney)
    if(Number(this.state.money)%1!==0)
        alert("金额必须为正整数！");
    else if(Number(this.state.money)>message.nowmoney)
        alert("申请金额不能超过项目剩余资金！");
    else {
        try {
            await needMoney(Number(this.state.itemid), "", Number(this.state.money));
            alert('申请成功!');
        }catch(error){
             console.log(error);
        }
    }
    this.setState({ visible2: false });
    }

    

    render(){
        const columns=[
            {
                title:'项目名称',
                dataIndex:'name',
                key:'name',
                align:'center'
            },
            {
                title:'目标金额',
                dataIndex:'money',
                key:'money',
                align:'center'
            },
            {
                title:"截至时间",
                dataIndex:'time',
                key:'time',
                align:'center'
            },
            {
                title:"目前金额",
                dataIndex:'nowmoney',
                key:'nowmoney',
                align:'center'
            },
            {
                title:'投资',
                dataIndex:'no',
                key:'no',
                align:'center',
                render:text=>{
                    if(this.state.allprojects[text].state==0){
                        return (
                        <p>项目进行中</p>
                        );
                    }
                    else if(this.state.allprojects[text].state==1){
                        return (<p>项目失败</p>)
                    }
                    else{
                        return (<p>项目成功</p>)
                    }
                }
            },
            {
                title:'申请用钱',
                dataIndex:'no',
                key:'no',
                align:'center',
                render:text=>{
                    if(this.state.allprojects[text].state==0){
                        return (
                        <p>申请用钱</p>
                        );
                    }
                    else if(this.state.allprojects[text].state==1){
                        return (<p>申请用钱</p>)
                    }
                    else{
                        return <Button tyepe='primary' size='large' onClick={()=>this.showModal2(this.state.allprojects[text].id)}>申请使用</Button>
                    }
                }
            },
        ]

        return(
            <div class='fundslist'>
                <Modal
                    visible={this.state.visible}
                    title="投资"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" size='large' onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" size='large' htmlType="submit" onClick={this.handleOk}>
                            确定
                        </Button>,
                    ]}>
                        <Form>
                            <Form.Item name="投资金额" label="投资金额(wei)"rules={[{ required: true}]}>
                            <InputNumber min={1}   onChange={value=>{
                                    this.setState({
                                        money:value,
                                    });
                                }}/>
                            </Form.Item>
                        </Form>
                </Modal>
                <Modal
                    visible={this.state.visible2}
                    title="投资"
                    onOk={this.handleOk2}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" size='large' onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" size='large' htmlType="submit" onClick={this.handleOk2}>
                            确定
                        </Button>,
                    ]}>
                        <Form>
                            <Form.Item name="申请金额" label="申请金额(wei)"rules={[{ required: true}]}>
                            <InputNumber min={1}   onChange={value=>{
                                    this.setState({
                                        money:value,
                                    });
                                }}/>
                            </Form.Item>
                        </Form>
                </Modal>
                <Table columns={columns} dataSource={this.state.allprojects} bordered/>
            </div>
        )
    }
}
export default MyFunds