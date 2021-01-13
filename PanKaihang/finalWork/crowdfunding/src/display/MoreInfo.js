import React from "react";
import { Button, Space, InputNumber, List, Tag, Descriptions, Card} from 'antd';

class DetailArea extends React.Component {
    render(){
        const state = this.props.current === this.props.goal ? <Tag color="#108ee9">成功</Tag> 
        : ( this.props.isOverdue ? <Tag color="#f50">失败</Tag> : <Tag color="#87d068">进行中</Tag> );
        const deadLine = (new Date(this.props.endTime * 1000)).toLocaleDateString();
        return(
          <div>
            <Card title="众筹项目信息">
              <Descriptions bordered size="small" column={1}>
				  <Descriptions.Item label="项目名称">{this.props.title}</Descriptions.Item>
				  <Descriptions.Item label="项目合约地址">{this.props.address}</Descriptions.Item>
				  <Descriptions.Item label="项目发起人">{this.props.initiator}</Descriptions.Item>
				  <Descriptions.Item label="项目截止时间">{deadLine}</Descriptions.Item>
				  <Descriptions.Item label="项目目标金额">{this.props.goal}</Descriptions.Item>
				  <Descriptions.Item label="项目当前金额">{this.props.current}</Descriptions.Item>
				  <Descriptions.Item label="项目详情">{this.props.info}</Descriptions.Item>
				  <Descriptions.Item label="项目当前状态">{state}</Descriptions.Item>
				  <Descriptions.Item label="我的投资">{this.props.myMoney}</Descriptions.Item>
              </Descriptions>
            </Card>
      	  </div>
        );
    }
}

class ContributeArea extends React.Component {
	constructor(props) {
		super(props);
		this.state = {money:1};
	}

	onClick = ()=>{
		this.props.contribute(this.props.id, this.state.money);
	}

	render(){
	  const maxMoney = this.props.goal - this.props.current;
	  return(
	    <div>
	      <Card title="投钱">
		    <p>最大可投入金额为：{maxMoney}ETH</p>
		    <Space>
		      <span>请输入你想投入的金融：</span>
			  <InputNumber min={1} max={maxMoney} defaultValue={1}
			   onChange = {(value)=>{this.setState({money: value})}} />
			  <Button type="primary" onClick={this.onClick} disabled={this.props.isClicked}>
			  	投钱
			  </Button>
		    </Space>
		  </Card>
	    </div>
	  );
	}
}

class VoteArea extends React.Component {
	render(){
		const showTitle = (item) => `${item.content}:${item.money} ETH`;
		const currentAgree = (item) => `当前同意票数占比: ${item.useAgreeNum} / ${this.props.goal}`
		const currentDisagree = (item) => `当前不同意票数占比: ${item.useDisagreeNum} / ${this.props.goal}`
		const isJoin = () => (parseInt(this.props.myMoney)!==0);
		const isSucc = (item) => (parseInt(item.useAgreeNum) > parseInt(this.props.goal)/2)
		const isFail = (item) => (parseInt(item.useDisagreeNum) > parseInt(this.props.goal)/2)
		//const isOver = (item) => (isSucc(item) || isFail(item))
		const state = (item) => (isSucc(item) ? <Tag color="#108ee9">已通过</Tag> : 
			(isFail(item) ? <Tag color="#f50">被否决</Tag> : <Tag color="#87d068">进行中</Tag>));
		const unVoted = (item) => [
			<Space>
			<Button onClick={() => {this.props.voteForUse(this.props.id, item.id, true)}} disabled={this.props.isClicked}>
				同意
			</Button>,
      		<Button onClick={() => {this.props.voteForUse(this.props.id, item.id, false)}} disabled={this.props.isClicked}>
			  	反对
			</Button>
			</Space>
		]
		//const alreadyVoted = () => [
		//	<p>您已经完成投票~</p>
		//]
		const showButton = (item) => {
			if(isSucc(item)){
				return <p style={{color:'red'}}>资金使用请求已通过！</p>
			}
			else if(isFail(item)){
				return <p style={{color:'red'}}>资金使用请求被否决！</p>
			}
			else if(!isJoin()){
				return <p style={{color:'red'}}>您没有投票的权利！</p>
			}
			else if(item.isVote){
				return <p style={{color:'red'}}>您已经完成投票~</p>
			}
			else{
				return unVoted(item);
			}
		};
		
		//const showButton = (item) => {return(item.isVote ? alreadyVoted() : unVoted(item))};
		//const showButton = (item) => (unVoted(item));
		return(
		  <div>
		  	<Card title="资金使用请求">
			  <p>每一个使用请求只有获得超过50%的票数才能通过!</p>
			  <p>每一个请求的总票数为{this.props.goal},您的票数为{this.props.myMoney}</p>
			  <List	itemLayout="horizontal"
    			dataSource={this.props.allUses}
    			renderItem={item => (
					<List.Item>
					<List.Item.Meta 
						title={<div><Space>{showTitle(item)}{state(item)}</Space></div>}
						description={<div>
										<p>{currentAgree(item)}</p>
										<p>{currentDisagree(item)}</p>
										{showButton(item)}
									</div>}
					/>
					</List.Item>
    			)}
  			  />
			</Card>
		  </div>
		);
	}
}

export default class MoreInfo extends React.Component {
	render(){
		const isOverdue = (this.props.endTime*1000 < (new Date()).getTime());
		const isSuccess = (this.props.goal === this.props.current);
		const showContribute = (!isOverdue)&&(!isSuccess);
		const showVote = (isSuccess) && ((parseInt(this.props.myMoney)!== 0) || (this.props.initiator === this.props.currentAccount));
		return(
		  <>
		    <DetailArea {...this.props} isOverdue={isOverdue} />
			{showContribute && <ContributeArea {...this.props} />}
			{showVote && <VoteArea {...this.props}/>}
		  </>
		);
	}
}