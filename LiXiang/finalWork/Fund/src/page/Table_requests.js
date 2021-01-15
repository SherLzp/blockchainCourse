import React, {Component} from 'react';
import { Table, Space, Button} from 'antd';

class Table_requests extends Component{
  constructor(){
    super();
    this.state = {
      columns: [],
    };
  }
  componentDidMount(){
    this.setState({
      columns: [
        {
          dataIndex: '',
          key: 'xxxx',
          render: (text, record, index) => {
            if (this.props.FundingInfo.FundingContribution==="0WEI") return (<></>); 
            else {
              if (record.usageState === "0" && record.voted === false) return (
                <Space size="middle">
                  <Button onClick={()=>this.props.vote(index, true)}>赞成</Button>
                  <Button onClick={()=>this.props.vote(index, false)}>反对</Button>
                </Space>
              );
              else return (<></>);
            }
          },
        },
        { title: '申请标题', dataIndex: 'usageTitle', key: 'usageTitle' },
        { title: '申请概述', dataIndex: 'usageTitle', key: 'usageTitle' },
        { title: '金额', dataIndex: 'usageAmount_eth', key: 'usageAmount_eth' },
        { title: '赞成率', dataIndex: 'approval', key: 'approval' },
        { title: '反对率', dataIndex: 'disapproval', key: 'disapproval'},
        { title: '开始时间', dataIndex: 'usageStartTime', key: 'usageStartTime' },
        { title: '结束时间', dataIndex: 'usageEndTime', key: 'usageEndTime' },
        { title: '当前状态', 
          dataIndex: 'usageState', 
          key: 'usageState',
          render: (usageState) => {
            if (usageState === "4") return '申请通过';
            else if(usageState === "3") return '申请失败';
            else if(usageState === "0") return '等待投票结果'
            },
        },
      ],
    });
  }

  render(){
    return (
      <Table
        columns={this.state.columns}
        dataSource={this.props.drawsInfo}
        bordered
      />
    )
  }
};

export default Table_requests;