import React from 'react'
import { Layout, Menu, List } from 'antd';
import './page.css'
const { Header, Content } = Layout;
const Page1 = (props)=>(
    <Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} onClick={props.navclick} selectedkeys={[props.current]}>
        <Menu.Item key="1">Existing Projects</Menu.Item>
        
        <Menu.Item key="2">New Project</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      
      <div className="site-layout-content" >
    <List
      size="large"
      header={<div >
          
          <div class="div-inline">Project Name</div><div style={{display:"inline"}}>Project State______</div><div class="div-inline">______Due Date</div><div class="div-inline">Owner Address</div>
      </div>}
      dataSource={props.investments}
      renderItem={item => (<List.Item value={item.index} onClick={props.fundclick}><List.Item>{item.name}</List.Item><List.Item>{item.status}</List.Item><List.Item>{item.due}</List.Item><List.Item>{item.raiser}</List.Item></List.Item>)
    }
      
    />
      </div>
    </Content>
  </Layout>
)
export default Page1