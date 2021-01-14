import React, { Component } from 'react'
import './App.css'
import ProjectList from './components/projectDetail'
import Account from './utils/account'
import createProject from './utils/createProject'
import { useState } from 'react';
import { Modal, Button, Form, Input, InputNumber } from 'antd';
import { Row, Col } from 'antd';
import ProjectForm from './utils/projectForm'
import { Layout, Menu, Breadcrumb, Typography } from 'antd';
const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography




class ProjectInfo extends Component{
  constructor(props) {
    super(props);
    this.state = ({
      modal: false,
    });
  }
  

  showModal = () => {
    this.setState({modal: true});
  };

  handleOk = () => {
    this.setState({modal: false});
  };

  handleCancel = () => {
    this.setState({modal: false});
  };

  render() {
    return (
    <Row>
      <Col span={20}></Col>
      <Button type="primary" onClick={this.showModal}>
        Create Project
      </Button>
      <Modal title="Basic Modal" visible={this.state.modal} footer = {null} onOk={this.handleOk} onCancel={this.handleCancel}>
        <ProjectForm />
      </Modal>
    </Row>
    );
  }
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {fun: 0};
  }
  Fun = (key) => {
    this.setState({fun: key});
  }
  render() {
    return (
      <Layout className="layout">
    <Header>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" onClick={()=>this.Fun(0)}>All Projects</Menu.Item>
        <Menu.Item key="2" onClick={()=>this.Fun(1)}>Created Projects</Menu.Item>
        <Menu.Item key="3" onClick={()=>this.Fun(2)}>Funded Projects</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <div className="container">
        <Title>Crowdfunding Platform</Title>
        <Row>
        <Col span={14}></Col>
        <Account />
        </Row>
        <ProjectInfo />
        <br/>
        <br/>
        <ProjectList function={this.state.fun}/>
      </div>
    </Content>
  </Layout>
    );
  }
}

export default App;
