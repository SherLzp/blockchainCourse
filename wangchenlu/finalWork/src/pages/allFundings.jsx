import React, { Component } from 'react';
import { Table, Button } from 'antd';

//
const columns = [
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
    },
    {
      title: '已筹金额',
      dataIndex: 'tempMoney',
      key: 'tempMoney',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
          <Button onClick={AllFundings.handleClick} >投资 </Button>
      ),
    },
  ];
  
  const data = [
    {
      key: '1',
      title: '项目1',
      detail: 'balabala',
      targetMoney: 20,
      tempMoney: 0,
    },
    {
      key: '2',
      title: '项目2',
      detail: 'balabala',
      targetMoney: 20,
      tempMoney: 10,
    },
    {
      key: '3',
      title: '项目3',
      detail: 'balabala',
      targetMoney: 30,
      tempMoney: 5,
    },
];

class AllFundings extends Component {
  state = {
      active:false,
      selectedFundingDetail:'',
  }

  handleClick = e => {
    console.log('click ', e);
    this.setState({
        currentKey: e.key,
    });
  };


  render() {
      return (
          <div>
              <div style = {{width:"90%", marginLeft:"5%"}}>
                  <Table columns={columns} dataSource={data} />
              </div>
          </div>
      )
  }
}

export default AllFundings