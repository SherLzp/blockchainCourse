import React from "react";
import { Layout, Drawer,Button, Space, Table, Modal, Spin, Popconfirm, Tag} from 'antd';
import ShowDetails from "./ShowDetails";
import CreateUse from "./CreateUse";
import CreateProject from "./CreateProject";

export default class ProjectList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          isCreateFundingVisible: false, 
          isShowDetailsVisible: false, 
          isCreateUseVisible: false,
          curId: 0, 
          detail:''
        }
    }
    

    ShowMoreDetails = (index)=>{
      this.setState({
        curId: index,
        detail: this.props.allData[index],
        isShowDetailsVisible: true,
      })
    }

    addNewUse = (index)=>{
      this.setState({
        curId: index,
        detail: this.props.allData[index],
        isCreateUseVisible: true
      })
    }


    render(){
        const columns = [{
            title: '项目内容',
            dataIndex: 'summary',
            key: 'summary',
            width: '12%'
        },{
            title: '需要筹集金额(ETH)',
            dataIndex: 'money_needed',
            key: 'money_needed',
            width: '18%'
        },{
            title: '已筹集金额(ETH)',
            dataIndex: 'money_raised',
            key: 'money_raised',
            width: '18%'
        },{
            title: '项目状态',
            key: 'state',
            width: '12%',
            render: (text, record)=>{
              if(record.money_raised === record.money_needed){
                return <p >成功</p>;
              }
              else if(record.end_time*1000 < (new Date()).getTime()){
                return <p >失败</p>;
              }
              else{
                return <p >进行中</p>;
              }
            }
        },{
            title: '开始时间',
            dataIndex: 'start_time',
            key: 'start_time',
            width: '15%',
            render: start_time => (
              <p>{(new Date(start_time * 1000)).toLocaleDateString()}</p>
            )
        },{
            title: '结束时间',
            dataIndex: 'end_time',
            key: 'deadline',
            width: '15%',
            render: end_time => (
              <p>{(new Date(end_time * 1000)).toLocaleDateString()}</p>
            )
        },{
            title: '操作',
            key: 'detail',
            render: (text, record)=>{
              if(this.props.tableType === 3){
                const isSuccess = (this.props.allData[record.key].money_needed === this.props.allData[record.key].money_raised);
                return(
                  <Space>
                    <Button type="primary" onClick={()=>this.addNewUse(record.key)} 
                      disabled={this.props.isClicked || !isSuccess}>
                      新增使用请求
                    </Button>
                  </Space>
                )
              }
              
              else{
                return(
                  <Button type="primary" onClick={()=>this.ShowMoreDetails(record.key)} disabled={this.props.isClicked}>
                    查看详情
                  </Button>
                )
              }
            }
        }]
        return(
          <Layout>
            <Button type="primary" style={{ marginTop: 10, marginLeft: 20,marginBottom:20, width: '14%', height: '42px' }} onClick={() => this.setState({isCreateFundingVisible: true})} disabled={this.props.isClicked}>新建众筹项目</Button>
            <Spin spinning={this.props.isClicked} size="large">
              <Drawer
                title="新建众筹项目"
                placement="right"
                closable={false}
                visible={this.state.isCreateFundingVisible}
                footer={null}
                width={'50%'}
                onClose={() => {this.setState({isCreateFundingVisible:false})}}
              >
                <CreateProject 
                  onClick={this.props.createProject}
                  isClicked = {this.props.isClicked}
                />
              </Drawer>
              <Drawer
                title="新增使用请求"
                placement="right"
                closable={false}
                width={'35%'}
                visible={this.state.isCreateUseVisible}
                footer={null}
                onClose={() => {this.setState({isCreateUseVisible:false})}}
              >
                <CreateUse 
                  {...this.state.detail}
                  createUse = {this.props.createUse}
                  currentAccount  = {this.props.currentAccount}
                  isClicked = {this.props.isClicked}
                />
              </Drawer>
              <Drawer
                title="查看详情信息"
                placement="right"
                closable={false}
                width={'50%'}
                visible={this.state.isShowDetailsVisible}
                footer={null}
                width="800px"
                onClose={() => {this.setState({isShowDetailsVisible: false})}}
              >
                <ShowDetails 
                  {...this.state.detail}
                  invest = {this.props.invest}
                  vote = {this.props.vote}
                  currentAccount = {this.props.currentAccount}
                  isClicked = {this.props.isClicked}
                />
              </Drawer>
            </Spin>
            <Table columns={columns} dataSource={this.props.showData} pagination={{pageSize: 10}} style={{marginRight:'50px'}}/>
            </Layout>
        )
    }
}  
export class NotEndProject extends React.Component {
  render(){
    const allData = this.props.allData; 
    const data = allData.filter(item => {
      console.log(item.money_raised-item.money_needed<0);
      return((item.money_raised-item.money_needed<0 && item.end_time*1000>(new Date()).getTime()));
    })
    return(
      <ProjectList {...this.props} showData={data} tableType={2}/>
    )
  }
} 
export class MyInvestingProject extends React.Component {
  render(){
    const allData = this.props.allData; 
    const data = allData.filter(item => parseInt(item.myMoney) > 0);
    return(
      <ProjectList {...this.props} showData={data} tableType={4}/>
    )
  }
} 
export class MyCreatingProject extends React.Component {
  render(){
    const allData = this.props.allData; 
    const currentAccount = this.props.currentAccount;
    const data = allData.filter(item => item.owner===currentAccount);
    return(
      <ProjectList {...this.props} showData={data} tableType={3}/>

    )
  }
} 
export  class AllProject extends React.Component {
  render(){
    const allData = this.props.allData; 
    return(
      <ProjectList {...this.props} showData={allData} tableType={1}/>
    )
  }
}