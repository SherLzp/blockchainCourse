import React, { Component } from 'react';
import { PageHeader, Button, Descriptions, Modal,InputNumber,Input } from 'antd';

import RequestList from "../utils/requestList"
import { getMyFunding, createRequest, refund } from '../eth/fundingFactory'
import "../assets/Menu.css"

class MyFundings extends Component {
    constructor(props) {
        super(props);
        this.state = {
          myFundings: [],
          requestVisible:false,
          refundVisible:false,
        };
    }

    async componentDidMount(){
        let res =  await getMyFunding();
        this.setState({
            myFundings: res
        })   
    }

    getMenuNodes = (menuList) =>{
        return menuList.map(item=>{
            return(
              <div>
                <PageHeader style = {{marginBottom:"5px", width:"80%", marginLeft:"10%"}}
                ghost={false}
                title= {item.title}
                subTitle= {"发起人:" + item.sponsor}
                extra={[
                    <div>
                    <Button disabled={item.newRequest} style={{marginRight:"5px"}} key="1"  type="primary" onClick={(e) => this.handleRequest(item.index, e)}>
                    发起请求
                    </Button>
                    <Button disabled={item.refund} key="2" onClick={(e) => this.handleRefund(item.index, e)}>
                    退款
                    </Button>
                    </div>
                ]}>
                <Descriptions size="small" column={6}>
                    <Descriptions.Item label="项目状态"> {item.status} </Descriptions.Item>
                    <Descriptions.Item label="目标资金"> {item.targetMoney} </Descriptions.Item>
                    <Descriptions.Item label="共筹得资金"> {item.totalMoney} </Descriptions.Item>
                    <Descriptions.Item label="剩余资金"> {item.tempMoney} </Descriptions.Item>
                    <Descriptions.Item label="投资者总数"> {item.totalInvestors}</Descriptions.Item>
                    <Descriptions.Item label="发起请求数">{item.totalRequests}</Descriptions.Item>
                    <Descriptions.Item label="项目描述">{item.detail}</Descriptions.Item>
                </Descriptions>
                <RequestList fID= {item.index} dataSource={item.requests} />
                </PageHeader>
              </div>
            )
        })
    };

    handleRequest = (id, e) => {
        console.log(id)
        this.setState({
            requestVisible:true,
            selected: id,
        })
    }

    handleRefund = (id, e) => {
        console.log(id)
        this.setState({
            refundVisible:true,
            selected: id,
        })
    }

    handleRequestOK = async () => {
        try {
            await createRequest(this.state.selected, this.state.purpose, this.state.cost)
            alert('请求提交成功')
            window.location.reload();
        } catch (error) {
            alert('请求提交失败')
            console.log(error)
        }

        this.setState({
            requestVisible:false,
        })
    };
    handleRefundOK= async () => {
        try {
            await refund(this.state.selected)
            alert('退款成功')
            window.location.reload();
        } catch (error) {
            alert('退款失败')
            console.log(error)
        }

        this.setState({
            refundVisible:false,
        })
    };
      
    handleCancel = () => {
        this.setState({
            requestVisible:false,
            refundVisible:false,
        })
    };

    handlePurpose = ({ target: { value } }) =>{
        this.setState({
            purpose: value
        })
    }

    handleCost(value){
        this.setState({
          cost: value
        })
    }
    

    render(){
        return(
            <div className="site-page-header-ghost-wrapper">
                {this.getMenuNodes(this.state.myFundings)}
                <Modal title="提出请求" visible={this.state.requestVisible}  cancelText={"取消"} okText={"确认"} onOk={this.handleRequestOK} onCancel={this.handleCancel}>
                <Descriptions column={1}>
                    <Descriptions.Item label="请求目的"> 
                    <Input onChange={this.handlePurpose.bind(this)}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="请求花费(ETH)">
                    <InputNumber style = {{width:"100px"}} min={0.1}  step={0.1} onChange={this.handleCost.bind(this)}/>
                    </Descriptions.Item>
                </Descriptions>
                </Modal>
                <Modal title="退款" visible={this.state.refundVisible}  cancelText={"取消"} okText={"确认"} onOk={this.handleRefundOK} onCancel={this.handleCancel}>
                    是否确定要退款？
                </Modal>
            </div>
        )
    }

}

export default MyFundings