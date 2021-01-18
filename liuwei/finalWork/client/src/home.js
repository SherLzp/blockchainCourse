import React, { Component } from "react";
import "./App.css";
import {Link, NavLink, Redirect, Route, Router, Switch} from "react-router-dom";
let web3 = require('./utils/InitWeb3');
let FundingInstance = require('./eth/Funding')
let projects = []
let count_ongoing = 0
let finished = 0
let projects_number = 0
class home extends Component {
    constructor() {
        super()
        this.state = {
            accounts: ''
        }
    }

    componentWillMount = async () => {
        //获取当前的所有地址
        count_ongoing = 0
        finished = 0
        let accounts = await web3.eth.getAccounts()
        let temp = await FundingInstance.methods.getBalance().call()
        temp = await web3.utils.fromWei(temp, 'ether')
        console.log(temp)
        projects_number = await FundingInstance.methods.allFundingsLength().call()
        let current_time = Date.parse(new Date())
        for(let i = 0; i < projects_number; i++){
            let project = await FundingInstance.methods.allFundings(i).call()
            if (project.isSuccess === true){
                finished += 1
            }
            else{
                count_ongoing += 1
            }
            projects.push(project)
        }
        this.setState({
            // manager: manager,
            accounts: accounts
        })
    };
    render() {
        return (
            <div>
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
                        <li className="nav-item  active">
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
                                    <Link className="collapse-item" to="/my_joined_fundings">我参与的众筹</Link>
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


                                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                    <h1 className="h3 mb-0 text-gray-800">网站总览</h1>
                                    <a href="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                        className="fas fa-download fa-sm text-white-50"/>导出报告</a>
                                </div>

                                <div className="row">
                                    <div className="col-xl-4 col-md-6 mb-4">
                                        <div className="card border-left-success shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div
                                                            className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                            总项目数
                                                        </div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{projects_number}</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="fas fa-dollar-sign fa-2x text-gray-300"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="col-xl-4 col-md-6 mb-4">
                                        <div className="card border-left-info shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div
                                                            className="text-xs font-weight-bold text-info text-uppercase mb-1">已筹项目数
                                                        </div>
                                                        <div className="row no-gutters align-items-center">
                                                            <div className="col-auto">
                                                                <div
                                                                    className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{finished}
                                                                </div>
                                                            </div>
                                                            <div className="col">
                                                                <div className="progress progress-sm mr-2">
                                                                    <div className="progress-bar bg-info" role="progressbar"
                                                                         style={{width: (finished/projects_number)*100 + '%'}} aria-valuenow="50"
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


                                    <div className="col-xl-4 col-md-6 mb-4">
                                        <div className="card border-left-warning shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div
                                                            className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                            在筹项目数
                                                        </div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{count_ongoing}</div>
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



                        <footer className="sticky-footer bg-white">
                            <div className="container my-auto">
                                <div className="copyright text-center my-auto">
                                    <span>Copyright &copy; ZJU-73 2021</span>
                                </div>
                            </div>
                        </footer>


                    </div>


                </div>
                <script src="vendor/jquery/jquery.min.js"/>
                <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"/>
                <script src="vendor/jquery-easing/jquery.easing.min.js"/>
                <script src="js/sb-admin-2.min.js"/>
                <script src="vendor/chart.js/Chart.min.js"/>
                <script src="js/demo/chart-area-demo.js"/>
                <script src="js/demo/chart-pie-demo.js"/>
            </div>
        );
    }
}

export default home;
