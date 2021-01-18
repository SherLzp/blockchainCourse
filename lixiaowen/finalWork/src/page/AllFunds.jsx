import React from 'react';
import '../assets/pages.css'
import {Button, List, Table,Modal,InputNumber,Form} from 'antd'
import {Link} from 'react-router-dom'
import web3 from "../utils/web3";

import {getPronum,contribute, getProMes,approveuse, timestampToTime,getonecontribution,getonerequire,isVoted} from "../utils/GetMsg"
class AllFunds extends React.Component{
    constructor(props){
        super(props);
        this.state={
            allprojects:[],
            path:"",
            visible:false,
            itemid:-1,
            money:0
        }
    }

    async componentDidMount() {
        let pronum=await getPronum();
        var arr=[];
        var allpath=[];
        for(var i=0;i<pronum;i++){
            let message=await getProMes(i);
            let time=timestampToTime(Number(message.ddl)).substring(5,16);           
            var ele={
                no:i,
                name:message.title,
                money:message.goal,
                time:time,
                id:message.id,
                state:message.state,
                nowmoney:message.nowmoney,
            };
            arr.push(ele);
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
        this.setState({ visible: false });
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
                        <Button type="text" onClick={()=>this.showModal(text)}>
                            我要投资
                        </Button>
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
                <Table columns={columns} dataSource={this.state.allprojects} bordered/>
            </div>
        )
    }

}
export default AllFunds