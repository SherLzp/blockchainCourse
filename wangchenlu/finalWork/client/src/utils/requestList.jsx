import React, { Component } from 'react';
import { Button,Table, Modal } from 'antd';

import { finishRequest } from '../eth/fundingFactory'

class RequestList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isModalVisible:false,
          fID: this.props.fID
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
                title: '请求状态',
                dataIndex: 'tag',
                key: 'tag',
            },
            {
                title: '操作',
                dataIndex: 'status',
                key: 'action',
                render: (text,record,index)=>(
                  <Button disabled={record.excute} onClick={this.action.bind(this,text,record,index)}> 执行请求 </Button>
                )
              },
        ]
        this.action = this.action.bind(this)
    }

    action = (text,record,index)=>{
        this.setState({
        isModalVisible:true,
        selected: index,
        })
    }

    handleOk = async () => {
        try {
          await finishRequest(this.state.fID, this.state.selected)
          alert('执行成功')
          window.location.reload();
      } catch (error) {
          alert('执行失败')
          console.log(error)
      }
    
        this.setState({
          isModalVisible:false
        })
      };
      
      handleCancel = () => {
        this.setState({
          isModalVisible:false
        })
      };

    render(){
        return(
            <div>
            <Table columns={this.columns} dataSource= {this.dataSource}/>
            <Modal title="投资项目" visible={this.state.isModalVisible} cancelText={"取消"} okText={"确认"} onOk={this.handleOk} onCancel={this.handleCancel}>
                确定要执行请求吗？
            </Modal>
            </div>
        )
    }


}
export default RequestList