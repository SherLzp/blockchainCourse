import React from "react";
import { Layout,Button, Space, InputNumber, List, Tag, Descriptions, Card} from 'antd';

class InfoArea extends React.Component {
    render(){
        const state = this.props.money_needed === this.props.money_raised ? <p color="#108ee9">成功</p> 
        : ( this.props.isOverdue ? <p>失败</p> : <p color="#87d068">进行中</p> );
		const deadLine = (new Date(this.props.end_time * 1000)).toLocaleDateString();
		const sttime=(new Date(this.props.start_time * 1000)).toLocaleDateString();
        return(
          <div>
            
              <Descriptions title="项目信息" bordered size="small" column={1}>
				  <Descriptions.Item label="内容">{this.props.summary}</Descriptions.Item>
                  <Descriptions.Item label="创建者">{this.props.owner}</Descriptions.Item>
				  <Descriptions.Item label="开始时间">{sttime}</Descriptions.Item>
				  <Descriptions.Item label="截止时间">{deadLine}</Descriptions.Item>
				  <Descriptions.Item label="目标筹集金额">{this.props.money_needed}</Descriptions.Item>
				  <Descriptions.Item label="已经筹集金额">{this.props.money_raised}</Descriptions.Item>
				  <Descriptions.Item label="介绍">{this.props.info}</Descriptions.Item>
				  <Descriptions.Item label="状态">{state}</Descriptions.Item>
				  <Descriptions.Item label="我已投资">{this.props.myMoney}</Descriptions.Item>
              </Descriptions>
            
      	  </div>
        );
    }
}

class InvestArea extends React.Component {
	constructor(props) {
		super(props);
		this.state = {money:1};
	}

	onClick = ()=>{
		this.props.invest(this.props.id, this.state.money);
	}

	render(){
	  const maxMoney = this.props.money_needed - this.props.money_raised;
	  return(
	    <div>
	      <Card >
		    
		    <Space>
		      <span>投资放飞梦想：(ETH)</span>
			  <InputNumber min={1} max={maxMoney} defaultValue={1}
			   onChange = {(value)=>{this.setState({money: value})}} />
			  <Button type="primary" onClick={this.onClick} disabled={this.props.isClicked}>
			  	确认投资
			  </Button>
		    </Space>
		  </Card>
	    </div>
	  );
	}
}

class VoteArea extends React.Component {
	render(){
		const showTitle = (item) => `使用请求 ${item.info}: `;
		const isJoin = () => (parseInt(this.props.myMoney)!==0);
		const isSucc = (item) => (parseInt(item.useAgreeNum) > parseInt(this.props.money_raised)/2)
		const isFail = (item) => (parseInt(item.useDisagreeNum) > parseInt(this.props.money_raised)/2)
		//const isOver = (item) => (isSucc(item) || isFail(item))
		const state = (item) => (isSucc(item) ? <p>已通过</p> : 
			(isFail(item) ? <p>被否决</p> : <p>进行中</p>));
		const unVoted = (item) => [
			<Space>
			<Button onClick={() => {this.props.vote(this.props.id, item.id,this.props.currentAccount, 1)}} disabled={this.props.isClicked}>
				接受
			</Button>,
      		<Button onClick={() => {this.props.vote(this.props.id, item.id, this.props.currentAccount,-1)}} disabled={this.props.isClicked}>
			  	拒绝
			</Button>
			</Space>
		]
		
		const showButton = (item) => {
			if(isSucc(item)){
				return <p style={{color:'red'}}>使用请求通过</p>
			}
			else if(isFail(item)){
				return <p style={{color:'red'}}>使用请求被拒绝</p>
			}
			else if(!isJoin()){
				return <p style={{color:'red'}}>您无法投票</p>
			}
			else if(item.isVote){
				return <p style={{color:'red'}}>已完成投票</p>
			}
			else{
				return unVoted(item);
			}
		};

		
		return(
		  <div>
			  <List	title="资金使用请求" itemLayout="horizontal"
    			dataSource={this.props.allUses}
    			renderItem={item => (
					<List.Item>
					<List.Item.Meta 
						title={<div><Space>{showTitle(item)}{state(item)}</Space></div>}
						description={<div>
										{showButton(item)}
									</div>}
					/>
					</List.Item>
    			)}
  			  />
		  </div>
		);
	}
}

export default class ShowDetails extends React.Component {
	render(){
		const isOverdue = (this.props.end_time*1000 < (new Date()).getTime());
		const isSuccess = (this.props.money_needed === this.props.money_raised);
		const showContribute = (!isOverdue)&&(!isSuccess);
		const showVote = (isSuccess) && ((parseInt(this.props.myMoney)!== 0) || (this.props.owner === this.props.currentAccount));
		return(
		  <>
		    <InfoArea {...this.props} isOverdue={isOverdue} />
			{showContribute && <InvestArea {...this.props} />}
			{showVote && <VoteArea {...this.props}/>}
		  </>
		);
	}
} 