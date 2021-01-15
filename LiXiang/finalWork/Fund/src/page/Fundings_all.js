import { Layout, Menu,Table,Button, Typography,Progress} from 'antd';
import {Link} from 'react-router-dom';
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './Navi.css';
 
const { Header, Content, Footer, Sider} = Layout;
 
class Fundings_created extends Component { 
    constructor(){
      super();
      this.state = {
        currentAccount:'',
        Fundingsurl:[],
        myFundingsurl:[],
        contributedFundingsurl:[],
      };
    };
    state = {
        collapsed: false,
        mode: 'inline',
    };
    
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    componentDidMount(){
        this.setState({
          columns: [ 
            { title: '标题',
              dataIndex: 'FundingTitle', 
              key: 'FundingTitle',              
            },
            { title: '创建者', dataIndex: 'FundingCreator', key: 'FundingCreator' },
            { title: '目标金额', dataIndex: 'FundingTarget_eth', key: 'FundingTarget_eth',width:'50' },
            { title: '目前金额', dataIndex: 'FundingTotal_eth', key: 'FundingTotal_eth' },  
            { title: '截止时间', dataIndex: 'FundingDeadline', key: 'FundingDeadline'},
            { title: '当前状态', 
              dataIndex: 'FundingState', 
              key: 'FundingState',
              render: (FundingState) => {
                if (FundingState === "Ongoing"){
                  return '正在进行';
                }
                else return '筹资结束';
                },
              defaultSortOrder: 'descend', sorter: (a, b) => ((a.FundingState==="Ongoing")?1:0)-((b.FundingState==="Ongoing")?1:0)
            }, 
            {
              render: (text, record) => {
                const url = '/Funding/' + (record.key - 1);
                this.state.Fundingsurl.push(url);
                console.log("#############################")
                console.log(this.state.Fundingsurl);                
                return (
                  <Button href={url}>查看详情</Button>
                );
              }                         
            },      
          ],
        });
      }
    render() {

        return (
            <Layout>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                >
                <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.props.index]}>
                {/* <div style="width:500px; height:500px; border-radius:100%; overflow:hidden;"> 
                  <img src="t.png" alt="只是圆形图片" />
                </div>   */}
                 <Menu.SubMenu title="项目管理"> 
                    <Menu.Item key="1">
                        <span className="nav-text">
                        <Link to="/">所有项目</Link>
                        </span>
                    </Menu.Item>
                    <Menu.Item>
                        <span className="nav-text"> 
                        <Link to="/Fundings_created">我创建的项目</Link>
                        </span>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <span className="nav-text">
                        <Link to="/Fundings_contributed">我投资的项目</Link>
                        </span>
                    </Menu.Item>
                    </Menu.SubMenu>           
                    <Menu.Item key="4">
                        <span className="nav-text">
                        <Link to="/Fundings_create">创建项目</Link>
                        </span>
                    </Menu.Item>        
                </Menu>
            </Sider>
        <Layout>
        <Header style={{ background: '#000', padding: 0 }}>
            <span style={{color:'#fff', paddingLeft:'2%', fontSize:'1.4em'}}>
            </span>
            <span style={{color:'#fff', paddingLeft:'2%', fontSize:'2.0em'}}>众筹系统</span>
            <span style={{color:'#fff', paddingLeft:'2%', fontSize:'1.0em',float:'right', paddingRight:'1%'}}>当前账号：{this.props.currentAccount}</span>
                <span style={{color:'#fff', float:'right', paddingRight:'1%'}}>
                </span>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div class='header'>                      
          <Typography>
              <h3>所有众筹项目概览</h3>
          </Typography>
          </div>
          <div class='table'>
          <Table
            columns={this.state.columns}
            dataSource={this.props.FundingsInfo}
            bordered
            loading={this.state.loading}
            />
          </div>
          <div style={{ padding: 24, background: '#fff', minHeight: 250 }}>   
          </div>
       </Content>
        <Footer style={{ textAlign: 'center' }}>
            项目名称：众筹平台 开发者：李想 用途：浙江大学区块链与数字货币课程作业
        </Footer>
        </Layout>
        </Layout>
    );
   }
}
 
export default Fundings_created;

