import React, {Component} from 'react';
import { Table, Tag, Space } from 'antd';

class DrawTable extends Component{
  constructor(){
    super();
    this.state = {
      columns: [],
    };
  }

  componentDidMount(){
    this.setState({
      columns: [
        { title: 'Title', dataIndex: 'usageTitle', key: 'usageTitle' },
        { title: 'Amount', dataIndex: 'usageAmount_eth', key: 'usageAmount_eth' },
        { title: 'Approval', dataIndex: 'approval', key: 'approval' },
        { title: 'Disapproval', dataIndex: 'disapproval', key: 'disapproval'},
        { title: 'Start Time', dataIndex: 'usageStartTime', key: 'usageStartTime' },
        { title: 'End Time', dataIndex: 'usageEndTime', key: 'usageEndTime' },
        { title: 'State', 
          dataIndex: 'usageState', 
          key: 'usageState',
          render: (text) => {
            let color = 'geekblue';
            if (text === "Ongoing") color = 'green';
            else if (text === "Failed") color = 'volcano';
            else if (text === "Paidoff") color = 'gold';
            return (
              <Tag color={color} key={text}>
                {text}
              </Tag>
            );
          },
        },
        {
          title: 'Action',
          dataIndex: '',
          key: 'x',
          render: (text, record, index) => {
            if (this.props.projectInfo.projectContribution==="0WEI") return (<></>); 
            else {
              if (record.usageState === "Ongoing" && record.voted === false) return (
                <Space size="middle">
                  <a onClick={()=>this.props.vote(index, true)}>Approve</a>
                  <a onClick={()=>this.props.vote(index, false)}>Disapprove</a>
                </Space>
              );
              else return (<></>);
            }
          },
        },
      ],
    });
  }

  render(){
    return (
      <Table
        columns={this.state.columns}
        expandable={{
          expandedRowRender: record => <div>
              <p style={{ marginLeft: 30 }}>Title: {record.usageTitle}</p>
              <p style={{ marginLeft: 30 }}>State: {record.usageState}</p>
              <p style={{ marginLeft: 30 }}>Request Amount: {record.usageAmount_eth} ({record.usageAmount})</p>
              <p style={{ marginLeft: 30 }}>Approval Rate: {record.approval}</p>
              <p style={{ marginLeft: 30 }}>Disapproval Rate: {record.disapproval}</p>
              <p style={{ marginLeft: 30 }}>Request Start Time: {record.usageStartTime}</p>
              <p style={{ marginLeft: 30 }}>Request End Time: {record.usageEndTime}</p>
              <p style={{ marginLeft: 30 }}>Description: {record.usageDescription}</p>
            </div>,
        }}
        dataSource={this.props.drawsInfo}
      />
    )
  }
};

export default DrawTable;