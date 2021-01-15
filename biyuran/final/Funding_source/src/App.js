/*前端界面参考软件需求工程的大作业*/

import React from "react";
import { Row, Col, Layout, Button, Radio, Space, Table, Progress, Modal, Form, Input, InputNumber, DatePicker, Divider, List, message, Spin, Tag, Tooltip, Descriptions } from 'antd';
import web3 from './utils/InitWeb3';
import fundingInstance from './eth/iFunding';
const { Header, Content, Footer } = Layout;
const { TextArea } = Input;

const truncate = (num) => Math.floor(100*num)/100
const openSuccessMessage = (text) => {
  message.success(text);
}
const openFailureMessage = (text) => {
  message.error(text);
}

const LaunchForm = (props) => {
    const [form] = Form.useForm();
    const onFinish = (values) => {
        props.onClick(values.name, values.specification, values.amount, values.ddl.unix())
    };
    
    const onReset = () => {
      form.resetFields();
    };
  
    return (
      <Form form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="name" label="筹款项目" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="amount" label="金额" rules={[{ required: true }]}>
          <InputNumber min={1} max={1000}/>
        </Form.Item>

        <Form.Item name="ddl" label="截至日期" rules={[{ required: true }]}>
          <DatePicker type="date" />
        </Form.Item>

        <Form.Item name="specification" label="项目描述" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              发布筹款
            </Button>
            <Button type="danger" htmlType="button" onClick={onReset}>
              清空输入
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };

const RequestForm = (props) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        props.onClick(props.idx, values.description, values.amount)
    };

    const onReset = () => {
        form.resetFields();
    };

    return(
      <Form form={form} name="control-hooks" onFinish={onFinish}> 
        <Form.Item  name="amount" label="使用数目" rules={[{required: true}]}>
          <InputNumber min={1} max={props.leftAmount}/>
        </Form.Item>
        <Form.Item  name="description" label="用途说明" rules={[{required: true}]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">申请</Button>
            <Button type="danger" htmlType="button" onClick={onReset}>清空</Button>
          </Space>
        </Form.Item>
      </Form>

  );
};

const InfoDescript = (props) => {
    const status=props.isOutdated?<Tag color="magenta">已过期</Tag>:(props.currentAmount===props.totalAmount?<Tag color="success">已完成</Tag>:<Tag color="processing">进行中</Tag>)

  return(
    <>
      <h1>本筹款项信息</h1>
      <Descriptions column={1}>
        <Descriptions.Item label="筹款项">{props.name} {status}</Descriptions.Item>
        <Descriptions.Item label="筹款金额">{props.totalAmount}</Descriptions.Item>
        <Descriptions.Item label="发起人">{props.launcher}</Descriptions.Item>
        <Descriptions.Item label="截至日期">{(new Date(props.deadline * 1000)).toLocaleDateString()}</Descriptions.Item>
        <Descriptions.Item label="筹款简介">{props.description}</Descriptions.Item>
        <Descriptions.Item label="已筹款">{props.currentAmount} ETH</Descriptions.Item>
        <Descriptions.Item label="我的投资">{props.investAmount} ETH</Descriptions.Item>
      </Descriptions>

    </>
  );
};
class InvestDisplay extends React.Component{
    constructor(props){
      super(props);
      this.state={amount:1}
      }   
    render(){
      const leftAmount=this.props.amount-this.props.currentAmount;
      return(
        <>
          <h1>我要投资</h1>
          <Form  name="control-hooks" >
            <Form.Item  name="value" label="投资数额" rules={[{required: true}]}>
              <InputNumber min={1} max={leftAmount} defaultValue={1} onChange={(value) => {this.setState({amount: value})}}/>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={() => this.props.invest(this.props.idx, this.state.amount)}>确定投资</Button>
              </Space>
            </Form.Item>
          </Form>
          <Divider></Divider>
        </>  
      )
                }
  };

