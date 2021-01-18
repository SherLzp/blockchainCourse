import React from "react";
import { Layout, Button, Space, Table, Modal, Spin, Popconfirm, Tag} from 'antd';
import MoreInfo from "./MoreInfo";
import NewUse from "./NewUse";
import NewFunding from "./NewFunding";

export default class FundingTable extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          isNewFundingVisible: false, 
          isMoreInfoVisible: false, 
          isNewUseVisible: false,
          curId: 0, 
          detail:''
        }
    }

    showMore = (index)=>{
      this.setState({
        curId: index,
        detail: this.props.allData[index],
        isMoreInfoVisible: true,
      })
    }

    addUse = (index)=>{
      this.setState({
        curId: index,
        detail: this.props.allData[index],
        isNewUseVisible: true
      })
    }

    handleReturn = (index)=>{
      this.props.returnMoney(index);
    }

    render(){
        const columns = [{
            title: '项目名称',
            dataIndex: 'title',
            key: 'title',
            width: '15%'
        },{
            title: '截止时间',
            dataIndex: 'endTime',
            key: 'deadline',
            width: '15%',
            render: endTime => (
              <p>{(new Date(endTime * 1000)).toLocaleDateString()}</p>
            )
        },{
            title: '目标金额(ETH)',
            dataIndex: 'goal',
            key: 'goal',
            width: '15%'
        },{
            title: '当前金额(ETH)',
            dataIndex: 'current',
            key: 'current',
            width: '15%'
        },{
            title: '当前状态',
            key: 'state',
            width: '15%',
            render: (text, record)=>{
              if(record.current === record.goal){
                return <Tag color="#108ee9">成功</Tag>;
              }
              else if(record.endTime*1000 < (new Date()).getTime()){
                return <Tag color="#f50">失败</Tag>;
              }
              else{
                return <Tag color="#87d068">进行中</Tag>;
              }
            }
        },{
            title: '查看详情',
            key: 'detail',
            render: (text, record)=>{
              if(this.props.tableType === 3){
                const isSuccess = (this.props.allData[record.key].current === this.props.allData[record.key].goal);
                return(
                  <Space>
                    <Button type="primary" onClick={()=>this.showMore(record.key)} disabled={this.props.isClicked}>
                      查看详情
                    </Button>
                    <Button type="primary" onClick={()=>this.addUse(record.key)} 
                      disabled={this.props.isClicked || !isSuccess}>
                      创建使用请求
                    </Button>
                  </Space>
                )
              }
              else if(this.props.tableType === 4){
                const isSuccess = (this.props.allData[record.key].current === this.props.allData[record.key].goal);
                return(
                  <Space>
                    <Button type="primary" onClick={()=>this.showMore(record.key)} disabled={this.props.isClicked}>
                        查看详情
                    </Button>
                    <Popconfirm title="确定要退钱吗?" onConfirm={() => this.handleReturn(record.key)} 
                      disabled={this.props.isClicked || isSuccess}>
                      <Button type="primary" disabled={this.props.isClicked || isSuccess}>退钱</Button>
                    </Popconfirm>
                  </Space>
                )
              }
              else{
                return(
                  <Button type="primary" onClick={()=>this.showMore(record.key)} disabled={this.props.isClicked}>
                    查看详情
                  </Button>
                )
              }
            }
        }]
        return(
          <Layout>
            <Spin spinning={this.props.isClicked} size="large">
              <Modal
                title="发布众筹"
                visible={this.state.isNewFundingVisible}
                footer={null}
                onCancel={() => {this.setState({isNewFundingVisible:false})}}
              >
                <NewFunding 
                  onClick={this.props.newFunding}
                  isClicked = {this.props.isClicked}
                />
              </Modal>
              <Modal
                title="发布新请求"
                visible={this.state.isNewUseVisible}
                footer={null}
                onCancel={() => {this.setState({isNewUseVisible:false})}}
              >
                <NewUse 
                  {...this.state.detail}
                  newUse = {this.props.newUse}
                  currentAccount  = {this.props.currentAccount}
                  isClicked = {this.props.isClicked}
                />
              </Modal>
              <Modal
                title="显示详情"
                visible={this.state.isMoreInfoVisible}
                footer={null}
                width="600px"
                onCancel={() => {this.setState({isMoreInfoVisible: false})}}
              >
                <MoreInfo 
                  {...this.state.detail}
                  contribute = {this.props.contribute}
                  voteForUse = {this.props.voteForUse}
                  currentAccount = {this.props.currentAccount}
                  isClicked = {this.props.isClicked}
                />
              </Modal>
            </Spin>
            <Table columns={columns} dataSource={this.props.showData} pagination={{pageSize: 8}} style={{marginRight:'40px'}}/>
            <Button type="primary" style={{ marginTop: 16, marginLeft: '30%', width: '40%', height: '40px' }} onClick={() => this.setState({isNewFundingVisible: true})} disabled={this.props.isClicked}>发布众筹项目</Button>
          </Layout>
        )
    }
} 