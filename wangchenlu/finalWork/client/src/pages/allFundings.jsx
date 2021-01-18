import React, { Component } from 'react';
import { Table, Button, Modal,InputNumber, Descriptions, Tag } from 'antd';
import { getAllFunding, investFunding} from '../eth/fundingFactory'

class AllFundings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allFundings: [],
      isModalVisible:false,
    };
    this.columns = [
      {
        title: '项目名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '项目简介',
        dataIndex: 'detail',
        key: 'detail',
      },
      {
        title: '目标金额',
        dataIndex: 'targetMoney',
        key: 'targetMoney',
        sorter: (a, b) => a.targetMoney - b.targetMoney,
      },
      {
        title: '已筹金额',
        dataIndex: 'tempMoney',
        key: 'tempMoney',
        sorter: (a, b) => a.tempMoney - b.tempMoney,
      },
      {
        title: '截止时间',
        dataIndex: 'endTime',
        key: 'endTime',
      },
      {
        title: '众筹状态',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
          <>
            {tags.map(tag => {
              let color = ""
              if (tag === 'end') {
                color = 'volcano';
              }
              else if(tag === 'success'){
                color = 'green';
              }
              else{
                color = 'geekblue'
              }
              return (
                <Tag color={color} key={tag}>
                  {tag}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'showButton',
        render: (text,record,index)=>(
          <div>
             <Button disabled={!record.showButton} onClick={this.action.bind(this,text,record,index)}> 投资 </Button>
          </div>
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
      await investFunding(this.state.selected, this.state.invest)
      alert('投资成功')
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
      isModalVisible:false
    })
  };
  

  async componentDidMount(){
    let res = await  getAllFunding();
    console.log(res)
    this.setState({
      allFundings: res
    })
  }

  getInfo(){
    let data = this.state.allFundings[this.state.selected]
    let title = ""
    let detail = ""
    let time = ""
    let sponsor = ""

    for(var index in data) {
      if(index === "title")
        title = data[index]
      else if(index === "detail")
        detail = data[index]
      else if(index === "endTime")
        time = data[index]
      else if(index === "sponsor")
        sponsor = data[index]
    }
    
    return(
      <Descriptions title="项目详情" column={1} cancelText={"取消"} okText={"确认投资"}>
        <Descriptions.Item label="发起人"> {sponsor}</Descriptions.Item>
        <Descriptions.Item label="项目名称"> {title}</Descriptions.Item>
        <Descriptions.Item label="项目简介">{detail}</Descriptions.Item>
        <Descriptions.Item label="截止时间">{time}</Descriptions.Item>
        <Descriptions.Item label="投资金额(ETH)">
        <InputNumber style = {{width:"100px"}} min={0.1}  step={0.1} onChange={this.handleInput.bind(this)}/>
        </Descriptions.Item>
      </Descriptions>
    )
  }

  handleInput(value){
    this.setState({
      invest: value
    })
  }

  render() {
      return (
          <div>
              <div style = {{width:"90%", marginLeft:"5%"}}>
                  <Table columns={this.columns} dataSource={this.state.allFundings} />
                  <Modal title="投资项目" visible={this.state.isModalVisible}  cancelText={"取消"} okText={"确认"} onOk={this.handleOk} onCancel={this.handleCancel}>
                    {this.getInfo()}
                  </Modal>
              </div>
          </div>
      )
  }
}

export default AllFundings