class VoteDisplay extends React.Component{
    render(){
      const invested = () => (parseInt(this.props.investAmount) !== 0)
      const approved = (item) => (parseInt(item.approveVotes) >= parseInt(this.props.totalAmount)/2)//item.totalAmount
      const disapproved = (item) => (parseInt(item.disapproveVotes) > parseInt(this.props.totalAmount)/2)
      const finished = (item) => (approved(item) || disapproved(item))
      const status = (item) => (approved(item) ? <Tag color="success">通过</Tag> :(disapproved(item) ?<Tag color="magenta">否决</Tag> :<Tag color="processing">进行中</Tag>))
  
      const Buttons = (item) => [
        <Button onClick={() => {this.props.vote(this.props.idx, item.idx, true)}}>允许</Button>,
        <Button onClick={() => {this.props.vote(this.props.idx, item.idx, false)}}>拒绝</Button>
        ]
      const shownButtons = (item) =>  Buttons(item)
      
      const leftVotes = (item) => (parseInt(this.props.totalAmount) - parseInt(item.approveVotes) - parseInt(item.disapproveVotes))
      const shownText = (item) => `${item.purpose}:  ETH(${item.approveVotes}/${this.props.totalAmount})`
      return(
        <>
          <Divider></Divider>
          <h1>投资人投票</h1>
          <List
            bordered
            dataSource={this.props.requests}
            renderItem={item => (
              <List.Item actions={!finished(item) && invested && shownButtons(item)}>
                  {shownText(item)}{status(item)}
              </List.Item>
            )}
          />
          <Divider></Divider>
        </>
      )
  }
/*
render() {
  const invested = () => (parseInt(this.props.investAmount) !== 0)
  const approved = (item) => (parseInt(item.approveVotes) > parseInt(this.props.totalAmount)/2)
  const disapproved = (item) => (parseInt(item.disapproveVotes) > parseInt(this.props.totalAmount)/2)
  const finished = (item) => (approved(item) || disapproved(item))
  const tag = (item) => (approved(item) ? 
    <Tag color="success">通过</Tag> :
    (disapproved(item) ?
      <Tag color="error">否决</Tag> :
      <Tag color="processing">进行中</Tag>
    )
  )

  const votedText = "您已投过票了，无法再投"
  const votedButtons = () => [
    <Tooltip placement="top" title={votedText}>
      <Button disabled>同意</Button>
    </Tooltip>,
    <Tooltip placement="top" title={votedText}>
    <Button disabled>反对</Button>
  </Tooltip>
  ]
  const nonVotedButtons = (item) => [
    <Button onClick={() => {this.props.vote(this.props.idx, item.idx, true)}}>同意</Button>,
    <Button onClick={() => {this.props.vote(this.props.idx, item.idx, false)}}>反对</Button>
  ]
  const shownButtons = (item) => this.props.isVoted ? votedButtons() : nonVotedButtons(item)
  
  const leftVotes = (item) => (parseInt(this.props.totalAmount) - parseInt(item.approveVotes) - parseInt(item.disapproveVotes))
  const shownText = (item) => `${item.purpose}: ${item.totalAmount} ETH(${item.approveVotes}/${item.disapproveVotes}/${leftVotes(item)})`

  return (
    <>
      <Divider orientation="left">资金请求</Divider>
      <p>{`资金请求需由50%的票数批准才可通过，您的票数:${this.props.investAmount}`}</p>
      <p>括号内为(赞成/反对/未投)的票数</p>
      <List
        bordered
        dataSource={this.props.requests}
        renderItem={item => (
          <List.Item actions={!finished(item) && invested && shownButtons(item)}>
            {shownText(item)}{tag(item)}
          </List.Item>
        )}
      />
    </>
  )
}*/
}


