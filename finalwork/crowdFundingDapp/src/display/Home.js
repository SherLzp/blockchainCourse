import React, { Component } from 'react';
import 'antd/dist/antd.css';
import {
    Row,
    Col,
    Button,
    Modal,
    Switch,
    InputNumber
  } from 'antd';
let web3 = require('../utils/InitWeb3');

let CrowdFundingContract = require('../eth/CrowdFunding');
export default class Home extends Component{
    constructor(){
        super()
        this.state={
            projects: [],
            onProjects: [],
            showOverDue: false,
            amount: 0,
        }
    }
    showOverDue = (checked) =>{
        this.setState({
            showOverDue: checked
        })
    }
    showModal = (index, on) =>{
        var projects = on===0?this.state.projects:this.state.onProjects
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
                projects: projects
            })
        }else if(on===1){
            this.setState({
                investlist: investlist,
                onProjects: projects
            })
        }
    }
    handleCancel = (index, on) =>{
        var projects = on===0?this.state.projects:this.state.onProjects
        projects[index].isModalVisible = false;
        if(on===0){
            this.setState({
                projects: projects
            })
        }else if(on===1){
            this.setState({
                onProjects: projects
            })
        }
    }
    showModal2 = (index, on) =>{
        var projects = on===0?this.state.projects:this.state.onProjects
        projects[index].isModal2Visible = true;
        if(on===0){
            this.setState({
                projects: projects
            })
        }else if(on===1){
            this.setState({
                onProjects: projects
            })
        }
    }
    handleCancel2 = (index, on) =>{
        var projects = on===0?this.state.projects:this.state.onProjects
        projects[index].isModal2Visible = false;
        if(on===0){
            this.setState({
                projects: projects
            })
        }else if(on===1){
            this.setState({
                onProjects: projects
            })
        }
    }
    changeAmount = (value) =>{
        this.setState({
            amount: value
        })
        console.log(value)
    }
    invest = async (index, on) => {
        let accounts = await web3.eth.getAccounts();
        var projects = on===0?this.state.projects:this.state.onProjects
        await CrowdFundingContract.methods.invest(projects[index].address).send({
            from: accounts[0],
            value: web3.utils.toWei(''+this.state.amount, 'ether'),
            gas: '3000000',
        })
        projects[index].isModal2Visible = false;
        if(on===0){
            this.setState({
                amount: 0,
                projects: projects
            })
        }else if(on===1){
            this.setState({
                amount: 0,
                onProjects: projects
            })
        }
        alert('投资成功，恭喜发财！')
        window.location.reload();
    }
    componentDidMount() {
    }
    async componentWillMount(){
        let projectAddresses = await CrowdFundingContract.methods.getProjects().call()
        var projects = []
        var onProjects = []
        let _now = new Date()
        let now = _now.getTime()
        for(let i=0; i<projectAddresses.length; i++){
            let project = {}
            project.address = projectAddresses[i]
            project.launcher = await CrowdFundingContract.methods.getProjectLauncher(project.address).call()
            project.title = await CrowdFundingContract.methods.getProjectTitle(project.address).call()
            project.introduction = await CrowdFundingContract.methods.getProjectIntroduction(project.address).call()
            project.amount = web3.utils.fromWei(await CrowdFundingContract.methods.getProjectAmount(project.address).call(), 'ether')
            let _deadline = await CrowdFundingContract.methods.getProjectDeadline(project.address).call()
            project.deadline = new Date (parseInt(_deadline))
            project.total =  web3.utils.fromWei(await CrowdFundingContract.methods.getProjectTotal(project.address).call(), 'ether')
            project.success = await CrowdFundingContract.methods.getProjectSuccess(project.address).call()
            project.investors = await CrowdFundingContract.methods.getProjectInvestors(project.address).call()
            project.investments = await CrowdFundingContract.methods.getProjectInvestments(project.address).call()
            project.isModalVisible = false;
            project.isModal2Visible = false;
            project.overdue = now<_deadline?false:true
            if(now<_deadline){
                onProjects[onProjects.length] = project
            }
            projects[i] = project
        }
        this.setState({
            projects: projects,
            onProjects: onProjects
        })
    }
    render(){
        const projects = this.state.projects;
        const onProjects = this.state.onProjects;
        const listItems = projects.map((project, index) =>
            <Row type="flex" justify="center" style={{"margin-top":"10px"}} key={index}>
                <Col span={3}></Col>
                <Col span={4} onClick={(event)=>{this.showModal(index, 0)}} style={{"text-align":"left"}}>{project.title}</Col>
                <Col span={3}>{project.amount}ETH</Col>
                <Col span={3}>{project.total}ETH</Col>
                <Col span={5}>{project.deadline.toLocaleString()}</Col>
                <Col span={3}><Button disabled={project.overdue||project.success} type="primary" onClick={(event)=>{this.showModal2(index, 0)}}>投资</Button></Col>
                <Col span={3}></Col>
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
                <Modal centered width={400} title="投资项目" visible={project.isModal2Visible} onOk={()=>{this.invest(index,0)}} onCancel={()=>{this.handleCancel2(index,0)}}>
                    <InputNumber min={0} defaultValue={0} /><text style={{'font-size':'large'}}>ETH</text>
                </Modal>
            </Row>
        );
        const onListItems = onProjects.map((project, index) =>
            <Row type="flex" justify="center" style={{"margin-top":"10px"}} key={project.address}>
                <Col span={3}></Col>
                <Col span={4} onClick={(event)=>{this.showModal(index, 1)}} style={{"text-align":"left"}}>{project.title}</Col>
                <Col span={3}>{project.amount}ETH</Col>
                <Col span={3}>{project.total}ETH</Col>
                <Col span={5}>{project.deadline.toLocaleString()}</Col>
                <Col span={3}><Button disabled={project.success} type="primary" onClick={(event)=>{this.showModal2(index, 1)}}>投资</Button></Col>
                <Col span={3}></Col>
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
                <Modal centered width={400} title="投资项目" visible={project.isModal2Visible} onOk={()=>{this.invest(index,1)}} onCancel={()=>{this.handleCancel2(index,1)}}>
                    <InputNumber min={0} defaultValue={0} onChange={this.changeAmount} /><text style={{'font-size':'large'}}>ETH</text>
                </Modal>
            </Row>
            
        );
        return (
            <div style={{"text-align":"center"}}>
                <Row  type="flex" justify="center" style={{"margin-top":"10px","color":'blue','font-weight':'bold','font-size':'large'}} >
                    <Col span={3}></Col>
                    <Col span={4} style={{"text-align":"left"}}>项目名</Col>
                    <Col span={3}>目标金额</Col>
                    <Col span={3}>已筹集金额</Col>
                    <Col span={5}>截止时间</Col>
                    <Col span={3}><Switch onChange={this.showOverDue}/>显示过期众筹</Col>
                    <Col span={3}></Col>
                </Row>
                {this.state.showOverDue?listItems:onListItems}
            </div>
        );
    }
}