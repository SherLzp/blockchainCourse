import React from 'react';
import { Layout, Menu } from 'antd';
import {
    LeftOutlined,
    ContactsOutlined,
    InteractionOutlined,
    FormOutlined,
    BarsOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import Home from './pages/home'
import Create from './pages/create'
import All from './pages/all'
import Icreate from "./pages/icreate"
import Participating from './pages/participating'
import Help from './pages/help'
import Funding from './pages/funding'

import { BrowserRouter, Route, Link, Switch, Router } from 'react-router-dom'

class UI extends React.Component {
    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    async componentDidMount() {
        await this.props.refresh_account();
    }

    render() {
        const { collapsed } = this.state;
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <BrowserRouter>
                    <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                        <div className="logo" />
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1" icon={<LeftOutlined />}>
                                <Link to="/">
                                    首页
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="2" icon={<FormOutlined />}>
                                <Link to="/create">
                                    发起众筹
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="3" icon={<BarsOutlined />}>
                                <Link to="/all">
                                    所有众筹
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="4" icon={<ContactsOutlined />}>
                                <Link to="/icreate">
                                    我发起的众筹
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="5" icon={<InteractionOutlined />}>
                                <Link to="/participating">
                                    我投资的众筹
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="6" icon={<QuestionCircleOutlined />}>
                                <Link to="/help">
                                    帮助
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Switch>
                        <Route path='/fundings/:index' children={
                            <Funding
                                current_account={this.props.current_account}
                            ></Funding>
                        }>
                        </Route>
                        <Route exact path="/" component={Home} />
                        <Route path='/create' >
                            <Create
                                current_account={this.props.current_account}
                                createFunding={this.props.createFunding}
                            ></Create>
                        </Route>
                        <Route path='/all' >
                            <All
                                current_account={this.props.current_account}
                                fundings_info={this.props.fundings_info}
                                Participate={this.props.Participate}
                                refresh_account={this.props.refresh_account}
                            ></All>
                        </Route>
                        <Route path='/icreate' >
                            <Icreate
                                current_account={this.props.current_account}
                                my_fundings_info={this.props.my_fundings_info}
                                createRequest={this.props.createRequest}
                                refresh_account={this.props.refresh_account}
                            ></Icreate>
                        </Route>
                        <Route path='/participating' >
                            <Participating
                                current_account={this.props.current_account}
                                part_fundings_info={this.props.part_fundings_info}
                                refresh_account={this.props.refresh_account}
                            ></Participating>
                        </Route>
                        <Route path='/Help' component={Help} />
                    </Switch>
                </BrowserRouter>
            </Layout>
        );
    }
}

export default UI;