class CreateRequestDisplay extends React.Component {
    render() {
      return (
        <>
          <Divider></Divider>
          <h1>请求资金</h1>
          <RequestForm {...this.props} onClick={this.props.request} />
        </>
      )
          }
}
class DetailPage extends React.Component {
  render() {
    const isSelf = (this.props.launcher === this.props.currentAccount)
    const isOutdated = (this.props.deadline*1000 < (new Date()).getTime())
    const finished = (this.props.currentAmount === this.props.totalAmount)
    const showInvestDisplay = (!isOutdated) && (!finished);
    const showCreateRequestDisplay = (!isOutdated) && (isSelf) && (finished);
    const showVoteDisplay = (!isOutdated) && (finished) && ((isSelf)||(parseInt(this.props.investAmount) !== 0));
    return (
      <>
        <InfoDescript {...this.props} isOutdated={isOutdated} />
        {showInvestDisplay && <InvestDisplay {...this.props}/>}
        {showCreateRequestDisplay && <CreateRequestDisplay {...this.props}/>}
        {showVoteDisplay && <VoteDisplay {...this.props}/>}
      </>
    )
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAccount: '陌生人',
      rawData: [],
      shownData: [],
      isLaunchVisible: false,
      isDetailVisible: false,
      columns: [
        {
            title: ' ',
            key: 'progress-money',
            render: (text, record) => (
              <Progress percent={truncate(100*record.currentAmount/record.totalAmount)}></Progress>
            )
        },
        {
            title: '',
            key: 'detail',
            render: (text, record) => (
              <Button onClick={() => this.openDetailView(record.key)}>点击查看</Button>
            ),
          },
        {
          title: '筹款项目',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '筹款金额',
          dataIndex: 'totalAmount',
          key: 'totalAmount',
          },
        {
          title: '发起者',
          dataIndex: 'launcher',
          key: 'launcher',
        }
      ],
      detail: {},
      requests: [],
      loading: true,
    }
    this.openDetailView = this.openDetailView.bind(this)
    this.changeShownData = this.changeShownData.bind(this)
    this.launch = this.launch.bind(this)
    this.invest = this.invest.bind(this)
    this.request = this.request.bind(this)
    this.vote = this.vote.bind(this)
  }

  async componentDidMount() {
    let accounts = await web3.eth.getAccounts()
    let counts = await fundingInstance.methods.getFundingsCount().call()
    let rawData = []
    for(let i = 0;i < counts;i++) {
      let key = i;
      let name = await fundingInstance.methods.getFundingName(i).call()
      let address = await fundingInstance.methods.getFundingAddress(i).call()
      let launcher = await fundingInstance.methods.getFundingLauncher(i).call()
      let currentAmountWei = await fundingInstance.methods.getFundingCurrentAmount(i).call()
      let currentAmount = web3.utils.fromWei(currentAmountWei, 'ether');
      let totalAmountWei = await fundingInstance.methods.getFundingTotalAmount(i).call()
      let totalAmount = web3.utils.fromWei(totalAmountWei, 'ether');
      let leftAmountWei = await fundingInstance.methods.getFundingLeftAmount(i).call()
      let leftAmount = web3.utils.fromWei(leftAmountWei, 'ether')
      let deadline = await fundingInstance.methods.getFundingDeadline(i).call()
      let description = await fundingInstance.methods.getFundingDescription(i).call()
      let investAmountWei = await fundingInstance.methods.getFundingInvestment(i, accounts[0]).call()
      let investAmount = web3.utils.fromWei(investAmountWei, 'ether')
      rawData.push({
        key: key,
        idx: key,
        name: name,
        address: address,
        launcher: launcher,
        currentAmount: currentAmount,
        totalAmount: totalAmount,
        leftAmount: leftAmount,
        deadline: deadline,
        description: description,
        investAmount: investAmount
      })
    }
    this.setState({
      currentAccount: accounts[0],
      rawData: rawData,
      shownData: rawData,
      loading: false
    })
  }

  async launch(name, description, totalAmount, deadline) {
    const currentAccount = this.state.currentAccount;
    let totalAmountWei = web3.utils.toWei(totalAmount.toString(), 'ether');
    try {
        await fundingInstance.methods.launch(name, description, totalAmountWei, deadline).send({
          from: currentAccount,
          gas: '3000000',
        })
        openSuccessMessage("筹款发布成功")
        window.location.reload()
    } catch (e) {
        openFailureMessage("筹款发布失败")
        console.log(e)
    }
  }

  async invest(key, amount) {
    const currentAccount = this.state.currentAccount
    try {
      await fundingInstance.methods.invest(key).send({
        from: currentAccount,
        value: web3.utils.toWei(amount.toString(), 'ether'),
        gas: '3000000'
      })
      openSuccessMessage("投资成功")
      window.location.reload()
    } catch(e) {
      console.log(e)
      openFailureMessage("投资失败")
    }
  }

  async request(key, purpose, amount) {
    const amountWei = web3.utils.toWei(amount.toString(), 'ether')
    const currentAccount = this.state.currentAccount
    try {
      await fundingInstance.methods.request(key, purpose, amountWei).send({
        from: currentAccount,
        gas: '3000000'
      })
      openSuccessMessage("请求成功")
      window.location.reload()
    } catch(e) {
      console.log(e)
      openFailureMessage("请求失败")
    }
  }

  async vote(i, j, approve) {
    const currentAccount = this.state.currentAccount;
    try {
      await fundingInstance.methods.vote(i, j, approve).send({
        from: currentAccount,
        gas: '3000000'
      })
      openSuccessMessage("投票成功")
      window.location.reload()
    } catch(e) {
      console.log(e)
      openFailureMessage("投票失败")
    }
  }

  async openDetailView(key) {
    let counts = await fundingInstance.methods.getFundingRequestCount(key).call()
    let requests = []
    for(let j = 0;j < counts;j++) {
      let purpose = await fundingInstance.methods.getFundingRequestPurpose(key, j).call()
      let approveVotesWei = await fundingInstance.methods.getFundingRequestApproveVotes(key, j).call()
      let approveVotes = web3.utils.fromWei(approveVotesWei.toString(), 'ether')
      let disapproveVotesWei = await fundingInstance.methods.getFundingRequestDisapproveVotes(key, j).call()
      let disapproveVotes = web3.utils.fromWei(disapproveVotesWei.toString(), 'ether')
      let totalAmountWei = await fundingInstance.methods.getFundingRequestTotalAmount(key, j).call()
      let totalAmount = web3.utils.fromWei(totalAmountWei.toString(), 'ether')
      let isVoted = await fundingInstance.methods.getFundingRequestIsVoted(key, j).call()
      requests.push({
        idx: j,
        purpose: purpose,
        approveVotes: approveVotes,
        disapproveVotes: disapproveVotes,
        totalAmount: totalAmount,
        isVoted: isVoted
      })
    }
    this.setState((state) => ({
      detail: state.rawData[key],
      requests: requests
    }))
    this.setState({isDetailVisible: true});
  }

  changeShownData(tag) {
    const rawData = this.state.rawData;
    const currentAccount = this.state.currentAccount;
    if(tag === "all") {
      this.setState({shownData: rawData})
    } else if(tag === "myLaunch") {
      this.setState({shownData: rawData.filter(item => item.launcher === currentAccount)})
    } else if(tag === "myInvest") {
      this.setState({shownData: rawData.filter(item => parseInt(item.investAmount) !== 0)})
    } else if(tag === "Unfinished") {
      this.setState({shownData: rawData.filter(item => item.currentAmount !== item.totalAmount)})
    }
  }

  render() {
    return (
      <Layout className="layout" style={{height: "100vh"}}>
        <Header>
          <Row>
            <Col span={2} style={{margin: "auto"}}><font color="white">{this.state.currentAccount}</font></Col>
            <Col span={6}></Col>
            <Col span={6}></Col>
            <Col span={6}></Col>
            <Col span={2}></Col>
          </Row>
        </Header>
        <Content style={{overflow:"auto", padding: "20px 20px"}}>
          <Spin spinning={this.state.loading} size="large">
            <Modal
              title="发布筹资"
              visible={this.state.isLaunchVisible}
              footer={null}
              onCancel={() => {this.setState({isLaunchVisible:false})}}
            >
              <LaunchForm onClick={this.launch}/>
            </Modal>
            <Modal
              title="详情和操作"
              visible={this.state.isDetailVisible}
              footer={null}
              width="600px"
              onCancel={() => {this.setState({isDetailVisible:false})}}
            >
              <DetailPage 
                {...this.state.detail}
                requests={this.state.requests}
                invest={this.invest}
                request={this.request}
                vote={this.vote}
                currentAccount={this.state.currentAccount}
              />
            </Modal>
            
            <Radio.Group size="large" onChange={e => this.changeShownData(e.target.value)} defaultValue="所有项目">
              <Radio.Button value="all">所有项目</Radio.Button>
              <Radio.Button value="myLaunch">我发起的</Radio.Button>
              <Radio.Button value="myInvest">我投资的</Radio.Button>
              <Radio.Button value="Unfinished">未完成的</Radio.Button>
              <Button size="large" type="link" style={{visibility: this.state.loading ? "hidden" : "visible"}} onClick={() => this.setState({isLaunchVisible: true})}>发布筹资</Button>
            </Radio.Group>
            <Table columns={this.state.columns} dataSource={this.state.shownData} pagination={{pageSize: 8}} />
          </Spin>
        </Content>
        <Footer style={{ backgroundColor: "rgba(0, 0, 0, 0.85)", color: "white", textAlign: 'center' }}>Funding ©2021 Created by byr</Footer>
      </Layout>
    )
  }
};
