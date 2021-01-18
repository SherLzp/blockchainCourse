import React, { Component } from 'react';
import 'antd/dist/antd.css';
import {BrowserRouter,Route,Switch,Link} from 'react-router-dom';
import Home from "./display/Home";
import Mine from "./display/Mine";
import Create from "./display/Create";
import { Menu } from 'antd';
let web3 = require('./utils/InitWeb3');
let CrowdFundingContract = require('./eth/CrowdFunding')

class App extends Component {
    state = {
        current: 'mail',
    };
    launch = async() => {
        try{
            let day = new Date('2021/01/15 23:59:59')
            await CrowdFundingContract.methods.launch('标题1,', '介绍1', web3.utils.toWei('0.1', 'ether'), day.getTime()).call()
            console.log('here')
        }catch (e) {
            console.log(e)
            this.setState({ isClicked: false })
            alert('投注失败')
        }
    }
    async componentWillMount() {

    }
    handleClick = e => {
        console.log('click ', e);
        this.setState({ current: e.key });
    };
    
    render() {
        return (
          <BrowserRouter>
            <Menu mode="horizontal">
              <Menu.Item key="home" >
                <Link to="/">首页</Link>
              </Menu.Item>
              <Menu.Item key="mine" >
                <Link to="/mine">我的项目</Link>
              </Menu.Item>
              <Menu.Item key="create" >
                <Link to="/create">创建项目</Link>
              </Menu.Item>
            </Menu>
            <Switch>
              <Route  exact path="/" component={Home}></Route>
              <Route  path={"/mine"} component={Mine}></Route>
              <Route  path={"/create"} component={Create}></Route>
            </Switch>
          </BrowserRouter>
        );
      }
}

export default App;