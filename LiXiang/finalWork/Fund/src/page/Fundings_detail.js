import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import web3 from '../utils/InitWeb3';
import { Layout, Menu, Typography, Tabs, Form, Input, Row, Col, Button,Progress } from 'antd';
import Table_requests from './Table_requests';

const { Header, Content, Footer, Sider } = Layout;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
  whiteCol: {span: 1}
};
class Fundings_detail extends Component {

  getPercentage = async () => {
    // if(this.state.FundingInfo.FundingState === "0"){
    //   let timestamp = (new Date()).getTime();
    //   if(timestamp > Number(this.state.FundingInfo.FundingDeadline) * 1000) this.state.FundingInfo.FundingState = 'Failed';
    //   else this.state.FundingInfo.FundingState = 'Ongoing';
    // } 
    // else if(this.state.FundingInfo.FundingState === "1") this.state.FundingInfo.FundingState = 'Outdated';
    // else if(this.state.FundingInfo.FundingState === "2") this.state.FundingInfo.FundingState = 'Succeeded';
    // else if(this.state.FundingInfo.FundingState === "3") this.state.FundingInfo.FundingState = 'Failed';
    // else if(this.state.FundingInfo.FundingState === "4") this.state.FundingInfo.FundingState = 'Paidoff';
    // this.state.FundingInfo.Targetnum = web3.utils.fromWei(this.state.FundingInfo.FundingTarget);
    // this.state.FundingInfo.Totalnum=web3.utils.fromWei(this.state.FundingInfo.FundingTotal);
  }
  getDraws = async () => {
    const FundingContract = this.state.FundingInfo.contract;
    const drawNum = await FundingContract.methods.getUsageNum().call({
      from: this.props.currentAccount,
    });
    const arr = [];
    for (let i = 0; i < drawNum; i++) {
      const request = await FundingContract.methods.getUsageDetail(i).call({
        from: this.props.currentAccount,
      });
      request.usageAmount_eth = web3.utils.fromWei(request.usageAmount) + 'ETH';
      request.usageAmount += 'WEI';
      request.usageStartTime = new Date(Number(request.usageStartTime) * 1000).toLocaleString("en-GB");
      if (request.usageEndTime === "0") request.usageEndTime = 'None';
      else request.usageEndTime = new Date(Number(request.usageEndTime) * 1000).toLocaleString("en-GB");
      const total = Number(this.state.FundingInfo.FundingTotal.substring(0, this.state.FundingInfo.FundingTotal.length - 3));
      request.approval = Number(request.usageApprovalContribution) / total * 100 + '%';
      request.disapproval = Number(request.usageDisapprovalContribution) / total * 100 + '%';
      request.creator = this.state.FundingInfo.FundingCreator;
      request.key = i + 1;
      arr.push(request);
    }
    this.setState({ drawsInfo: arr });
  }

  vote = async (index, ballot) => {
    try {
      console.log("---------");
      console.log(index);
      console.log(ballot);
      const FundingContract = this.state.FundingInfo.contract;
      await FundingContract.methods.vote(ballot, index).send({
        from: this.props.currentAccount,
        gas: '3000000',
      })
      alert('投票成功');
    } catch (e) {
      console.log(e);
      alert('投票失败');
    }
    this.getDraws();
  }

