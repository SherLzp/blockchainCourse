import React, { Component } from "react";
import {Link} from "react-router-dom";
let FundingInstance = require('./eth/Funding')
let web3 = require('./utils/InitWeb3');
let project = {}
let projects = []
let ddl = ''
let style = ''
let state = ''
let indexes = []
class my_joined_fundings extends  React.Component {
    constructor() {
        super()
        this.state = {
            accounts: ''
        }
    }
    Is_complete_style(id){
        project = projects[id]
        ddl = project.deadline
        let current_time = Date.parse(new Date())
        if(project.isSuccess === true){
            style = "badge badge-info ml-3"
        }
        else{
            if(ddl - current_time >= 0){
                style = "badge badge-warning ml-3"
            }
            else{
                style = "badge badge-secondary ml-3"
            }
        }
        return style
    }
    Is_complete(id){
        project = projects[id]
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
        return state
    }
    componentWillMount = async () => {
        projects = [] //清空数组
        //获取当前的所有地址
        let accounts = await web3.eth.getAccounts()
        let projects_number = await FundingInstance.methods.allFundingsLength().call()
        for(let i = 0; i < projects_number; i++){
            let project =await FundingInstance.methods.allFundings(i).call()
            let money = await FundingInstance.methods.getMyFundings(i).call({
                from: accounts[0]
            })
            if(money > 0){
                console.log(i)
                indexes.push(i)
                projects.push(project)
            }
        }
        this.setState({
            // manager: manager,
            accounts: accounts
        })
    };
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

                        <div className="container-fluid">
                            <div className="row">

                                <div className="col-lg-12">
                                    {
                                        (projects.length === 0)
                                            ? null
                                            : projects.map((item, index) => {
                                                return (
                                                    <div className="card mb-4 py-3 border-left-warning">
                                                        <div className="card-body">
                                                            众筹项目名称： {item.title}
                                                            <span
                                                                className={this.Is_complete_style(index)}>{this.Is_complete(index)}</span>
                                                            <Link className="btn btn-info" style={{float: "right"}}
                                                                  to={{pathname: '/my_joined_funding_detail/' + indexes[index]}}>查看详情</Link>
                                                        </div>
                                                    </div>
                                                )
                                            }, this)
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default my_joined_fundings;