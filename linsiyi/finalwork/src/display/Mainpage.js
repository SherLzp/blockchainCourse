import React from "react";
import { Menu, Layout,Select,Radio} from 'antd';
import Slider from "./Slider";
import {NotEndProject,MyInvestingProject,MyCreatingProject,ProjectList,AllProject} from './ProjectList';

const {Footer, Sider} = Layout;
const { Option } = Select;

export default class Mainpage extends React.Component {
    constructor(props){
        super(props);
        this.state = {choicebutton:'0'};
    }
    render(){
      
        let currentAccount = this.props.currentAccount;
        let proj_component, page;
        let choicebutton = this.state.choicebutton;
        if(choicebutton === '0'){
          proj_component = <AllProject {...this.props}/>
        }
        else if(choicebutton === '1'){
          proj_component = <NotEndProject {...this.props}/>
        }
        else if(choicebutton === '2'){
          proj_component = <MyCreatingProject {...this.props}/>
        }
        else{
          proj_component = <MyInvestingProject {...this.props}/>
        }
        page = 
        <Layout style={{marginLeft: '32px', marginTop: '30px'}}>
          
          <h2 style={{color:"dark-grey",textAlign:'center'}}>我的众筹网站</h2>
          <h3 style={{textAlign:'center'}}>您好，{currentAccount}</h3>
          <br></br>
          <br></br>
          {proj_component}
          
        </Layout>

        
        
        return(
          <Layout>
			      <Layout style={{minHeight: '100vh'}}>
              <Sider>
                <Menu
                    mode="inline" 
                    theme="dark"
                    defaultSelectedKeys={['0']}
                    style={{ height: '100%', borderRight: 0 }}
                >
                  
                  <Menu.Item key={'0'} style={{textAlign:'center'}} onClick={()=>{this.setState({choicebutton:'0'})}}>
                    全部众筹项目
                  </Menu.Item>
                  <Menu.Item key={"2"} style={{textAlign:'center'}} onClick={()=>{this.setState({choicebutton:'2'})}}>
                    我创建的项目
                  </Menu.Item>
                  <Menu.Item key={"3"} style={{textAlign:'center'}}  onClick={()=>{this.setState({choicebutton:'3'})}}>
                    我投资的项目
                  </Menu.Item>
                  <Menu.Item key={'1'} style={{textAlign:'center'}} onClick={()=>{this.setState({choicebutton:'1'})}}>
                    未完成的项目
                  </Menu.Item>
                  
                </Menu>
              </Sider>
              {page}
            </Layout>
            
          </Layout>
        )
    }
} 

