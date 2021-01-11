import React, { Component } from 'react';
import { Button,Table, Modal } from 'antd';
import { voteRequest } from '../eth/fundingFactory'

class VoteRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agreeModalVisible:false,
            disagreeModalVisible:false,
            fID: this.props.fID,
        };
        this.dataSource = this.props.dataSource
        this.columns = [
            {
              title: '请求目的',
              dataIndex: 'purpose',
              key: 'purpose',
            },
            {
              title: '花费',
              dataIndex: 'cost',
              key: 'cost',
            },
            {
              title: '已投票人数',
              dataIndex: 'votes',
              key: 'votes',
            },
            {
              title: '支持金额',
              dataIndex: 'agree',
              key: 'agree',
            },
            {
              title: '反对金额',
              dataIndex: 'disagree',
              key: 'disagree',
            },
            {
                title: '你的投票情况',
                dataIndex: 'isVoted',
                key: 'isVoted',
            },
            {
                title: '请求状态',
                dataIndex: 'tag',
                key: 'tag',
            },
            {
                title: '操作',
                key: 'action',
                render: (text,record,index)=>(
                    <div>
                  <Button disabled = {record.showButton} onClick={this.agree.bind(this,text,record,index)} type="primary" style={{marginRight:"15px"}}> 同意 </Button>
                  <Button disabled = {record.showButton} onClick={this.disagree.bind(this,text,record,index)}> 反对 </Button>
                  </div>
              )
              },
        ]
        this.agree = this.agree.bind(this)
        this.disagree = this.disagree.bind(this)
    }

    agree = (text,record,index)=>{
        this.setState({
        agreeModalVisible:true,
        selected: index,
        })
    }

    disagree = (text,record,index)=>{
        this.setState({
        disagreeModalVisible:true,
        selected: index,
        })
    }

    handleAgree = async () => {
        try {
          await voteRequest(this.state.fID, this.state.selected, true)
          alert('已同意请求')
          window.location.reload();
      } catch (error) {
          alert('操作失败')
          console.log(error)
      }
    
        this.setState({
          isModalVisible:false
        })
    };

    handleDisagree = async () => {
        try {
            await voteRequest(this.state.fID, this.state.selected, false)
            alert('已反对请求')
            window.location.reload();
      } catch (error) {
          alert('操作失败')
          console.log(error)
      }
    
        this.setState({
          isModalVisible:false
        })
    };
      
    handleCancel = () => {
        this.setState({
            agreeModalVisible:false,
            disagreeModalVisible:false
        })
    };

    render(){
        return(
            <div>
            <Table columns={this.columns} dataSource= {this.dataSource}/>
            <Modal title="同意请求" visible={this.state.agreeModalVisible} cancelText={"取消"} okText={"确认"} onOk={this.handleAgree} onCancel={this.handleCancel}>
                确定要同意该请求吗，只能对请求进行一次投票？
            </Modal>
            <Modal title="反对请求" visible={this.state.disagreeModalVisible} cancelText={"取消"} okText={"确认"} onOk={this.handleDisagree} onCancel={this.handleCancel}>
                确定要反对该请求吗，只能对请求进行一次投票？
            </Modal>
            </div>
        )
    }
}
export default VoteRequest