import React from 'react'
import { Layout, Menu, Breadcrumb,DatePicker,InputNumber, Space,Input,Button ,Divider } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import moment from 'moment';
const { SubMenu } = Menu;

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';

const { Header, Content, Sider } = Layout;
const Test4Mod = (props) => (
<Layout>
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['4']} onClick={props.pageswitch} selectedKeys={[props.currentpage]}>
        <Menu.Item key="1" >nav 1</Menu.Item>
        <Menu.Item key="2" >nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
        <Menu.Item key="4">nav 4</Menu.Item>
      </Menu>
    </Header>
    <Layout>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
            <Menu.Item key="1">option1</Menu.Item>
            <Menu.Item key="2">option2</Menu.Item>
            <Menu.Item key="3">option3</Menu.Item>
            <Menu.Item key="4">option4</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
            <Menu.Item key="5">option5</Menu.Item>
            <Menu.Item key="6">option6</Menu.Item>
            <Menu.Item key="7">option7</Menu.Item>
            <Menu.Item key="8">option8</Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
            <Menu.Item key="9">option9</Menu.Item>
            <Menu.Item key="10">option10</Menu.Item>
            <Menu.Item key="11">option11</Menu.Item>
            <Menu.Item key="12">option12</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          第{props.currentpage}页
          <div className="site-layout-content" style={{width:'100%',alignSelf:'center'}}  >Content44
      <Divider orientation="left">新建项目</Divider>
      <Space size={10} direction="vertical" style={{alignSelf:'center'}}>
      <div>众筹名称：<Input placeholder="项目名称" onChange={props.nameinput} /></div>
      <div>众筹截止日期：<DatePicker showTime defaultValue={moment('2021/01/01', dateFormat)} onChange={props.dateinput}  />
      </div>
      <div>众筹目标金额：<InputNumber min={0} defaultValue={0} onChange={props.amountinput}/></div>
      
      <div>众筹描述：<TextArea placeholder="项目描述" rows={5} onChange={props.desinput} /></div>
      <Button type="primary" shape="round"  size={'large'} style={{align:'center'}} onClick={props.newfund} disabled={props.isClicked}>
         提交
        </Button>
      <p>{props.isClicked}</p>
      </Space>
      </div>
        </Content>
      </Layout>
    </Layout>
</Layout>
)
export default Test4Mod;