import React from 'react';
import { Link } from 'react-router-dom';
import web3 from '../utils/initWeb3';
import { Menu } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import '../assets/Menu.css'
/**
 * 导航栏
 */
class TopBar extends React.Component{
    constructor(){
        super()
        this.state = {
            currentAccount:'',
            currentKey:"allFundings",
        }
    }

    handleClick = e => {
        console.log('click ', e);
        this.setState({
            currentKey: e.key,
        });
      };

    async componentDidMount(){
        let accounts = await web3.eth.getAccounts()
        console.log('accounts:',accounts)

        this.setState({currentAccount:accounts[0]})
    }

    render(){
        return(
            <div class = "header">
                <div class = "title" style = {{marginLeft:"5%"}}> 众筹平台 </div>
                <div style = {{alignSelf:'flex-end'}}>
                <Menu onClick={this.handleClick} selectedKeys={[this.state.currentKey]} mode="horizontal">
                    <MenuItem key = "allFundings" >
                    <Link to = "/"> 所有众筹项目 </Link>
                    </MenuItem>
                    <MenuItem key = "newFunding" >
                    <Link to = "/newFunding"> 发起新的众筹项目 </Link>
                    </MenuItem>
                    <MenuItem key = "myFundings" >
                    <Link to = "/myFunding"> 我参与的项目 </Link>
                    </MenuItem>
                </Menu>
                </div>
            </div>
        );
    }
}

export default TopBar