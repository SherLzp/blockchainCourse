import React from 'react';
import 'antd/dist/antd.css';

//tools
import {Modal, Button, Icon, Carousel, Input} from 'antd'
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
//pages
import IndexPage from'./page/IndexPage/IndexPage'
// import UserPage from './page/userPage/userPage'
import FundPage from './page/FundPage/FundPage'
import MyFundPage from "./page/MyFundPage/MyFundPage";
import TopBar from './page/tools/TopBar/TopBar'

//css file
import './App.css';
import logo from "./logo.svg";
import {addListener, authenticate, contract, getAccount} from "./contracts/contract";
import InfoPage from "./page/InfoPage/InfoPage";

//component

const { Search } = Input;

const functGet = () =>{
    return [
        {
            title:"首页",
            link:"/"
        },
        {
            title:"所有众筹",
            link:"/fund"
        },
        {
            title:"我的众筹",
            link:"/myfund"
        },
        {
            title:"相关咨询（待开发）",
            link:"/"
        },
        {
            title:"平台介绍（待开发）",
            link:"/"
        }
    ]
}
const FunctBarGet = (item)=>{
    return (<div className="pxIndexPageFunct" key={item.title}><Link to={item.link} ><span className="titleFunct">{item.title}</span></Link></div>)
}


class App extends React.Component {
    constructor(props){
        super()
        this.state={
            address:"",
            account:null
        }
        localStorage.setItem(
            "userState",
            JSON.stringify({
                isLogin:false,
                userName:'',
                password:'',
                address:"",
                PrivateKey:"",
                chainId:0
            }))
    }

    async componentWillMount() {
        await authenticate();
        let account = await getAccount();

        this.setState({
            account:account
        })

    }

    helpFunction = () => {
        window.ethereum.on('accountsChanged', (accounts) => {
            this.setState({ account: accounts[0] })
        })
    }

    render(){
        this.helpFunction()
        return (
            <Router >
                <div className="PxOutSide">
                    <div className="PxInSide">
                        <TopBar  account={this.state.account}/>
                        <div className="pxIndexPageSearchBar" style={{background: "#fff"}}>
                            <img className="pxIndexLogo" src={logo} alt="logo"/>
                            <div className="pxIndexPageSearch">
                                <Search placeholder="查找众筹项目（待开发）" onChange={this.handleChangeSearch} enterButton={<Link to={this.state.search?"/TxInfo/"+this.state.search.toUpperCase():"/"}>搜索</Link>} />
                            </div>
                        </div>
                        <div className="pxIndexPageFunctBar" style={{background: "#fff"}}>
                            {functGet().map(FunctBarGet)}
                        </div>

                        <Route exact path="/" component={IndexPage} />
                    {/*    <Route exact path="/UserPage" component={UserPage} />*/}
                    {/*    <Route exact path="/UserPage/:userAddress" component={UserPage} />*/}
                        <Route exact path="/fund" component={FundPage} />
                        <Route exact path="/myfund" component={MyFundPage} />
                        <Route exact path="/fund/:id" component={InfoPage} />
                    </div>
                    <div className="PxUnderBar">
                        个人网站备案号：<a href="http://www.miitbeian.gov.cn/">浙ICP备19002880号</a>[本页面仅供项目测试使用，不代表最终产品，如有合作意向请联系管理员]
                    </div>
                </div>
            </Router>
        );
    }
}
export default App;
