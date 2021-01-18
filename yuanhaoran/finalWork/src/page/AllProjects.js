import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './Layout.css';
import { Layout, Menu } from 'antd';
import ProjectTable from '../components/ProjectTable';
import CreateProject from '../components/CreateProject';

const { Header, Content, Footer } = Layout;

class AllProjects extends Component{
  async componentDidMount() {
    await this.props.refreshAccount();
    await this.props.getProjects();
    console.log(this.props);
  }

  render() {
    return (
      <Layout className="layout">
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[this.props.index]} >
            <Menu.Item key="1">
              <Link to="/">All Projects</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/mine">My Projects</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/contributed">My Contributions</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <CreateProject
            currentAccount={this.props.currentAccount}
            createProject={this.props.createProject}
          ></CreateProject>
          <div className="site-layout-content">
            <ProjectTable
              currentAccount={this.props.currentAccount}
              projectsInfo={this.props.projectsInfo}
              createDraw={this.props.createDraw}
              contribute={this.props.contribute}
            ></ProjectTable>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Crowd Funding ©2021 Created by Yuan Haoran</Footer>
      </Layout>
    )
  }
}

export default AllProjects;
