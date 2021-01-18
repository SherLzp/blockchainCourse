import React from 'react'
//import { Button, Card, Icon, Image, Statistic } from 'semantic-ui-react'
import { Layout, Menu, DatePicker,InputNumber, Space,Input,Button ,Divider, Card} from 'antd';
import './ui.css'
import moment from 'moment';
const { Header, Content, Footer } = Layout;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const PageExamplePage4 = (props)=>(
    <Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['4']} onClick={props.navclick} selectedkeys={[props.current]}>
        <Menu.Item key="1">发现项目</Menu.Item>
        
        <Menu.Item key="4">新的项目</Menu.Item>
      </Menu>
      
      
    </Header>
    <Content style={{ padding: '0 50px' ,width:"100%"}}>
     
      <div className="site-layout-content" style={{width:'100%',alignSelf:'center'}}  >
      <div ><strong>当前账户：{props.current_account}</strong></div>
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
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  </Layout>
)
export default PageExamplePage4