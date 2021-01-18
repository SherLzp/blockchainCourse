import React from 'react';
import creatHistory from "history/createBrowserHistory";
import {Button, Form, Input, InputNumber, Modal, Space,Table} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import './Topbarcss.css'
import {contribute, getProMes,approveuse, timestampToTime,getonecontribution,getonerequire,isVoted} from "../function/function";
import web3 from "../config/web3";
const history = creatHistory();
var value="";
var proid=0;
const columns=[
            {
                title:'序号',
                dataIndex:'id',
                key:'id',
                align:'center',
                render:text=>{
                    return Number(text)+1;
                }
            },
            {
                title:'目的',
                dataIndex:'requireaim',
                key:'requireaim',
                align:'center'
            },
            {
                title: '金额',
                dataIndex: 'requiremoney',
                key: 'requiremoney',
                align:'center'
            },
            {
                title:'状态',
                dataIndex:'requirestate',
                key:'requirestate',
                align:'center',
                render:text => {
                    if(text==='0')
                        return '正在等待批准';
                    else if(text==='2')
                        return '已经批准';
                    else
                        return '未被批准';
                }
            },
            {
                title:'我的选择',
                dataIndex:'id',
                key:'id',
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
                                        <Button onClick={()=>handle(text,true)}>支持</Button>
                                        <Button onClick={()=>handle(text,false)}>反对</Button>
                                    </Space>
                                );
                            else if(value[text].agree==='1')
                                return '支持';
                            else
                                return '反对'
                        }
                        else{
                            console.log(value);
                            if(value[text].agree==='0')
                                return '未投票';
                            else if(value[text].agree==='1')
                                return '支持';
                            else if(value[text].agree==='2')
                                return '反对';
                        }
                    }
                }
            }

        ];

let handle=async (index,agree)=>{
    try{
        await approveuse(proid,index,agree);
        alert('选择成功！');
    }catch(error){
        console.log(error);
    }
}

class pagedetails extends React.Component{


    constructor(props) {
        super(props);
        this.state={
            id:this.props.match.params.id,
            time:"",
            message:"",
            complete:"",
            visible:false,
            money:"",
            mymoney:"",
            requirelist:"",
        }
        proid=Number(this.state.id)
    }

    goBackPage = () => {
      history.goBack();  //返回上一页这段代码
    };

    async componentDidMount() {
        let message=await getProMes(Number(this.state.id));
        console.log(message);
        let time=timestampToTime(Number(message.ddl)).substring(5,16);
        let complete=timestampToTime(Number(message.completetime)).substring(5,16);
        let accounts=await web3.eth.getAccounts();
        let account=accounts[0];
        let money=await getonecontribution(Number(this.state.id),account);
        let requirelist=[];
        let requirenum=message.requirenum;
        var ele;
        for(var i=0;i<requirenum;i++){
            let require=await getonerequire(Number(this.state.id),i);
            let agree=await isVoted(Number(this.state.id),account,i);
            ele={
                id:i,
                requiremoney:require.requiremoney,
                requireaim:require.requireaim,
                requirestate:require.requirestate,
                agree:agree,
            };
            requirelist.push(ele);
        }
        value=requirelist;
        console.log(requirelist);
        this.setState({
            time:time,
            message:message,
            complete:complete,
            address:account,
            mymoney:money,
            requirelist:requirelist
        });
    }

    getTitle=()=>{
        if(this.state.message==="")
            return "";
        else
            return this.state.message.title;
    };

     getDes=()=>{
        if(this.state.message==="")
            return "";
        else
            return this.state.message.description;
    };

     getgoal=()=>{
        if(this.state.message==="")
            return "";
        else
            return this.state.message.goal;
    };

     getnow=()=>{
        if(this.state.message==="")
            return "";
        else
            return this.state.message.nowmoney;
     };

     getddl=()=>{
         if(this.state.time==="")
            return "";
        else
            return this.state.time;
     }

     getcomplete=()=>{
         if(this.state.complete==="")
            return "";
        else
            return this.state.complete;
     }


     showModal=()=>{
         this.setState({
            visible: true,
        });
     }

