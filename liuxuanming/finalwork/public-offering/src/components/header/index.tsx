import React from 'react';
import { Layout, Menu, Typography } from 'antd';

import logo from '../../assets/header/logo.png'
import './header.css'

import web3 from '../../utils/web3'
import contract from "../../utils/contracts";

const { Title } = Typography;

/**
 * logo + 导航栏
 */
class WebHeader extends React.Component {

    state = {
        isConnected: false,
        account: ""
    }

    async componentWillMount() {
        let accounts = await web3.eth.getAccounts();
        if(accounts.length == 0) {
            this.setState({
                isConnected: false
            })
        }
        else {
            await this.setState({
                isConnected: true,
                account: accounts[0]
            })
        }
        console.log(contract)
    }

    render() {
        return (
            <div className="header">
                <img className="header-logo" src={logo} alt="校徽"/>
                <div className="header-title">
                    <Title level={2}>小虎众筹</Title>
                </div>
                {this.state.isConnected==true&&<div className="header-state-on">
                    欢迎，{this.state.account}
                </div>}
                {this.state.isConnected==false&&<div className="header-state-off">
                    请先用MetaMask连接本网址！
                </div>}
            </div>
        )

    }
}

export default WebHeader