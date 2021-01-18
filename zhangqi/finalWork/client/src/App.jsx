import React, { Component } from "react";
import {PageHeader, Menu, BackTop, Layout, Divider, Avatar, Card, List} from 'antd';
import { UnorderedListOutlined, UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';

import {Link, Route} from 'react-router-dom';

import AllCrowdFund from "./pages/AllCrowdFund";
import MyCrowdFund_1 from "./pages/MyCrowdFund_1";
import MyCrowdFund_2 from "./pages/MyCrowdFund_2";
import CreateCrowdFund from "./pages/CreateCrowdFund";

import 'antd/dist/antd.css';
import CrowdFundIcon from "./img/crowdfund.png"
import UserIcon from "./img/user.png"
import "./App.css";
import Meta from "antd/es/card/Meta";

const {SubMenu} = Menu;
const {Header, Content, Footer} = Layout;

let web3 = require('./utils/getWeb3');

class MyHeader extends Component {
    render() {
        return (
            <Header style={{height: 150, backgroundColor: '#FFF'}}>
                <div className="site-card-wrapper">
                    <Card style={{weight: '100%', height: '100%'}} bordered={true}>
                        <Meta
                            avatar={<Avatar src={UserIcon} />}
                            title="当前地址"
                            description={this.props.account}
                        />
                    </Card>
                </div>
            </Header>
        )
    }
}

class MyFooter extends Component {
    render() {
        return (
            <Footer>
                <div className="footer">
                    <p>友情链接</p>
                </div>
                <div className="friendLink">
                    <a href="https://reactjs.org">React</a>
                    <Divider type="vertical"/>
                    <a href="https://ant.design">Ant Design</a>
                    <a href="https://www.trufflesuite.com">Truffle</a>
                    <Divider type="vertical"/>
                    <a href="https://www.trufflesuite.com/ganache">Ganache</a>
                </div>
                <Footer style={{ textAlign: 'center' }}>Crowd Fund Project©️2021 Developed by <a href="http://www.github.com/Cheungki">Qi Zhang(Cheungki)</a></Footer>
            </Footer>
        )
    }
}

class App extends Component {
    constructor() {
        super()
        this.state = {
            current: 'AllCrowdFund',
            account: '',
            MyFunds_1: [],
            MyFunds_2: [],
            AllFunds: []
        }
    }

    async componentWillMount() {
        let accounts = await web3.eth.getAccounts()

        this.setState({
            account: accounts[0],
        })
    }

    handleClick = e => {
        this.setState({ current: e.key });
    };

    refreshFunction = () => {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts[0]) {
                this.setState({ account: accounts[0]})
            }
        })
    }

    render() {
        this.refreshFunction()

        return (
            <div className="site-page-header-ghost-wrapper">
                <PageHeader
                    ghost={false}
                    title="众筹系统"
                    avatar={{src: CrowdFundIcon}}
                    className="header"
                />
                <Layout>
                    <MyHeader
                        account={this.state.account}
                    />
                    <Content>
                        <Menu
                            onClick={this.handleClick}
                            selectedKeys={[this.state.current]}
                            mode="horizontal"
                        >
                            <Menu.Item
                                key="AllCrowFund"
                                icon={<UnorderedListOutlined />}
                                style={{width: '30%', textAlign: 'center'}}
                            >
                                <Link to={{pathname: "/AllCrowdFund", state: {account: this.state.account, page: 1}}}>
                                    所有众筹项目
                                </Link>
                            </Menu.Item>
                            <SubMenu
                                key="SubMenu"
                                icon={<UserOutlined />}
                                title="我的众筹"
                                style={{width: '30%', textAlign: 'center'}}
                            >
                                <Menu.Item key="MyCrowdFund_1">
                                    <Link to={{pathname: "/MyCrowdFund_1", state: {account: this.state.account, page: 2}}}>
                                        我发起的众筹项目
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="MyCrowdFund_2">
                                    <Link to={{pathname: "/MyCrowdFund_2", state: {account: this.state.account, page: 3}}}>
                                        我参与的众筹项目
                                    </Link>
                                </Menu.Item>
                            </SubMenu>
                            <Menu.Item
                                key="CreateCrowdFund"
                                icon={<UsergroupAddOutlined/>}
                                style={{width: '30%', textAlign: 'center'}}
                            >
                                <Link to={{pathname: "/CreateCrowdFund", state: {account: this.state.account}}}>
                                    发起新的众筹项目
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Content>
                    <Content className="site-layout-background" style={{padding: 24, margin: 0, minHeight: 420}}>
                        <Route path='/AllCrowdFund' exact component={AllCrowdFund}/>
                        <Route path='/MyCrowdFund_1' exact component={MyCrowdFund_1}/>
                        <Route path='/MyCrowdFund_2' exact component={MyCrowdFund_2}/>
                        <Route path='/CreateCrowdFund' exact component={CreateCrowdFund} style={{position: 'center'}}/>
                    </Content>
                    <Divider/>
                    <MyFooter/>
                </Layout>
                <BackTop>
                    <div className="backtotop">回到顶部</div>
                </BackTop>
            </div>
        );
    }
}

export default App;
