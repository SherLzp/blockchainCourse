import project from '../abi/project';
import React, { Component } from 'react';
import { Collapse } from 'antd';
import platform from '../abi/platform'
import { Button } from 'antd';
import { RightCircleTwoTone } from '@ant-design/icons';
import { Typography, Space, Descriptions, Badge, InputNumber, Row, Col, Progress, Input, Modal } from 'antd';
import contribute from '../utils/contribute'
import web3 from '../utils/web3'
import createProposal from '../utils/createProposal'

const { Text, Link } = Typography;
const { Panel } = Collapse;



// get all the projects from the platform
let GetProjectList = async() => {
  let p = await platform.methods.returnAllProjects().call();
  return p;
}

// get one project
let GetProject = async(addresses, account, fun) => {
    let L = [];
    for (var i = 0; i < addresses.length; i++) {
      const instance = project(addresses[i]);
      let res = await instance.methods.getDetails().call();
      L.push(res);
    }
    return L;
}

const State = ['ongoing', 'success', 'failed'];
const TextCol = ['warning', 'success', 'danger']

class ProjectList extends Component{
    constructor(props) {
        super(props);
        this.state = {
          projects:[],
          addresses: [],
          value: 0,
          account: '',
          use: 0,
          des: '',
          proposal: '',
        };
    }
    updateState = async () => {
        let accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        let projects = await GetProjectList();
        let L = await GetProject(projects, account, this.props.function);
        this.setState({projects: L});
        this.setState({addresses: projects});
        this.setState({account: account});
    }

    
    async componentDidMount() {
        let accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        let projects = await GetProjectList();
        let L = await GetProject(projects, account, this.props.function);
        this.setState({projects: L});
        this.setState({addresses: projects});
        this.setState({account: account});
        /*
        let shit = await GetProject(projects[1]);
        console.log(shit);
        this.setState({projectTitle: shit['projectTitle']});
        */
    }
    getProposals = async (address) => {
      this.updateState();
      let accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      let instance = project(address);
      let detail = await instance.methods.getDetails().call();
      //if (detail.hasCon) {
      let proposal = await instance.methods.proposals(0).call();
      //}
      this.setState({proposal: proposal});
     Modal.info({
       title: 'Proposal Detail',
       content: (
         <div>
         <Text type='secondary'>Amount:</Text>
         <Text>{proposal.amount}</Text>
         <br/>
         <Text type='secondary'>Usage:</Text>
         <Text>{proposal.usage}</Text>
         <br/>
         <Text type='secondary'>State:</Text>
         <Text type={TextCol[proposal.PState]}>{State[proposal.PState]}</Text>
         <Progress percent={Math.floor(proposal.approval*2/proposal.amount*100)} status='active'></Progress>
         </div>
       ),
       async onOk() {
         console.log('test');
         await instance.methods.approveProposal(0).send({
           from: account,
         })
         console.log('test');
       },
     });
    }



    isCreator = (address) => {
      return this.state.account == address;
    }
    setValue = (value) => {
      this.setState({value: value});
    }

    setUse = (value) => {
      this.setState({use: value});
    }

    setDes = (e) => {
      this.setState({des: e.target.value});
    }

    timestampToTime=(timestamp)=> {
      var date = new Date(timestamp * 1000);
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      var m = date.getMinutes() + ':';
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
  }

    render() {
        let L = this.state.projects;
        let res = [];
        for (var i = 0; i < L.length; i++) {
          if (this.props.function==1) {
            if (this.state.account==L[i].projectStarter){
              res.push(L[i]);
            }
          } else if (this.props.function==0){
            res.push(L[i]);
          } else {
            if (L[i].hasCon) {
              res.push(L[i]);
            }
          }
        }

        return (
          // the address of each project is addresses[i]
        <Collapse defaultActiveKey={['1']} expandIconPosition="right">
          {res.map((el, index) => (
              <Panel header={"Project Title: "+el.projectTitle} key={index} expandIcon={({ isActive }) => <RightCircleTwoTone rotate={isActive ? 90 : 0} />}>
              <Descriptions title="Project Info" bordered>
              <Descriptions.Item label="Project Name" span={3}>{el.projectTitle}</Descriptions.Item>
              <Descriptions.Item label="Project Creator">{el.projectStarter}</Descriptions.Item>
              <Descriptions.Item label="Deadline" span={2}>{this.timestampToTime(el.Deadline)}</Descriptions.Item>
              <Descriptions.Item label="Goal" span={3}>{el.goalAmount}</Descriptions.Item>
              <Descriptions.Item label="Current Amount" span={3}>
              {el.current}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={3}>
                <Text type={TextCol[el.currentState]}>{State[el.currentState > 2? el.currentState-3: el.currentState]}</Text>
                <br/>
                <Progress percent={Math.floor(el.current*100/el.goalAmount)} status='active' />
              </Descriptions.Item>
              <Descriptions.Item label="Project Description">
              {el.projectDesc}
              </Descriptions.Item>
              </Descriptions>
              <br/>
              <Text type='secondary'>Amount to contribute:</Text>
              <Row>
              <InputNumber min='1' onChange={this.setValue}/>
              <Col span={19}></Col>
              <Button type='primary' onClick={() => contribute(this.state.addresses[index],this.state.value)} disabled={this.isCreator(el.projectStarter) ? true : el.currentState!=0}>
                Contribute
              </Button>
              <Text type='danger'>{this.isCreator(el.projectStarter) ? 'You can not contribute to your own project!' : ''}</Text>
              </Row>
              <br/>
              <Text>Proposal:</Text>
              <Row>
              <Text type='secondary'>Amount to use:</Text>
              </Row>
              <Row>
              <InputNumber min='1' onChange={this.setUse}/>
              </Row>
              <Row>
              <br/>
              <Text type='secondary'>Description:</Text>
              <br/>
              <Input.TextArea onChange={e=>this.setDes(e)}/>
              </Row>
              <br/>
              <Row>
              <Col span={22}></Col>
              <Button type='primary' onClick={()=>createProposal(this.state.addresses[index], this.state.des, this.state.use)} disabled={!this.isCreator(el.projectStarter)||el.currentState!=1}>
                draw
              </Button>
              <Text type='danger'>{this.isCreator(el.projectStarter) ? '' : 'You are not the creator of the project!'}</Text>
              <br/>
              <br/>
              <br/>
              <Button type='primary' onClick={()=>this.getProposals(this.state.addresses[index])} disabled={!el.hasCon} block>Show proposals</Button>
              <Text type='danger'>{el.hasCon ? '': 'You have not funded the project!'}</Text>
              </Row>
              </Panel>
          ))}
        </Collapse>
        )
    }
}

export default ProjectList;