import React, { Component } from "react";
import {Link} from "react-router-dom";
let FundingInstance = require('./eth/Funding')
let web3 = require('./utils/InitWeb3');
let project = {}
let state = ''
let ddl = ''
let proposals = []
let result = []
class my_joined_funding_detail extends  React.Component {
    constructor() {
        super();
        this.state={
            accounts: '',
            money:0,
            content:''
        }
    }
    componentWillMount = async () => {
        project = {} //清空
        proposals = []
        project = await FundingInstance.methods.allFundings(this.props.match.params.id).call()
        project.usedMoney = web3.utils.fromWei(project.usedMoney, 'ether')
        project.goalMoney = web3.utils.fromWei(project.goalMoney, 'ether');
        project.raisedMoney = web3.utils.fromWei(project.raisedMoney, 'ether')
        let proposal_length = project.proposalsLength
        for(let i = 1; i <= proposal_length; i++){
            let proposal = {
                content:'',
                amount:0,
                agreeAmount:0,
                disAmount:0,
                goal:0,
                isAgreed:false,
                p_state:'',
                my_attitude:false,
                total:0
            }
            result = []
            result = await FundingInstance.methods.getProposal(this.props.match.params.id, i).call()
            proposal.content = result[0]
            proposal.amount = result[1]
            proposal.amount = web3.utils.fromWei(proposal.amount, 'ether')
            proposal.agreeAmount = result[2]
            proposal.agreeAmount = web3.utils.fromWei(proposal.agreeAmount, 'ether')
            proposal.disAmount = result[3]
            proposal.goal = result[4]
            proposal.goal = web3.utils.fromWei(proposal.goal, 'ether')
            proposal.total = proposal.goal * 2
            proposal.isAgreed = result[5]
            console.log(proposal.isAgreed)
            if(proposal.isAgreed){
                proposal.p_state = "已批准"
            }
            else{
                proposal.p_state = "未批准"
            }
            proposals.push(proposal)
        }
        ddl = project.deadline
        let current_time = Date.parse(new Date())
        if(project.isSuccess === true){
            state = "已完成募集"
        }
        else{
            if(ddl - current_time >= 0){
                state = "募集中"
            }
            else{
                state = "项目已过期"
            }
        }
        ddl = (new Date(parseInt(ddl))).toLocaleDateString()
        let accounts = await web3.eth.getAccounts()
        this.setState({
            // manager: manager,
            accounts: accounts
        })
    };
    async up(e, value, proposal_id){
        let flag
        if(value === 1){
            flag = true
            await FundingInstance.methods.agreeProposal(this.props.match.params.id, proposal_id.index + 1, flag).send({from:this.state.accounts[0]})
            //proposals[proposal_id.index].my_attitude = true
            alert('批准申请成功!')
        }
        else{
            flag = false
            await FundingInstance.methods.agreeProposal(this.props.match.params.id, proposal_id.index + 1, flag).send({from:this.state.accounts[0]})
            //proposals[proposal_id].my_attitude = false
            alert('否决申请成功!')
        }
    }
    render() {
        return (
            <div id="wrapper">

                <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                    <a className="sidebar-brand d-flex align-items-center justify-content-center">
                        <div className="sidebar-brand-icon rotate-n-15">
                            <i className="fas fa-laugh-wink"/>
                        </div>
                        <div className="sidebar-brand-text mx-3">众筹系统 <sup>zju</sup></div>
                    </a>

                    {/*<!-- Divider -->*/}
                    {/*<hr className="sidebar-divider my-0">*/}

                    {/*// <!-- Nav Item - Dashboard -->*/}
                    <li className="nav-item">
                        <Link className="nav-link" to='/home'>
                            <i className="fas fa-fw fa-tachometer-alt"/>
                            <span>首页</span></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to='/allfundings'>
                            <i className="fas fa-fw fa-tachometer-alt"/>
                            <span>所有众筹</span></Link>
                    </li>
                    {/*<!-- Divider -->*/}
                    {/*<hr className="sidebar-divider">*/}

                    <li className="nav-item">
                        <Link className="nav-link" to='/createfunding'>
                            <i className="fas fa-fw fa-tachometer-alt"/>
                            <span>发起众筹</span></Link>
                    </li>

                    {/*<!-- Divider -->*/}
                    {/*<hr className="sidebar-divider">*/}

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo"
                           aria-expanded="true" aria-controls="collapseTwo">
                            <i className="fas fa-fw fa-tachometer-alt"/>
                            <span>我的众筹</span>
                        </a>
                        <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo"
                             data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">我的众筹:</h6>
                                <Link className="collapse-item" to="/my_launch_fundings">我发起的众筹</Link>
                                <Link className="collapse-item active" to="/my_joined_fundings">我参与的众筹</Link>
                            </div>
                        </div>
                    </li>

                </ul>

                <div id="content-wrapper" className="d-flex flex-column">


                    <div id="content">

                        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">


                            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                                <i className="fa fa-bars"/>
                            </button>

                            <form
                                className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                                <div className="input-group">
                                    <input type="text" className="form-control bg-light border-0 small"
                                           placeholder="搜索众筹项目"
                                           aria-label="Search" aria-describedby="basic-addon2"/>
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" type="button">
                                            <i className="fas fa-search fa-sm"/>
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <ul className="navbar-nav ml-auto">

                                <li className="nav-item dropdown no-arrow d-sm-none">
                                    <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fas fa-search fa-fw"/>
                                    </a>

                                    <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                         aria-labelledby="searchDropdown">
                                        <form className="form-inline mr-auto w-100 navbar-search">
                                            <div className="input-group">
                                                <input type="text" className="form-control bg-light border-0 small"
                                                       placeholder="Search for..." aria-label="Search"
                                                       aria-describedby="basic-addon2"/>
                                                <div className="input-group-append">
                                                    <button className="btn btn-primary" type="button">
                                                        <i className="fas fa-search fa-sm"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </li>


                                <li className="nav-item dropdown no-arrow">
                                    <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                                                当前账户地址：{this.state.accounts[0]}</span>
                                        <img className="img-profile rounded-circle"
                                             src="img/undraw_profile.svg"/>
                                    </a>
                                </li>

                            </ul>

                        </nav>

                        <div class="container-fluid">
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h5 className="m-0 font-weight-bold text-primary">众筹项目详情</h5>
                                    <div className="card-body">
                                        <div className="table-responsive" class="row">
                                            <div className="col-lg-12">
                                                <div className="card mb-4 py-3 border-left-success">
                                                    <div className="card-body">
                                                        <h5>众筹项目发起人：<strong>{project.initiator}</strong></h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="card mb-4 py-3 border-left-primary">
                                                    <div className="card-body">
                                                        <h5>众筹项目名称：<strong>{project.title}</strong><span className="badge badge-info ml-3">募集截止日期：{ddl}</span></h5>
                                                    </div>
                                                </div>
                                                <div className="card mb-4 py-3 border-left-secondary">
                                                    <div className="card-body">
                                                        <h5>众筹项目状态：<strong>{state}</strong></h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="card mb-4 py-3 border-left-info">
                                                    <div className="card-body">
                                                        <h5>众筹项目目标筹集资金：<strong>{project.goalMoney}eth</strong></h5>
                                                    </div>
                                                </div>
                                                <div className="card mb-4 py-3 border-left-warning">
                                                    <div className="card-body">
                                                        <h5>众筹项目可用资金：<strong>{project.raisedMoney - project.usedMoney}eth</strong></h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="card mb-4 py-3 border-left-danger">
                                                    <div className="card-body">
                                                        <h5>众筹项目已使用资金：<strong>{project.usedMoney}eth</strong></h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="card mb-4 py-3 border-left-warning">
                                                    <div className="card-body">
                                                        <h5>众筹项目投资人数：<strong>{project.fundersLength}</strong></h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="card mb-4 py-3 border-left-dark">
                                                    <div className="card-body">
                                                        <h5>众筹项目概述：</h5>
                                                        <p>
                                                            <strong>{project.content}</strong>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <div className="container-fluid">
                                        <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                            <h5 className="m-0 font-weight-bold text-primary">使用情况详情</h5>
                                        </div>
                                        <div className="col-lg-12">
                                            {
                                                (proposals.length===0)
                                                    ?null
                                                    :proposals.map((item,index)=>{
                                                        return (
                                                            <div className="card mb-4 py-3 border-left-dark">
                                                                <div className="card-header py-3">
                                                                    <a className="btn btn-success btn-icon-split" style={{float: "left"}} type="submit" onClick={ e => this.up(e,1, {index}) }>
                                                                        <span className="icon text-white-50"><i className="fas fa-check"/></span>
                                                                        <span className="text">同意</span>
                                                                    </a>&nbsp;&nbsp;&nbsp;
                                                                    <a className="btn btn-danger btn-icon-split" type="submit" onClick={ e => this.up(e,0, {index}) }>
                                                                        <span className="icon text-white-50">
                                                                            <i className="fas fa-trash"/>
                                                                        </span>
                                                                        <span className="text">拒绝</span>
                                                                    </a>
                                                                </div>
                                                                <div className="card-body">
                                                                    <div className="row">
                                                                        <div className="col-xl-6 col-md-6 mb-4">
                                                                            <div className="card border-left-success shadow h-100 py-2">
                                                                                <div className="card-body">
                                                                                    <div className="row no-gutters align-items-center">
                                                                                        <div className="col mr-2">
                                                                                            <div
                                                                                                className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                                                                申请金额
                                                                                            </div>
                                                                                            <div className="h5 mb-0 font-weight-bold text-gray-800">{item.amount}eth</div>
                                                                                        </div>
                                                                                        <div className="col-auto">
                                                                                            <i className="fas fa-dollar-sign fa-2x text-gray-300"/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-6 col-md-6 mb-4">
                                                                            <div className="card border-left-info shadow h-100 py-2">
                                                                                <div className="card-body">
                                                                                    <div className="row no-gutters align-items-center">
                                                                                        <div className="col mr-2">
                                                                                            <div
                                                                                                className="text-xs font-weight-bold text-info text-uppercase mb-1">同意百分比
                                                                                            </div>
                                                                                            <div className="row no-gutters align-items-center">
                                                                                                <div className="col-auto">
                                                                                                    <div
                                                                                                        className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{(item.agreeAmount/item.total).toFixed(4)*100}%
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col">
                                                                                                    <div className="progress progress-sm mr-2">
                                                                                                        <div className="progress-bar bg-info" role="progressbar"
                                                                                                             style={{width: (item.agreeAmount/item.total)*100 + '%'}} aria-valuenow="50"
                                                                                                             aria-valuemin="0"
                                                                                                             aria-valuemax="100"/>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-auto">
                                                                                            <i className="fas fa-clipboard-list fa-2x text-gray-300"/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-12 col-md-6 mb-4">
                                                                            <div className="card border-left-warning shadow h-100 py-2">
                                                                                <div className="card-body">
                                                                                    <div className="row no-gutters align-items-center">
                                                                                        <div className="col mr-2">
                                                                                            <div
                                                                                                className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                                                                使用说明
                                                                                            </div>
                                                                                            <div className="h5 mb-0 font-weight-bold text-gray-800">{item.content}</div>
                                                                                        </div>
                                                                                        <div className="col-auto">
                                                                                            <i className="fas fa-comments fa-2x text-gray-300"/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    },this)
                                            }
                                        </div>

                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default my_joined_funding_detail;