  constructor() {
    super();
    this.state = {
      FundingInfo: {},
      drawsInfo: [],
    }
  }

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ currentAccount: accounts[0] });
    await this.props.getFundings();
    this.setState({
      FundingInfo: this.props.FundingsInfo[this.props.match.params.index],
      
    })
    await this.getDraws();
    await this.getPercentage();
  }

  callback = async (key) => {
    console.log(key);
  }
  onFinish = (values) => {
    console.log(this.props.match.params.index);
    console.log(values.amount);
    console.log("--------");
    this.props.contribute(this.props.match.params.index, values.amount);
  };

  onFinishDraw = (values) => {
    console.log("---------------");
    console.log(values);
    this.props.createRequest(this.props.match.params.index, values.title, values.description, values.amount);
    this.setState({visible: false});
  };


  render() {
    console.log('###############');
    console.log(this.state.FundingInfo.FundingState);
    console.log('$$$$$$$$$$$$$$$$');
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
            <span style={{ color: '#fff', paddingLeft: '2%', fontSize: '1.4em' }}>
            </span>
            <span style={{ color: '#fff', paddingLeft: '2%', fontSize: '2.0em' }}>众筹系统</span>
            <span style={{ color: '#fff', paddingLeft: '2%', fontSize: '1.0em', float: 'right', paddingRight: '1%' }}>当前账号：{this.props.currentAccount}</span>
            <span style={{ color: '#fff', float: 'right', paddingRight: '1%' }}>
            </span>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <div class='header'>
              <Typography>
                <h4>项目名称：{this.state.FundingInfo.FundingTitle}</h4>
                <br></br>
              </Typography>
            </div>
            <div class='tab'>
              <Tabs defaultActiveKey="1" onChange={this.callback}>
                <Tabs.TabPane tab="项目详情" key="">
                  <div class='tablane'>
                    <Typography>
                      <h5>
                        项目简介： {this.state.FundingInfo.FundingDescription}
                      <br></br>
                      </h5>
                    </Typography>
                    {/* <Progress percent={this.state.FundingInfo.Percentage} width="50%"/> */}
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="投资项目" disabled={(this.state.FundingInfo.FundingCreator === this.state.currentAccount) || (this.state.FundingInfo.FundingState !== 'Ongoing')} key="2">
                  {/* 当前用户为创建用户或者项目不在进行时，该TabPane被禁用 */}
                  <div class='tablane'>
                    <Form {...{ labelCol: { span: 2 }, wrapperCol: { span: 7 }, whiteCol: {span: 5}}}onFinish={this.onFinish} preserve={false}>
                      <Form.Item name={['amount']} label="投资金额：" >
                        <Input suffix="ETH" />
                      </Form.Item>
                      <Form.Item wrapperCol={{ span: 10 }, {offset: 2} }>
                        <Row>
                          <Col span={12}>
                            <Button type="primary" htmlType="submit">
                              提交
                            </Button>
                          </Col>
                        </Row>
                      </Form.Item>
                    </Form>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="资金申请" disabled={(this.state.FundingInfo.FundingCreator !== this.state.currentAccount)||(this.state.FundingInfo.FundingState !== 'Succeeded')} key="3">
                  <div class='tablane'>
                    <Form {...{ labelCol: { span: 2 }, wrapperCol: { span: 7 }, whiteCol: {span: 5}}} onFinish={this.onFinishDraw} preserve={false}>
                      <Form.Item name={['title']} label="申请标题">
                        <Input />
                      </Form.Item>
                      <Form.Item name={['amount']} label="资金数额">
                        <Input Input suffix="ETH" />
                      </Form.Item>
                      <Form.Item name={['description']} label="申请理由">
                        <Input.TextArea rows={8} />
                      </Form.Item>
                      <Form.Item wrapperCol={{ span: 10 }, {offset: 2} }>
                        <Row>
                          <Col span={12}>
                            <Button type="primary" htmlType="submit">
                              确认
                            </Button>
                          </Col>
                        </Row>
                      </Form.Item>
                    </Form>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="申请列表" key="4">
                  <div class='tablane'>
                    <Table_requests
                      name={this.state.FundingInfo.FundingTitle}
                      currentAccount={this.props.currentAccount}
                      drawsInfo={this.state.drawsInfo}
                      FundingInfo={this.state.FundingInfo}
                      vote={this.vote}
                    ></Table_requests>
                  </div>
                </Tabs.TabPane>
              </Tabs>
            </div>
            <div style={{ padding: 24, background: '#fff', minHeight: 250 }}>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            项目名称：众筹平台 开发者：李想 用途：浙江大学区块链与数字货币课程作业
      </Footer>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(Fundings_detail);