     handleOk = async () => {
         if(this.state.money===null||this.state.money===0)
             alert("请输入有效金额！");
         let accounts=await web3.eth.getAccounts();
         let account=accounts[0];
         if(this.state.message.creator===account)
             alert("无法给自己的项目进行投资！")
         else{
             if(Number(this.state.money)%1!==0)
                 alert("众筹金额必须为正整数！");
             else{
                 try{
                      await contribute(Number(this.state.id),Number(this.state.money));
                      alert('支持成功！感谢您！');
                      let message=await getProMes(Number(this.state.id));
                      let accounts=await web3.eth.getAccounts();
                      let account=accounts[0];
                      let money=await getonecontribution(Number(this.state.id),account);
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
    };

     handleCancel = () => {
        this.setState({ visible: false });
    };

     getmy=()=>{
         if(this.state.mymoney.toString()==="")
             return "";
         else{
             return this.state.mymoney.toString();
         }
     }

     getdata=(requirelist)=>{
         if(requirelist==='')
             return [];
         else{
             return requirelist;
         }
     }

     gettable=()=>{
         if(this.state.mymoney.toString()==="")
             return "";
         else{
             let mymon=Number(this.getmy());
             if(mymon===0)
                 return "";
             else
                 return (
                     <div>
                         <div className='center'><h2>众筹金额使用申请表</h2></div>
                         <div>
                            <Table columns={columns} dataSource={this.getdata(this.state.requirelist)}/>
                         </div>
                     </div>
                 )
         }
     }

     returnafter=()=>{
         if(this.state.message==="")
             return "";
         else if(this.state.message.state==="0"){
             return(
                 <div>
                     <div className='money'>
                         <span className='greybox'>{'目标金额：' + this.getgoal()+'wei'}</span>
                         <span className='greybox'>{'已筹总额：' + this.getnow()+'wei'}</span>
                         <span className='greybox'>{'我的支持金额：' + this.getmy()+'wei'}</span>
                         <span className='greybox'>{'截至日期：' + this.getddl()}</span>
                     </div>
                     <div class='center'><Button type='primary' size='large' onClick={this.showModal}>支持该项目</Button></div>
                 </div>
             )
         }
         else if(this.state.message.state==="1"){
             return(
                 <div className='money'>
                     <span className='greybox'>{'目标金额：' + this.getgoal()+'wei'}</span>
                     <span className='greybox'>众筹失败，再去看看其他项目吧！</span>
                     <span className='greybox'>{'截至日期：' + this.getcomplete()}</span>
                 </div>
             )
         }
         else if(this.state.message.state==="2"){
             return(
                 <div>
                     <div className='money'>
                         <span className='greybox'>{'目标金额：' + this.getgoal()+'wei'}</span>
                         <span className='greybox'>{'众筹成功,目前剩余众筹金额为：'+this.getnow()+'wei'}</span>
                         <span className='greybox'>{'我的支持金额：' + this.getmy()+'wei'}</span>
                         <span className='greybox'>{'截至日期：' + this.getcomplete()}</span>
                     </div>
                     {this.gettable()}
                 </div>
             )
         }
     };

    render() {

        return (
            <div>
                <div class="lay">
                     <Button size="large" icon={<ArrowLeftOutlined />} onClick={this.goBackPage}>返回</Button>
                </div>
                <div class="lay">
                    <h1>{'项目概述：'+this.getTitle()}</h1>
                </div>
                <div className="lay">
                    <h1>{'项目介绍：' + this.getDes()}</h1>
                    {this.returnafter()}
                </div>
                <Modal
                    visible={this.state.visible}
                        title="支持该项目"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary"  htmlType="submit" onClick={this.handleOk}>
                            确定
                        </Button>,
                        ]}>
                        <Form>
                            <Form.Item name="支持金额" label="支持金额(单位:wei)" rules={[{ required: true}]}>
                                <InputNumber min={1}   onChange={value=>{
                                    this.setState({
                                        money:value,
                                    });
                                }}/>
                            </Form.Item>
                        </Form>
                    </Modal>
            </div>
        );
    }
}
export default pagedetails;
