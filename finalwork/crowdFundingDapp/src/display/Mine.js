import React, { Component } from 'react';
import 'antd/dist/antd.css';
import {
    Row,
    Col,
    Button,
    Modal,
    Form,
    Input,
    InputNumber
  } from 'antd';
let web3 = require('../utils/InitWeb3');
let CrowdFundingContract = require('../eth/CrowdFunding');

export default class Mine extends Component{
    constructor(){
        super();
        this.state={
            myinvestments: [],
            mylaunches: [],
            amount: 0,
            purpose: ''
        }
    }
    handleCancel = (index, on) =>{
        var projects = on===0?this.state.mylaunches:this.state.myinvestments
        projects[index].isModalVisible = false;
        if(on===0){
            this.setState({
                mylaunches: projects
            })
        }else if(on===1){
            this.setState({
                myinvestments: projects
            })
        }
    }
    showModal = (index, on) =>{
        var projects = on===0?this.state.mylaunches:this.state.myinvestments
        projects[index].isModalVisible = true;
        var project = projects[index]
        var invests = []
        for(let i=0;i<project.investors.length;i++){
            invests[i] = {investor: project.investors[i], investment: web3.utils.fromWei( project.investments[i])}
        }
        const investlist = invests.map((invest, index) =>
            <Row>
                <Col span={18}>{invest.investor}</Col>
                <Col span={6}>{invest.investment}ETH</Col>
            </Row>
        )
        if(on===0){
            this.setState({
                investlist: investlist,
                mylaunches: projects
            })
        }else if(on===1){
            this.setState({
                investlist: investlist,
                myinvestments: projects
            })
        }
    }
    vote = async( address ,index , approval) =>{
        try{
            let accounts = await web3.eth.getAccounts();
            await CrowdFundingContract.methods.vote(address, index, approval).send({
                from: accounts[0],
                // value: web3.utils.toWei('1', 'ether'),
                gas: '3000000',
            })
            window.location.reload()
        }catch(e){
            console.log(e)
            alert('投票失败')
        }
    }
    showModal2 = async (_index, on, choice) =>{
        console.log('here',on, choice)
        let projects = this.state.mylaunches
        if(on===1) projects = this.state.myinvestments
        projects[_index].isModal2Visible = choice
        let project = projects[_index]
        let count = await CrowdFundingContract.methods.getProjectRequestCount(project.address).call()
        let accounts = await web3.eth.getAccounts();
        let requests = []
        let myinvestment = 0
        for(let i=0; i<project.investors.length; i++){
            if(project.investors[i]===accounts[0]){
                myinvestment = web3.utils.fromWei(project.investments[i])
                break
            }
        }
        for(let i=0;i<count;i++){
            let request = {}
            request.purpose = await CrowdFundingContract.methods.getProjectRequestPurpose(project.address,i).call()
            request.amount = web3.utils.fromWei(await CrowdFundingContract.methods.getProjectRequestAmount(project.address,i).call())
            request.voting = await CrowdFundingContract.methods.getProjectRequestVoting(project.address,i).call()
            request.passed = await CrowdFundingContract.methods.getProjectRequestPassed(project.address,i).call()
            request.leastvotes = web3.utils.fromWei(await CrowdFundingContract.methods.getProjectRequestLeastVotes(project.address,i).call())
            request.votes = web3.utils.fromWei(await CrowdFundingContract.methods.getProjectRequestVotes(project.address,i).call())
            request.voters = await CrowdFundingContract.methods.getProjectRequestVoters(project.address,i).call()
            request.isAgree = await CrowdFundingContract.methods.getProjectRequestVoteResult(project.address,i).call()
            if(request.passed===true) request.status = "已通过"
            else if(request.voting===true) request.status = "正在投票"
            else request.status = "未通过"
            request.ivoted = false
            request.btn = "投"+ myinvestment +"票"
            for(let j=0; j<request.voters.length; j++){
                if(request.voters[j]===accounts[0]){
                    request.ivoted = true
                    request.btn = request.isAgree[j]?"已支持":"已反对"
                    break;
                }
            }
            requests[requests.length] = request
        }
        if(on===1){
            console.log('pro',projects)
            let requestList = requests.map((request, index) =>
            <Row style={{'margin-top':'10px'}}>
                <Col span={8}> {request.purpose} </Col>
                <Col span={3}> {request.amount}ETH </Col>
                <Col span={3}> {request.leastvotes}票</Col>
                <Col span={3}> {request.votes}票 </Col>
                <Col span={3}> {request.status} </Col>
                <Col span={2}> <Button type="primary" disabled={request.ivoted} onClick={()=>{this.vote(project.address,index,true)}}>{request.btn}</Button> </Col>
                <Col span={2}> <Button type="primary" disabled={request.ivoted} onClick={()=>{this.vote(project.address,index,false)}}>反对</Button> </Col>
            </Row>
            )
            this.setState({
                myinvestments: projects,
                requestList: requestList
            })
        }else if(on===0){
            console.log('pro',projects)
            let requestList = requests.map((request) =>
            <Row style={{'margin-top':'10px'}}>
                <Col span={8}> {request.purpose} </Col>
                <Col span={4}> {request.amount}ETH </Col>
                <Col span={4}> {request.leastvotes}票</Col>
                <Col span={4}> {request.votes}票 </Col>
                <Col span={4}> {request.status} </Col>
            </Row>)
            this.setState({
                mylaunches: projects,
                requestList: requestList
            }, ()=>{
                console.log(this.state.mylaunches)
                console.log(this.state.myinvestments)
            })
        }
    }
    showModal3 = (index, choice) =>{
        let mylaunches = this.state.mylaunches
        mylaunches[index].isModal3Visible = choice
        this.setState({
            mylaunches: mylaunches
        })
    }
    In = (me, investors) =>{
        for(let i=0; i<investors.length;i++ ){
            if(me===investors[i])return true
        }
        return false
    }
    handlePurpose = (e) =>{
        this.setState({
            purpose: e.target.value
        })
    }
    handleAmount = (value) =>{
        this.setState({
            amount: value
        })
    }
    request = async (index) =>{
        let mylaunches = this.state.mylaunches
        let project = this.state.mylaunches[index]
        let accounts = await web3.eth.getAccounts();
        if(accounts[0]!==project.launcher){
            alert('只有项目发起人可以提出请求')
            return
        }
        if(!project.success){
            alert('该项目尚未集资成功！')
            return
        }
        try{
            let amount = web3.utils.toWei(''+this.state.amount, 'ether')
            await CrowdFundingContract.methods.request(project.address, this.state.purpose, amount).send({
                from: accounts[0],
                // value: web3.utils.toWei('1', 'ether'),
                gas: '3000000',
            })
            alert('发布请求成功！')
            mylaunches[index].isModal3Visible = false
            this.setState({
                mylaunches: mylaunches
            })
        }catch(e){
            console.log(e)
            alert('发布请求失败！')
        }
    }
    componentDidMount() {
    }
    async componentWillMount(){
        let projectAddresses = await CrowdFundingContract.methods.getProjects().call()
        var mylaunches = []
        var myinvestments = []
        let accounts = await web3.eth.getAccounts();
        let me = accounts[0]
        let _now = new Date()
        let now = _now.getTime()
        for(let i=0; i<projectAddresses.length; i++){
            let project = {}
            project.address = projectAddresses[i]
            project.launcher = await CrowdFundingContract.methods.getProjectLauncher(project.address).call()
            project.investors = await CrowdFundingContract.methods.getProjectInvestors(project.address).call()
            let _in = this.In(me,project.investors)
            if(me!==project.launcher&&!_in)
                continue;
            project.investments = await CrowdFundingContract.methods.getProjectInvestments(project.address).call()
            project.title = await CrowdFundingContract.methods.getProjectTitle(project.address).call()
            project.introduction = await CrowdFundingContract.methods.getProjectIntroduction(project.address).call()
            project.amount = web3.utils.fromWei(await CrowdFundingContract.methods.getProjectAmount(project.address).call(), 'ether')
            let _deadline = await CrowdFundingContract.methods.getProjectDeadline(project.address).call()
            project.deadline = new Date (parseInt(_deadline))
            project.total =  web3.utils.fromWei(await CrowdFundingContract.methods.getProjectTotal(project.address).call(), 'ether')
            project.balance = web3.utils.fromWei(await CrowdFundingContract.methods.getProjectBalance(project.address).call(), 'ether')
            project.success = await CrowdFundingContract.methods.getProjectSuccess(project.address).call()
            project.isModalVisible = false;
            project.isModal2Visible = false;
            project.isModal3Visible = false;
            project.overdue = now<_deadline?false:true
            if(project.success)project.status = "集资成功"
            else if(project.overdue) project.status = "集资失败"
            else project.status = "正在集资"
            if(me===project.launcher)    mylaunches[mylaunches.length] = project
            if(_in){
                let _project = {}
                let key
                for ( key in project){
                    _project[key] = project[key]
                }
                myinvestments[myinvestments.length] = _project
            } 
        }
        this.setState({
            myinvestments: myinvestments,
            mylaunches: mylaunches
        })
    }
    render(){
        const mylaunches = this.state.mylaunches;
        const myinvestments = this.state.myinvestments;
        const myLaunches = mylaunches.map((project, index) =>
            <Row type="flex" justify="center" style={{"margin-top":"10px"}} key={index}>
                <Col span={4}></Col>
                <Col span={4} style={{"text-align":"left"}} onClick={(event)=>{this.showModal(index, 0)}}>{project.title}</Col>
                <Col span={2}>{project.amount}ETH</Col>
                <Col span={2}>{project.total}ETH</Col>
                <Col span={2}>{project.balance}ETH</Col>
                <Col span={2}>{project.status}</Col>
                <Col span={2}><Button type="primary" onClick={()=>{this.showModal2(index,0,true)}}>查看请求</Button></Col>
                <Col span={2}><Button type="primary" disabled={!project.success} onClick={()=>{this.showModal3(index,true)}}>发起请求</Button></Col>
                <Col span={4}></Col> 
                <Modal centered width={1000} title="项目详情" visible={project.isModalVisible} onOk={()=>{this.handleCancel(index,0)}} onCancel={()=>{this.handleCancel(index,0)}}>
                    <Row type="flex" justify="center" style={{"margin-top":"10px"}}>
                        <Col span={8}>项目地址</Col>
                        <Col span={16}>{project.address}</Col>
                    </Row>
                    <Row type="flex" justify="center" style={{"margin-top":"10px"}}>
                        <Col span={8}>发起人</Col>
                        <Col span={16}>{project.launcher}</Col>
                    </Row>
                    <Row type="flex" justify="center" style={{"margin-top":"10px"}}>
                        <Col span={8}>项目介绍</Col>
                        <Col span={16}>{project.introduction}</Col>
                    </Row>
                    <Row type="flex" justify="center" style={{"margin-top":"10px"}}>
                        <Col span={8}>投资人列表</Col>
                        <Col span={16}>{this.state.investlist}</Col>
                    </Row>
                </Modal>
                <Modal centered width={800} title="发起请求" visible={project.isModal3Visible} onOk={()=>{this.request(index)}} onCancel={()=>{this.showModal3(index,false)}}>
                    <Form
                        labelCol={{
                                span: 4,
                            }}
                            wrapperCol={{
                                span: 14,
                            }}
                        layout="horizontal">
                        <Form.Item label="使用目的" name="purpose" rules={[{ required: true, message: '请说明使用目的!', }, ]}>
                          <Input onChange={this.handlePurpose}/>
                        </Form.Item>
                        <Form.Item label="使用金额" name="amount" rules={[{ required: true, message: '请说明使用金额!', }, ]}>
                            <Form.Item name="input-number"  noStyle >
                                <InputNumber min={1} onChange={this.handleAmount}/>
                            </Form.Item>
                            <span className="ant-form-text"> ETH </span>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal centered width={1000} title="请求列表" visible={project.isModal2Visible} onOk={()=>{this.showModal2(index,0,false)}} onCancel={()=>{this.showModal2(index,0,false)}}>
                    <Row style={{"color":'green','font-weight':'bold','font-size':'larger'}}>
                        <Col span={8}> 使用目的 </Col>
                        <Col span={4}> 使用金额 </Col>
                        <Col span={4}> 最少票数</Col>
                        <Col span={4}> 已获得票数 </Col>
                        <Col span={4}> 请求状态 </Col>
                    </Row>
                    {this.state.requestList}
                </Modal>         
            </Row>
        );
        const myInvestments = myinvestments.map((project, index) =>
            <Row type="flex" justify="center" style={{"margin-top":"10px"}} key={index}>
                <Col span={4}></Col>
                <Col span={4} style={{"text-align":"left"}}  onClick={(event)=>{this.showModal(index, 0)}}>{project.title}</Col>
                <Col span={2}>{project.amount}ETH</Col>
                <Col span={2}>{project.total}ETH</Col>
                <Col span={2}>{project.balance}ETH</Col>
                <Col span={2}>{project.status}</Col>
                <Col span={2}><Button type="primary" onClick={()=>{this.showModal2(index,1,true)}}>查看请求</Button></Col>
                <Col span={6}></Col>               
                <Modal centered width={1000} title="项目详情" visible={project.isModalVisible} onOk={()=>{this.handleCancel(index,1)}} onCancel={()=>{this.handleCancel(index,1)}}>
                    <Row type="flex" justify="center" style={{"margin-top":"10px"}}>
                        <Col span={8}>项目地址</Col>
                        <Col span={16}>{project.address}</Col>
                    </Row>
                    <Row type="flex" justify="center" style={{"margin-top":"10px"}}>
                        <Col span={8}>发起人</Col>
                        <Col span={16}>{project.launcher}</Col>
                    </Row>
                    <Row type="flex" justify="center" style={{"margin-top":"10px"}}>
                        <Col span={8}>项目介绍</Col>
                        <Col span={16}>{project.introduction}</Col>
                    </Row>
                    <Row type="flex" justify="center" style={{"margin-top":"10px"}}>
                        <Col span={8}>投资人列表</Col>
                        <Col span={16}>{this.state.investlist}</Col>
                    </Row>
                </Modal>
                <Modal centered width={1000} title="请求列表" visible={project.isModal2Visible} onOk={()=>{this.showModal2(index,1,false)}} onCancel={()=>{this.showModal2(index,1,false)}}>
                    <Row style={{"color":'green','font-weight':'bold','font-size':'larger'}}>
                    <Col span={8}> 使用目的 </Col>
                    <Col span={3}> 使用金额 </Col>
                    <Col span={3}> 最少票数</Col>
                    <Col span={3}> 已获得票数 </Col>
                    <Col span={3}> 请求状态 </Col>
                    <Col span={2}> 投支持票 </Col>
                    <Col span={2}> 投反对票 </Col>
                    </Row>
                    {this.state.requestList}
                </Modal> 
            </Row>
        );
        return (<div style={{"text-align":"center"}}>
        <div><h2 align="left" style={{"margin-left":"180px"}}>我创建的项目</h2></div>
        <Row  type="flex" justify="center" style={{"margin-top":"10px","color":'blue','font-weight':'bold','font-size':'large'}} >
            <Col span={4}></Col>
            <Col span={4} style={{"text-align":"left"}}>项目名</Col>
            <Col span={2}>目标金额</Col>
            <Col span={2}>筹集金额</Col>
            <Col span={2}>剩余金额</Col>
            <Col span={2}>项目状态</Col>
            <Col span={2}>查看请求</Col>
            <Col span={2}>发起请求</Col>
            <Col span={4}></Col>
        </Row>
        {myLaunches}
        <div  align="left" style={{"margin-left":"180px","margin-top":"20px"}}><h2>我投资的项目</h2></div>
        <Row  type="flex" justify="center" style={{"margin-top":"10px","color":'blue','font-weight':'bold','font-size':'large'}} >
            <Col span={4}></Col>
            <Col span={4} style={{"text-align":"left"}}>项目名</Col>
            <Col span={2}>目标金额</Col>
            <Col span={2}>筹集金额</Col>
            <Col span={2}>剩余金额</Col>
            <Col span={2}>项目状态</Col>
            <Col span={2}>查看请求</Col>
            <Col span={2}></Col>
            <Col span={4}></Col>
        </Row>
        {myInvestments}
        </div>);
        
    }
}