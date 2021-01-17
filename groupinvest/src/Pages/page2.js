import React from 'react'
import { Layout, Menu, DatePicker,InputNumber, Space,Input,Button ,Divider} from 'antd';
import './page.css'
import moment from 'moment';
const { Header, Content } = Layout;
const { TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const Page2 = (props)=>(
    <Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} onClick={props.navclick} selectedkeys={[props.current]}>
        <Menu.Item key="1">Existing Projects</Menu.Item>
        
        <Menu.Item key="2">New Project</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 500px' ,width:"100%"}}>
      
      <div className="site-layout-content" style={{width:'100%',alignSelf:'center'}}  >
      <Divider orientation="left">New Project</Divider>
      <Space size={10} direction="vertical" style={{alignSelf:'center'}}>
      <div>Project Name<Input placeholder="Project Name" onChange={props.nameinput} /></div>
      <div>End Time<DatePicker showTime defaultValue={moment('2022/01/18', dateFormat)} onChange={props.dateinput}  />
      </div>
      <div>Target Price<InputNumber min={0} defaultValue={0} onChange={props.amountinput}/></div>
      
      <div>Description<TextArea placeholder="Description" rows={5} onChange={props.desinput} /></div>
      <Button type="primary" shape="round"  size={'large'} style={{align:'center'}} onClick={props.newfund} disabled={props.isClicked}>
         Submit
        </Button>
      <p>{props.isClicked}</p>
      </Space>
      </div>
      
    </Content>
  </Layout>
)
export default Page2