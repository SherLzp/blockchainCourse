import React from "react";
import MainPage from './display/MainPage'
import {message} from 'antd';
import web3 from './utils/InitWeb3';
import crowdFundingInstance from './eth/CrowdFunding'

class App extends React.Component {
    constructor(props){
        super(props);
        this.newFunding = this.newFunding.bind(this);
        this.contribute = this.contribute.bind(this);
        this.newUse = this.newUse.bind(this);
        this.voteForUse = this.voteForUse.bind(this);
        this.getData = this.getData.bind(this);
        this.returnMoney = this.returnMoney.bind(this);
        this.state = {
            currentAccount: '未登录游客',
            allData: [],
            isClicked: false
        }
    }

    componentDidMount() {
    }

    async getData(){
      try{
        let accounts = await web3.eth.getAccounts();
        let fundingNum = await crowdFundingInstance.methods.getTotalNum().call();
        let allData = [];
        for(let i=0; i<fundingNum; i++){
            let key = i;
            let id = i;
            let address = await crowdFundingInstance.methods.getAddress(i).call();
            let title = await crowdFundingInstance.methods.getTitle(i).call();
            let initiator = await crowdFundingInstance.methods.getInitiator(i).call();
            let endTime = await crowdFundingInstance.methods.getEndTime(i).call();
            let goalWei = await crowdFundingInstance.methods.getGoal(i).call();
            let goal = web3.utils.fromWei(goalWei, 'ether');
            let currentWei = await crowdFundingInstance.methods.getCurrent(i).call();
            let current = web3.utils.fromWei(currentWei, 'ether');
            let remainderWei = await crowdFundingInstance.methods.getRemainder(i).call();
            let remainder = web3.utils.fromWei(remainderWei, 'ether');
            let info = await crowdFundingInstance.methods.getInfo(i).call();
            let myMoneyWei = await crowdFundingInstance.methods.getFunderMoney(i, accounts[0]).call();
            let myMoney = web3.utils.fromWei(myMoneyWei, 'ether');
            //
            let allUses = []
            let useNum = await crowdFundingInstance.methods.getUseNum(i).call();
            for(let j=0; j<useNum; j++){
                let content = await crowdFundingInstance.methods.getUseContent(i, j).call();
                let moneyWei = await crowdFundingInstance.methods.getUseMoney(i, j).call();
                let money = web3.utils.fromWei(moneyWei, 'ether');
                let useAgreeNumWei = await crowdFundingInstance.methods.getUseAgreeNum(i, j).call();
                let useAgreeNum = web3.utils.fromWei(useAgreeNumWei, 'ether');
                let useDisagreeNumWei = await crowdFundingInstance.methods.getUseDisagreeNum(i, j).call();
                let useDisagreeNum = web3.utils.fromWei(useDisagreeNumWei, 'ether');
                let isVote = await crowdFundingInstance.methods.getUseVote(i, j, accounts[0]).call();
                allUses.push({
                    id: j,
                    content: content,
                    money: money,
                    useAgreeNum: useAgreeNum,
                    useDisagreeNum: useDisagreeNum,
                    isVote: isVote,
                })
            }
            //
            allData.push({
                key: key,
                id: id,
                address: address,
                title: title,
                initiator: initiator,
                endTime: endTime,
                goal: goal,
                current: current,
                remainder: remainder,
                info: info,
                myMoney: myMoney,
                allUses: allUses
            })
        }
        this.setState({
            currentAccount: accounts[0],
            allData: allData,
            isClicked: false
        })
      } catch(e){
            message.error("众筹信息获取失败！");
      }
    }

    helpFunction = () => {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts[0] !== this.state.currentAccount) {
                this.getData();
            }
        })
    }

    async componentWillMount() {
        await this.getData();
        this.helpFunction()
    }

    async returnMoney(id){
        const currentAccount = this.state.currentAccount;
        this.setState({isClicked:true})
        try{
            await crowdFundingInstance.methods.returnMoney(id).send({
                from: currentAccount,
                gas: '3000000',
            })
            window.location.reload();
            this.setState({isClicked:false})
            message.success("退钱成功！");
        } catch(e){
            this.setState({isClicked:false})
            message.error("退钱失败！");
        }
    }

    async newFunding(title, endTime, goal, info){
        const currentAccount = this.state.currentAccount;
        let goalWei = web3.utils.toWei(goal.toString(), 'ether');
        this.setState({isClicked:true})
        try{
            await crowdFundingInstance.methods.newFunding(title, endTime, goalWei, info).send({
                from: currentAccount,
                gas: '3000000',
            });
            window.location.reload();
            this.setState({isClicked:false})
            message.success("项目创建成功！");
        } catch(e){
            this.setState({isClicked:false})
            message.error("项目创建失败！");
        }
    }

    async contribute(id, money){
        const currentAccount = this.state.currentAccount;
        this.setState({isClicked:true})
        try{
            await crowdFundingInstance.methods.contribute(id).send({
                from: currentAccount,
                value: web3.utils.toWei(money.toString(), 'ether'),
                gas: '3000000'
            })
            window.location.reload();
            this.setState({isClicked:false})
            message.success("投资成功！");
        } catch(e){
            this.setState({isClicked:false})
            message.error("投资失败！");
        }
    }

    async newUse(id, content, money){
        const currentAccount = this.state.currentAccount;
        const moneyWei = web3.utils.toWei(money.toString(), 'ether');
        this.setState({isClicked:true})
        try{
            await crowdFundingInstance.methods.newUse(id, content, moneyWei).send({
                from: currentAccount,
                gas: '3000000'
            })
            window.location.reload();
            this.setState({isClicked:false})
            message.success("使用请求发布成功！");
        } catch(e){
            this.setState({isClicked:false})
            message.error("使用请求发布失败！");
        }
    }
    
    async voteForUse(i, userId, isAgree){
        const currentAccount = this.state.currentAccount;
        this.setState({isClicked:true})
        try{
            await crowdFundingInstance.methods.voteForUse(i, userId, isAgree).send({
                from: currentAccount,
                gas: '3000000'
            })
            window.location.reload();
            this.setState({isClicked:false})
            message.success("投票成功！");
        } catch(e){
            this.setState({isClicked:false})
            message.error("投票失败！");
        }
    }

    render(){
        //this.helpFunction()
        return(
          <div>
            <MainPage 
              currentAccount = {this.state.currentAccount}
              allData = {this.state.allData}
              newFunding = {this.newFunding}
              contribute = {this.contribute}
              newUse = {this.newUse}
              voteForUse = {this.voteForUse}
              returnMoney = {this.returnMoney}
              isClicked = {this.state.isClicked}
            />        
          </div>
        );
    }
 
}

export default App;