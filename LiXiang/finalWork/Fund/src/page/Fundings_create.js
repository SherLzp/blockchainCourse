import { Layout, Menu,Typography,Input,Form,Row,Col,Button,DatePicker} from 'antd';
import {Link} from 'react-router-dom';
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './Navi.css';
 
const { Header, Content, Footer, Sider} = Layout;
 
class Fundings_created extends Component { 

    state = {
        collapsed: false,
        mode: 'inline',
    };
    
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    onFinish = (values) => {
      this.props.createFunding(values.title, values.description, values.deadline.valueOf(), values.target);
      this.setState({visible: false});
    };

    
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
              <h3>创建项目</h3>
          </Typography>
          </div>
        <div class='form'>
        <Form {...{ labelCol: { span: 2 }, wrapperCol: { span: 7 }, whiteCol: {span: 5}}} onFinish={this.onFinish}  preserve={false}>
            <Form.Item name={['title']} label="名称">
              <Input/>
            </Form.Item>
            <Form.Item name={['target']} label="目标金额" >
              <Input Input suffix="ETH" />
            </Form.Item>
            <Form.Item name={['deadline']} label="结束时间">
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
            </Form.Item>
            <Form.Item name={['description']} label="描述">
              <Input.TextArea rows={8}/>
            </Form.Item>
            <Form.Item wrapperCol>
              <Row>
                <Col span={100}>
                  <div class='button'>
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                  </div>
                </Col>
              </Row>
            </Form.Item>
          </Form>
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

