import React, { Component } from 'react';
import { PageHeader, Descriptions } from 'antd';
import VoteRequest from "../utils/voteRequest"
import { getMyInvest } from '../eth/fundingFactory'
import "../assets/Menu.css"

class MyInvest extends Component {
    constructor(props) {
        super(props);
        this.state = {
          myInvests: [],
          isModalVisible:false,
        };
    }

    async componentDidMount(){
        let res = await getMyInvest()
        console.log(res)
        this.setState({
            myInvests: res
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
                >
                <Descriptions size="small" column={6}>
                    <Descriptions.Item label="项目状态"> {item.status} </Descriptions.Item>
                    <Descriptions.Item label="目标资金"> {item.targetMoney} </Descriptions.Item>
                    <Descriptions.Item label="共筹得资金"> {item.totalMoney} </Descriptions.Item>
                    <Descriptions.Item label="剩余资金"> {item.tempMoney} </Descriptions.Item>
                    <Descriptions.Item label="投资者总数"> {item.totalInvestors}</Descriptions.Item>
                    <Descriptions.Item label="发起请求数">{item.totalRequests}</Descriptions.Item>
                    <Descriptions.Item label="项目描述">{item.detail}</Descriptions.Item>
                </Descriptions>
                <VoteRequest fID= {item.index} dataSource={item.requests} />
                </PageHeader>
              </div>
            )
        })
    };

    render(){
        return(
            <div className="site-page-header-ghost-wrapper">
                {this.getMenuNodes(this.state.myInvests)}
            </div>
        )
    }
}

export default MyInvest