import React, { Component } from 'react';
import 'antd/dist/antd.css';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  TimePicker,
  DatePicker,
  InputNumber,
} from 'antd';

let web3 = require('../utils/InitWeb3');
let CrowdFundingContract = require('../eth/CrowdFunding');

export default class Create extends Component{
    constrcutor(){
        this.setState({
            title: '',
            introduction: '',
            amount: 0,
            date: '',
            time: ''
        })
    }
    handleTitle = (e) =>{
        this.setState({
            title: e.target.value
        })
    }
    handleIntro = (e) =>{
        this.setState({
            introduction: e.target.value
        })
    }
    handleAmount = (value) =>{
        this.setState({
            amount: value
        })
    }
    handleDate = (Date, DateString) =>{
        this.setState({
            date: DateString
        })
    }
    handleTime = (Time, TimeString) => {
        this.setState({
            time: TimeString
        })
    }
    launch = async () =>{
        console.log(this.state.amount, typeof(this.state.amount))
        try{
            if(this.state.date!==''&&this.state.time!==''&&this.state.amount!==0&&this.state.title!==''&&this.state.introduction!==''){
                var _deadline = new Date(this.state.date+' '+this.state.time)
                let deadline = _deadline.getTime()
                let amount = web3.utils.toWei(''+this.state.amount, 'ether')
                let accounts = await web3.eth.getAccounts()
                await CrowdFundingContract.methods.launch(this.state.title,this.state.introduction,amount,deadline).send({
                    from: accounts[0],
                    // value: web3.utils.toWei('1', 'ether'),
                    gas: '3000000',
                })
                alert('成功发起项目!')
            }else{
                alert('请先完善信息!')
            }
        }catch(e){
            console.log(e)
            alert('发起项目失败!')
        }
    }
    render(){
        return (
            <>
            <Row>
                <Col span={8}></Col>
                <Col span={8}><h2>小梦想汇聚在一起就是大梦想！</h2></Col>
                <Col span={8}></Col>
            </Row>  
            <Row>
                <Col span={4}></Col>
                <Col span={16}>
                    <Form
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 14,
                        }}
                        layout="horizontal"
                    >
                        <Form.Item label="项目名称" name="name" rules={[{ required: true, message: '请说明项目名称!', }, ]}>
                          <Input onChange={this.handleTitle}/>
                        </Form.Item>
                        <Form.Item label="项目概述" name="intro" rules={[{ required: true, message: '请说明项目概述!', }, ]}>
                          <Input onChange={this.handleIntro}/>
                        </Form.Item>
                        <Form.Item label="众筹金额" name="amount" rules={[{ required: true, message: '请说明众筹金额!', }, ]}>
                            <Form.Item name="input-number" noStyle>
                                <InputNumber min={1} onChange={this.handleAmount}/>
                            </Form.Item>
                            <span className="ant-form-text"> ETH </span>
                        </Form.Item>
                        <Form.Item label="截止时间" name="deadline" rules={[{ required: true, message: '请说明截止时间!', }, ]}>
                        <Form.Item >
                          <DatePicker label="日期" onChange={this.handleDate}/></Form.Item>
                          <TimePicker onChange={this.handleTime}/>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={4}></Col>
            </Row>   
            <Row>
                <Col span={7}></Col>
                <Col span={7}><Button type="primary" onClick={this.launch}>发起众筹</Button></Col>
                <Col span={10}></Col>
            </Row>           
            </>
          );
    }
}


