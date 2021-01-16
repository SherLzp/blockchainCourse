import { render } from '@testing-library/react'
import React from 'react'
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import TopMenu from './page/TopMenu'
import {Avatar, Collapse, List, Space ,Modal, Button,Form ,Input,InputNumber} from "antd";
import AllFunds from './page/AllFunds'
import MyFunds from './page/MyFunds'
import MyContributions from './page/MyContributions'
import './assets/App.css'
import {getPronum, openPro} from './utils/GetMsg'
import { Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component{
    constructor(props){
        super(props)
        this.state={
            visible1:false,
            visible2:false,
            name:"",
            description:"",
            days:1,
            money:0,
            collapsed:false
        }
    }


    showModal1=()=>{
        this.setState(
            {visible1:true,}
        );
    }
    handleOk1=async()=>{
        if(this.state.title===""||this.state.description===""||this.state.day===null||this.state.money===null||this.state.money===0)
            alert("信息不完整！");
        else{
            console.log(this.state.day)
            if(Number(this.state.money)%1!==0)
                alert("众筹金额必须为正整数！");
            else if(Number(this.state.days)%1!==0)
                alert("众筹时间必须为正整数！");
            else{
                try{
                 await openPro(this.state.title,this.state.description,Number(this.state.money),Number(this.state.days));
                 let balance=await getPronum();
                 console.log(balance);
                 alert('发布成功！');
                }catch(error){
                     console.log(error);
                }
            }
        }
        this.setState({ visible: false });
    }
    handleCancel1 = () => {
        this.setState({ visible1: false });
    };
    
    GetName=(e)=>{
        this.setState({
            title:e.target.value,
        })
    };
    GetDescription=(e)=>{
        this.setState({
            description:e.target.value,
        })
    };
    GetDays=(e)=>{
        this.setState({
            days:e.target.value,
        })
    };
    GetMoney=(e)=>{
        this.setState({
            money:e.target.value,
        })
    };
    
    toggle = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
      };

    render(){
        return (
            <Layout>
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={broken => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
    >
      <div className="logo" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
        <Menu.Item key="1" icon={<UserOutlined />}>
          <a href='/'> 全部项目</a>
        </Menu.Item>
        <Menu.Item key="2" icon={<VideoCameraOutlined />}>
         <a href='/myProjects'>我的项目</a>
        </Menu.Item>
        <Menu.Item key="3" icon={<UploadOutlined />}>
         <a href='/myContributions'>我的投资</a>
        </Menu.Item>
      </Menu>
    </Sider>
    <Modal
                        visible={this.state.visible1}
                        title="发起众筹"
                        onOk={this.handleOk1}
                        onCancel={this.handleCancel1}
                        footer={[
                        <Button key="back" onClick={this.handleCancel1}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary"  htmlType="submit" onClick={this.handleOk1}>
                            发布
                        </Button>,
                        ]}>
                        <Form>
                            <Form.Item name="项目名称" label="项目名称" rules={[{ required: true}]}>
                                <Input placeholder="请输入项目概述" onChange = {(e)=>this.GetName(e)}/>
                            </Form.Item>
                            <Form.Item name="项目介绍" label="项目介绍" rules={[{ required: true}]}>
                                <Input rows={4} placeholder="请输入项目介绍" onChange = {(e)=>this.GetDescription(e)}/>
                            </Form.Item>
                            <Form.Item name="目标金额" label="目标金额(单位:wei)" rules={[{ required: true}]}>
                                <InputNumber min={1}   onChange={value=>{
                                    this.setState({
                                        money:value,
                                    });
                                }}/>
                            </Form.Item>
                            <Form.Item name="众筹时间" label="众筹时间(单位:天)" rules={[{ required: true}]}>
                                <InputNumber min={1}  defaultValue={3} onChange={value=>{
                                    this.setState({
                                        days:value,
                                    });
                                }} />
                            </Form.Item>
                        </Form>
                    </Modal>
    <Layout>
      <Header className="site-layout-sub-header-background" style={{ padding: 0 }}>
      <Button type="primary" size='large' onClick={this.showModal1}>发起众筹</Button>
      </Header>
      
      <Content style={{ margin: '24px 16px 0' }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
        <BrowserRouter>
          
          <Switch>
            <Route exact path = "/" component = {AllFunds}/>
            <Route exact path = "/myProjects" component = {MyFunds}/>
            <Route exact path = "/myContributions" component = {MyContributions}/>
            
          </Switch>
        </BrowserRouter>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  </Layout>
            
        )
    }
}

export default App

