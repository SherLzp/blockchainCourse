import React from "react";
import {Layout, Menu} from "antd";
import {Link} from "react-router-dom";
const { Header} = Layout;

export default class MenuList extends React.Component {
    render(){
        return(
          <Header className="header">
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['0']}>
              <Menu.Item key={'0'}>
                  所有项目 
              </Menu.Item>
              <Menu.Item key={'1'}>
                  我发起的项目
              </Menu.Item>
              <Menu.Item key={"2"}>
                  我投资的项目
              </Menu.Item>
              <Menu.Item key={"3"}>
                  所有未完成项目
              </Menu.Item>
            </Menu>
          </Header>
        );
    }
}