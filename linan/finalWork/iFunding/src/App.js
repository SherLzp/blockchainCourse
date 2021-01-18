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
    props.onClick(values.name, values.description, values.totalAmount, values.deadline.unix())
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item name="name" label="名称" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="介绍" rules={[{ required: true }]}>
        <TextArea />
      </Form.Item>
      <Form.Item name="totalAmount" label="金额" rules={[{ required: true }]}>
        <InputNumber min={1}/>
      </Form.Item>
      <Form.Item name="deadline" label="到期日" rules={[{ required: true }]}>
        <DatePicker type="date" />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            发起众筹
          </Button>
          <Button htmlType="button" onClick={onReset}>
            重置参数
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

const RequestForm = (props) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    props.onClick(props.idx, values.purpose, values.totalAmount)
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item name="purpose" label="目的" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="totalAmount" label="金额" rules={[{ required: true }]}>
        <InputNumber
          min={1}
          max={props.leftAmount}
        />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            发起请求
          </Button>
          <Button htmlType="button" onClick={onReset}>
            重置参数
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

const BasicInfo = (props) => {
  const tag = props.isOutdated
    ? <Tag color="error">到期</Tag>
    : (
      props.currentAmount === props.totalAmount
        ? <Tag color="success">完成</Tag>
        : <Tag color="processing">进行中</Tag>
    )
  return (
    <>
      <Divider orientation="left">基本信息</Divider>
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="名称">{props.name}</Descriptions.Item>
        <Descriptions.Item label="状态">{tag}</Descriptions.Item>
        <Descriptions.Item label="地址">{props.address}</Descriptions.Item>
        <Descriptions.Item label="发起人">{props.launcher}</Descriptions.Item>
        <Descriptions.Item label="集资进度">{`${props.currentAmount} ETH/${props.totalAmount} ETH`}</Descriptions.Item>
        <Descriptions.Item label="我的投资额度">{props.investAmount} ETH</Descriptions.Item>
        <Descriptions.Item label="到期时间">{(new Date(props.deadline * 1000)).toLocaleDateString()}</Descriptions.Item>
        <Descriptions.Item label="详细信息">{props.description}</Descriptions.Item>
      </Descriptions>
    </>
  )
}
class InvestView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 1
    }
  }

  render() {
    const leftAmount = this.props.totalAmount - this.props.currentAmount;
    return (
      <>
        <Divider orientation="left">投资</Divider>
        <p>{`投资金额不可超过剩余集资金额(${leftAmount} ETH)`}</p>
        <Space>
          <InputNumber
            min={1}
            max={leftAmount}
            defaultValue={1}
            onChange={(value) => {this.setState({amount: value})}}
          />
          <Button
            type="primary"
            onClick={() => this.props.invest(this.props.idx, this.state.amount)}
          >
            投资
          </Button>
        </Space>
      </>
    )
  }
}
class RequestView extends React.Component {
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
  }
}
class CreateRequestView extends React.Component {
  render() {
    return (
      <>
        <Divider orientation="left">发起资金请求</Divider>
        <p>{`请求金额不可超过当前资金池(${this.props.leftAmount} ETH)`}</p>
        <RequestForm {...this.props} onClick={this.props.request} />
      </>
    )
  }
}
class DetailPage extends React.Component {
  render() {
    const isOutdated = (this.props.deadline*1000 < (new Date()).getTime())
    const finished = (this.props.currentAmount === this.props.totalAmount)
    const showInvestView = (!isOutdated) && (!finished);
    const showCreateRequestView = (!isOutdated) && (this.props.launcher === this.props.currentAccount) && (finished);
    const showRequestView = (!isOutdated) && (finished) && ((parseInt(this.props.investAmount) !== 0) || (this.props.launcher === this.props.currentAccount));
    return (
      <>
        <BasicInfo {...this.props} isOutdated={isOutdated} />
        {!isOutdated && showInvestView && <InvestView {...this.props}/>}
        {!isOutdated && showCreateRequestView && <CreateRequestView {...this.props}/>}
        {!isOutdated && showRequestView && <RequestView {...this.props}/>}
      </>
    )
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAccount: '未登录的游客',
      rawData: [],
      shownData: [],
      isLaunchVisible: false,
      isDetailVisible: false,
      columns: [
        {
          title: '项目名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '发起人',
          dataIndex: 'launcher',
          key: 'launcher',
        },
        {
          title: '集资进度',
          key: 'progress-money',
          render: (text, record) => (
            <Progress percent={truncate(100*record.currentAmount/record.totalAmount)}></Progress>
          )
        },
        {
          title: '到期时间',
          dataIndex: 'deadline',
          key: 'progress-time',
          render: deadline => (
            <p>{(new Date(deadline * 1000)).toLocaleDateString()}</p>
          )
        },
        {
          title: '查看详情',
          key: 'detail',
          render: (text, record) => (
            <Button onClick={() => this.openDetailView(record.key)}>查看详情</Button>
          ),
        },
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
        openSuccessMessage("发布成功")
        window.location.reload()
    } catch (e) {
        openFailureMessage("发布失败")
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
    if(tag === "所有项目") {
      this.setState({shownData: rawData})
    } else if(tag === "我发起的项目") {
      this.setState({shownData: rawData.filter(item => item.launcher === currentAccount)})
    } else if(tag === "我投资的项目") {
      this.setState({shownData: rawData.filter(item => parseInt(item.investAmount) !== 0)})
    } else if(tag === "未完成的项目") {
      this.setState({shownData: rawData.filter(item => item.currentAmount !== item.totalAmount)})
    }
  }

  render() {
    return (
      <Layout className="layout" style={{height: "100vh"}}>
        <Header>
          <Row>
            <Col span={6}><img src="http://course.zju.edu.cn/img/user/logo.png" alt="" /></Col>
            <Col span={6}></Col>
            <Col span={6}></Col>
            <Col span={4}></Col>
            <Col span={2} style={{margin: "auto"}}><Button type="primary" style={{visibility: this.state.loading ? "hidden" : "visible"}} onClick={() => this.setState({isLaunchVisible: true})}>发布众筹</Button></Col>
          </Row>
        </Header>
        <Content style={{overflow:"auto", padding: "20px 20px"}}>
          <Spin spinning={this.state.loading} size="large">
            <Modal
              title="发布众筹"
              visible={this.state.isLaunchVisible}
              footer={null}
              onCancel={() => {this.setState({isLaunchVisible:false})}}
            >
              <LaunchForm onClick={this.launch}/>
            </Modal>
            <Modal
              title="众筹详情"
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
            <p>{this.state.currentAccount}: 欢迎使用iFunding！</p>
            <Radio.Group size="large" onChange={e => this.changeShownData(e.target.value)} defaultValue="所有项目">
              <Radio.Button value="所有项目">所有项目</Radio.Button>
              <Radio.Button value="我发起的项目">我发起的项目</Radio.Button>
              <Radio.Button value="我投资的项目">我投资的项目</Radio.Button>
              <Radio.Button value="未完成的项目">未完成的项目</Radio.Button>
            </Radio.Group>
            <Table columns={this.state.columns} dataSource={this.state.shownData} pagination={{pageSize: 8}} />
          </Spin>
        </Content>
        <Footer style={{ backgroundColor: "rgba(0, 0, 0, 0.85)", color: "white", textAlign: 'center' }}>iFunding ©2021 Created by NessOffice</Footer>
      </Layout>
    )
  }
};
