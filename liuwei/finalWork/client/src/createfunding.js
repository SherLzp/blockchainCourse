import React, { Component } from "react";
import {Link} from "react-router-dom";
import ReactDOM from 'react-dom';
import getWeb3 from "./getWeb3";
import FundingContract from "./contracts/Funding.json";
let FundingInstance = require('./eth/Funding')
let web3 = require('./utils/InitWeb3');
class createfunding extends  React.Component {

    constructor(props){
        super(props)
        this.state={
            Name:"",
            Amount:0,
            deadline:"",
            overview:""
        }
        this.handleChange=this.handleChange.bind(this);
        this.up=this.up.bind(this);
    }
    handleChange(event){
        // 读取输入的值
        const name=event.target.name;
        const value=event.target.value;
        //   更新状态
        this.setState({
            [name]:value
        })
    }
    async up(){
        if (this.state.Name === "" || this.state.Amount === "" || this.state.deadline === "" || this.state.overview === ""){
            alert('请填写表单中的所有内容！')
        }
        else{
            let timestamp = new Date(this.state.deadline).getTime();
            console.log(timestamp);
            let a=(new Date()).toLocaleDateString();//获取当前日期
            a =a.replace(/\//g,'-');
            let current_date= (new Date(a));//把当前日期变成时间戳
            console.log(current_date)
            if(current_date - timestamp >= 0){
                alert('请选择有效的截止日期！')
            }
            else{
                let amount = web3.utils.toWei(this.state.Amount, 'ether')
                console.log(amount)
                let accounts = await web3.eth.getAccounts()
                await FundingInstance.methods.createFunding(accounts[0], this.state.Name, this.state.overview, amount, timestamp).send({
                    from: accounts[0]
                })
                alert('恭喜您，发起众筹项目成功！')
            }
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

                    <li className="nav-item active">
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

                <div className="card o-hidden border-0 shadow-lg my-5 col-10">
                    <div className="card-body p-0">
                        <div className="row">
                            <div className="col-lg-2 d-none d-lg-block"/>
                            <div className="col-lg-8">
                                <div className="p-5" id="user">
                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">发起众筹</h1>
                                    </div>
                                    <form className="user">
                                        <div className="form-group row">
                                            <div className="col-sm-6 mb-3 mb-sm-0">
                                                <input type="text" className="form-control form-control-user" name="Name" placeholder="众筹项目名称" value={this.state.Name} onChange={this.handleChange}/>
                                            </div>
                                            <div className="col-sm-6">
                                                <input type="number" min="0" className="form-control form-control-user" name="Amount" placeholder="众筹项目金额" value={this.state.Amount} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="name">众筹截止日期</label>
                                            <input type="date" className="form-control form-control-user" name="deadline" value={this.state.deadline} onChange={this.handleChange}/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="name">项目概述</label>
                                            <textarea className="form-control" rows="5" name="overview" value={this.state.overview} onChange={this.handleChange}/>
                                        </div>
                                        <a className="btn btn-primary btn-user btn-block" type='submit' onClick={this.up}>
                                            确认发起
                                        </a>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}

export default createfunding;