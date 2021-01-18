import React from "react";
import logo from "./imgs/1.jpg"
import { Menu, Layout} from 'antd';
import {MoneyCollectOutlined, HomeOutlined, IdcardOutlined, MessageOutlined} from '@ant-design/icons';
import AllFunding from './AllFunding';
import Slider from "./Slider";
import UnfinishFunding from './UnfinishFunding';
import MyInvestFunding from './MyInvestFunding';
import MyCreateFunding from './MyCreateFunding';

import Img1 from './imgs/2.jpg';
import Img2 from './imgs/3.jpg';
import Img3 from './imgs/4.jpg';
import Img4 from './imgs/5.jpg';
import Img5 from './imgs/6.jpg';
import Img6 from './imgs/7.jpg';

let  imgs=[Img1,Img2,Img3]

const {Footer, Sider} = Layout;

export default class MainPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {choice:'0'};
    }
    render(){
        let component, area;
        let currentAccount = this.props.currentAccount;
        let choice = this.state.choice;
        if(choice === '0'){
            component = <AllFunding {...this.props}/>
        }
        else if(choice === '1'){
            component = <UnfinishFunding {...this.props}/>
        }
        else if(choice === '2'){
            component = <MyCreateFunding {...this.props}/>
        }
        else{
            component = <MyInvestFunding {...this.props}/>
        }
        if(choice !== '4'){
          area = 
          <Layout style={{marginLeft: '30px', marginTop: '15px'}}>
            <h3 style={{color:"blue"}}>欢迎使用CrowdFunding Dapp！</h3>
            <p>您的账户是：{currentAccount}</p>
            {component}
            {/*
            <Button type="primary" style={{ marginTop: 16, marginLeft: '30%', width: '40%', height: '40px' }} onClick={() => this.setState({isLaunchVisible: true})}>发布众筹项目</Button>
            */}
          </Layout>
          
        }
        else{
          area = 
          <Layout style={{backgroundColor:"rgb(241,240,253)",paddingBottom:'50px'}}>
            <Slider Imgs={imgs} />      
            <div style={{marginTop:'39px', borderWidth:'0px 1px 0px 1px'}}>
              <h1 style={{fontSize:40, color:'blue', textAlign:'center', fontWeight:'bold'}}>众筹E时代，大伙投精彩！</h1>
              <p style={{fontSize:'17px', textAlign:'center'}}>欢迎使用CrowdFunding Dapp，您的账户是：
              <span style={{color:'red'}}>{currentAccount}</span>！</p>
              <div style={{marginTop:'30px'}}>
                <img src={Img4} alt="" style={{width:"20%", height:'150px', float:"left", marginLeft:"10%"}}/>
                <img src={Img5} alt="" style={{width:"20%", height:'150px', float:"left", marginLeft:"10%"}}/>
                <img src={Img6} alt="" style={{width:"20%", height:'150px', float:"left", marginLeft:"10%"}}/>
              </div>
            </div>
          </Layout>
        }
        return(
          <Layout>
            <Layout>
				      <div height='80px' style={{backgroundColor: 'rgb(0, 125, 205)'}}>
					      <img height='80px' src={logo} alt="logo" />
              </div>
            </Layout>
					
			      <Layout style={{minHeight: '100vh'}}>
              <Sider>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['0']}
                    style={{ height: '100%', borderRight: 0 }}
                >
                  <Menu.Item key={'4'} icon={<MoneyCollectOutlined />} onClick={()=>{this.setState({choice:'4'})}}>
                    首页
                  </Menu.Item>
                  <Menu.Item key={'0'} icon={<MoneyCollectOutlined />} onClick={()=>{this.setState({choice:'0'})}}>
                    全部众筹
                  </Menu.Item>
                  <Menu.Item key={'1'} icon={<HomeOutlined />} onClick={()=>{this.setState({choice:'1'})}}>
                    可投资项目
                  </Menu.Item>
                  <Menu.Item key={"2"} icon={<IdcardOutlined />} onClick={()=>{this.setState({choice:'2'})}}>
                    我创建的
                  </Menu.Item>
                  <Menu.Item key={"3"} icon={<MessageOutlined />} onClick={()=>{this.setState({choice:'3'})}}>
                    我投资的
                  </Menu.Item>
                </Menu>
              </Sider>
              {area}
            </Layout>
            <Footer style={{ backgroundColor: "rgba(0, 0, 0, 0.85)", color: "white", textAlign: 'center'}}>
              CrowdFunding Dapp <br/>
              开发者：潘凯航<br/>
              @2021-01-12
            </Footer>	
          </Layout>
        )
    }
}