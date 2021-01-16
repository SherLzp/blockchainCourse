import React from 'react';
import '../assets/pages.css'
import {Button, List, Table,Modal,InputNumber,Form,Space} from 'antd'
import {Link} from 'react-router-dom'
import web3 from "../utils/web3";
import {getPronum,contribute, getProMes,approveuse,isMySupport, timestampToTime,getonecontribution,getonerequire,isVoted} from "../utils/GetMsg"
var value="";

class MyContributions extends React.Component{
    constructor(props){
        super(props);
        this.state={
            allprojects:[],
            path:"",
            visible:false,
            visible2:false,
            itemid:-1,
            money:0,
            requirelist:[]
        }
    }

    async componentDidMount() {
        let pronum=await getPronum();
        var arr=[];
        var allpath=[];
        var count=0;
        var counts=0;
        let accounts=await web3.eth.getAccounts();
        let account=accounts[0];
        let requirelist=[];
        for(var i=0;i<pronum;i++){
            let ismy=await isMySupport(i);
            if(ismy==true){
                let message=await getProMes(i);
                let requirenum=message.requirenum;
                let mmymoney=await getonecontribution(Number(i),account);
                let time=timestampToTime(Number(message.ddl)).substring(5,16);           
                var ele={
                    no:count,
                    name:message.title,
                    money:message.goal,
                    time:time,
                    id:message.id,
                    state:message.state,
                    nowmoney:message.nowmoney,
                    mymoney:mmymoney
                };
                arr.push(ele);
                count=count+1;
                for(var j=0;j<requirenum;j++){
                    let require=await getonerequire(Number(i),j);
                    let agree=await isVoted(Number(i),account,j);
                    var el={
                        id:j,
                        proid:i,
                        count:counts,
                        name:message.title,
                        requiremoney:require.requiremoney,
                        requirestate:require.requirestate,
                        agree:agree,
                    };
                    requirelist.push(el);
                    counts=counts+1
                }
            }
        }
        value=requirelist
        this.setState({
            allprojects:arr,
            requirelist:requirelist
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
        this.setState({ visible: false, visible2:false });
    }
    showModal2=(num)=>{
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

    handle=async (proid,index,agree)=>{
        try{
            await approveuse(proid,index,agree);
            alert('选择成功！');
        }catch(error){
            console.log(error);
        }
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
                title:"我投资的金额",
                dataIndex:'mymoney',
                key:'mymoney',
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
        const columns2=[
            {
                title:'项目名称',
                dataIndex:'name',
                key:'name',
                align:'center'
            },
            {
                title:'申请金额',
                dataIndex:'requiremoney',
                key:'requiremoney',
                align:'center'
            },
            {
                title:'操作',
                dataIndex:'count',
                key:'requiremoney',
                align:'center',
                render:text=>{
                    if(value==='')
                    return '';
                else{
                    console.log(value);
                    if(value[text].requirestate==='0'){
                        if(value[text].agree==='0')
                            return(
                                <Space direction='horizontal'>
                                    <Button onClick={()=>this.handle(value[text].proid,value[text].id,true)}>支持</Button>
                                    <Button onClick={()=>this.handle(value[text].proid,value[text].id,false)}>反对</Button>
                                </Space>
                            );
                        else if(value[text].agree==='1')
                            return '已支持';
                        else
                            return '已反对'
                    }
                    else{
                        console.log(value);
                        if(value[text].agree==='0')
                            return '未投票';
                        else if(value[text].agree==='1')
                            return '已支持';
                        else if(value[text].agree==='2')
                            return '已反对';
                    }
                }
                }
            }
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
                
                <h1>全部项目</h1>
                <Table columns={columns} dataSource={this.state.allprojects} bordered/>
                <Table columns={columns2} dataSource={this.state.requirelist} bordered/>

            </div>
        )
    }

}
export default MyContributions