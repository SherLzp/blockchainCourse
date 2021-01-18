import { FC } from 'react';
import { Layout, Menu } from 'antd'
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './App.css';
import All from './src/All'
import I from './src/I'
import Funding from './src/Funding';
import New from './src/New';

const { Header, Content, Footer, Sider } = Layout

const App: FC = () => (
  <BrowserRouter>
    <div className="App">
      <Layout style={{ minHeight: '100vh' }}>
        <Sider>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" >
              <Link to="/all">所有众筹</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/i">我的众筹</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/new">发起众筹</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: '0 0 0 1em' }} >
            众筹平台
          </Header>
          <Content style={{ margin: '16px' }}>
            <Route path="/all" component={ All } />
            <Route path="/i" component={ I } />
            <Route path="/funding/:id" component={ Funding } />
            <Route path="/new" component={ New } />
          </Content>
          <Footer style={{ textAlign: 'center' }}>Create By Ant Design</Footer>
        </Layout>
      </Layout>
    </div>
  </BrowserRouter>
);

export default App;