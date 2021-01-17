import React, { Component } from 'react';
import CardExampleCard from './UI/ui'
import  PageExamplePage from './UI/ui'
import  PageExamplePage4 from './UI/ui4'
import  PageExamplePage_info from './UI/ui_fundinfo'
import moment from 'moment';
import { getKeyThenIncreaseKey } from 'antd/lib/message';
let web3 = require('./utils/InitWeb3');
let crowdfundInstance = require('./eth/Crowd_fund')


const testdata=[
  {name:'hello',age:15},{name:'hello',age:15},{name:'hello',age:15},{name:'hello',age:15}
]
class App extends Component {

    play = async () => {
        console.log('play Button click')
        //1.调用合约方法
        //2.转钱1ETH
        this.setState({ isClicked: true })
        let accounts = await web3.eth.getAccounts()
        try {
            await crowdfundInstance.methods.play().send({
                from: accounts[0],
                value: web3.utils.toWei('0.1', 'ether'),
                gas: '3000000',
            })
            window.location.reload()
            this.setState({ isClicked: false })
            alert('投注成功')
        } catch (e) {
            console.log(e)
            this.setState({ isClicked: false })
            alert('投注失败')
        }
    }
    draw = async () => {
        console.log('kaijiang Button click')
        //1.调用合约方法
        //2.转钱1ETH
        this.setState({ isClicked: true })
        let accounts = await web3.eth.getAccounts()
        try {
            await crowdfundInstance.methods.draw().send({
                from: accounts[0],
                // value: web3.utils.toWei('1', 'ether'),
                gas: '3000000',
            })
            //显示中奖人
            let winner = await crowdfundInstance.methods.winner().call()
            window.location.reload()
            this.setState({ isClicked: false })
            alert(`开奖成功!\n中奖人: ${winner}`)
        } catch (e) {
            console.log(e)
            this.setState({ isClicked: false })
            alert('开奖失败')
        }
    }

    navclick = e =>{
      this.setState({
        last_page:this.state.current,
        current:e.key
      })
     
      
    }

    nameinput = v=>{
      this.setState({
        new_project_name:v.target.value
      })
      console.log('value',v)
    }

    desinput = v=>{
      this.setState({
        new_project_des:v.target.value
      })
      console.log('value',v)
    }

    amountinput = v=>{
      this.setState({
        target_amount:v
      })
      console.log('value',v)
    }

    dateinput = now=>{
      this.setState({
        timeinput:moment(now).valueOf()
      })
    }    

    fund_click= item =>{
      
     // console.log(item.currentTarget.value)
     this.setState({
       last_page:this.state.current,
       current:'5',
        current_fund:item.currentTarget.value,
        
     })
    }

    vote_change =e=>{
      this.setState({
        vote_opinion:e.target.value
      })
    }

    vote_click=e=>{
      
      this.setState({
        vote_modal_visble:true,
        vote_id:parseInt( e.currentTarget.value)
      })
    }

    vote_cancel=()=>{
      this.setState({
        vote_modal_visble:false
      })
    }

   

    back_click =()=>{
      console.log(this.state.last_page)
      this.setState({
          current:this.state.last_page,
          last_page:'1'
      })
    }

    invest_click =()=>{
      this.setState({
        invest_modal_visble:true
      })
    }
    
    invest_cancel =()=>{
      this.setState({
        invest_modal_visble:false
      })
    }

    new_prop_click=()=>{
      this.setState({
        new_proposal_modal_visble:true
      })
    }
    
    new_prop_cancel=()=>{
      this.setState({
        new_proposal_modal_visble:false
      })
    }

    voteOnchange =e=>{
      this.setState({vote_opinion:e.value})
    }
    viewOnchange =e=>{
      //console.log('clicked',e.target.value)
       this.setState({view_option:e.target.value})
      //console.log('now',this.state.view_option)
       this.update_show_data(e)
       //this.render()
      //console.log(this.state.showfunddata )
    }

    new_prop_name =e=>{
      this.setState({new_proposal_info_name: e.target.value})
    }

    new_prop_description=e=>{
      //console.log(e,e.value)
      this.setState({
        new_proposal_info_description:e.target.value
      })
      console.log(this.state.new_proposal_info_description)
    }

    new_prop_amount=e=>{
      this.setState({
        new_proposal_info_amount:e
      })
      
    }

    update_show_data=e=>{
      let show_data=[]
      let filter=''
      //console.log('option',e.target.value)
      if(e.target.value===1){
        filter='Invester'
      }else if(e.target.value===2){
        filter='Raiser'
      }else{
        filter='all'
      }
      for(let i=0;i<this.state.crowd_funds.length;i++){
          if(filter==='all'){
            show_data.push(this.state.crowd_funds[i])
          }else{
            if(this.state.crowd_funds[i].role===filter){
              show_data.push(this.state.crowd_funds[i])
            }
          }
      }
      this.setState({showfunddata:show_data})
    }

    invest_input =e=>{
      this.setState({
        invest_amount:e
      })
    }

    withdrawal =async e=>{
      let accounts = await web3.eth.getAccounts()
      this.setState({ isClicked: true })
      let fund_id=this.state.current_fund
      console.log(e)
      let prop_id=parseInt( e.target.value)
      console.log(e.target,e.target.value)
      
      try{
        await crowdfundInstance.methods.proposal_pass(fund_id,prop_id).send({
          from:accounts[0],
          gas:'3000000',
        })
        this.setState({ isClicked: false })
        this.getfundinfo()
        
        alert('提现成功')
      }catch(e){
        console.log(e)
        this.setState({ isClicked: false })
        alert('提现失败')
      }
    }

    vote =async e=>{
      let accounts = await web3.eth.getAccounts()
      this.setState({ isClicked: true ,vote_loading:true})
      let fund_id=this.state.current_fund
      let prop_id=this.state.vote_id
      console.log(fund_id,prop_id,this.state.vote_opinion)
      try{
        await crowdfundInstance.methods.vote_for_proposal(fund_id,prop_id,this.state.vote_opinion).send({
          from:accounts[0],
          gas:'3000000',
        })
        this.setState({ isClicked: false ,vote_loading:false})
        this.getfundinfo()
        alert('投票成功')
      }catch(e){
        this.setState({ isClicked: false,vote_loading:false })
        alert('投票失败')
      }
    }

    invest =async ()=>{
      let accounts = await web3.eth.getAccounts()
      this.setState({ isClicked: true ,invest_loading:true})
      let fund_id=this.state.current_fund
      console.log(fund_id)
      try{
        console.log(this.state.invest_amount.toString())
        await crowdfundInstance.methods.invest(fund_id).send({
          from:accounts[0],
          value:web3.utils.toWei(this.state.invest_amount.toString(),'ether'),
          gas:'3000000',
        })
        this.setState({ isClicked: false ,invest_loading:false})
        this.getfundinfo()
        alert('投资成功')
      }catch(e){
        console.log(e)
        this.setState({ isClicked: false ,invest_loading:false})
        alert('投资失败')
      }
    }

    new_prop=async ()=>{
      let accounts = await web3.eth.getAccounts()

      try{
        this.setState({ isClicked: true ,new_prop_loading:true})
        if(this.state.new_proposal_info_amount<=0||this.state.new_proposal_info_amount>=this.state.crowd_funds[this.state.current_fund].current_amount){
          
          throw "Incorrect invest value"
        }
        if(this.state.new_proposal_info_amount>this.state.crowd_funds[this.state.current_fund].current_amount){
          alert("超出当前可申请提现金额总量")
          throw "超出当前可申请提现金额总量"
        }
        console.log(this.state.new_proposal_info_name,this.state.new_proposal_info_description,web3.utils.toWei(this.state.new_proposal_info_amount.toString(),'ether'),this.state.current_fund)
        await crowdfundInstance.methods.new_proposal(this.state.new_proposal_info_name,this.state.new_proposal_info_description,web3.utils.toWei(this.state.new_proposal_info_amount.toString(),'ether'),this.state.current_fund).send({
          from:accounts[0],
          
          gas:'3000000',
        })
        this.setState({ isClicked: false ,new_prop_loading:false})
        this.getfundinfo()
        alert('提案新增成功')
      }catch(e){
        console.log(e)
        this.setState({ isClicked: false,new_prop_loading:false })
        alert('提案新增失败')
      }
    }

    getfundinfo = async()=>{
      let accounts = await web3.eth.getAccounts()
      console.log('Fetching fund info')
      let crowd_funds=[]
      let fund_count= await crowdfundInstance.methods.get_fund_number().call()
      console.log("fund_count",fund_count)
      for(let i=0;i<fund_count;i++){
        let fund_info={
          index:0,
          name:'',
          description:'',
          target_amount:0,
          due:0,
          total_amount:0,
          current_amount:0,
          invest_amount:0,
          proposals:[],
          status:'',
          role:'',
          raiser:'',
          percent:0,
          progress_status:'',
          invest_visble:'none',
          invest_disable:false,
          invest_button_info:'投资',
          new_proposal_visble:'none',
          vote_visble:'none',
          vote_id:-1,
          withdrawal_disable:false,
          status_color:'black',
          progress_info:'',
          withdrawal_button_info:'提款申请'
        }
        let fund=  await crowdfundInstance.methods.get_fund_info(i).call({from:accounts[0]})
        console.log(fund)
        
        let proposal_count= await crowdfundInstance.methods.get_proposal_number(i).call()
        for(let j=0;j<proposal_count;j++){
          let proposal_info={
            index:0,
            name:'',
            description:'',
            amount:0,
            voted:0,
            votes:0,
            status:'',
            withdrawal_disable:true,
            vote_disable:true,
            opinion:'--',
            percent:0,
            agree_percent:0,
            refuse_percent:0,
            progress_status:'active',
            button_info:'',
            progress_info:'',
            total_proposal_amount:0
          }
          let proposal= await crowdfundInstance.methods.get_proposal_info(i,j).call({from:accounts[0]})
          console.log(proposal)
          proposal_info.index=j
          proposal_info.name=proposal[0]
          proposal_info.description=proposal[1]
          proposal_info.amount=web3.utils.fromWei(proposal[2], 'ether')
          
          proposal_info.voted=web3.utils.fromWei(proposal[3], 'ether')
          proposal_info.votes=web3.utils.fromWei(proposal[4], 'ether')
          proposal_info.progress_info="当前已经投票："+proposal_info.voted.toString()+", 赞成 "+proposal_info.votes.toString()+", 反对 "+(proposal_info.voted-proposal_info.votes).toString()
          proposal_info.status=proposal[5]
          proposal_info.opinion=proposal[6]
          proposal_info.withdrawal_disable=(proposal_info.status==="Passed")?false:true
          proposal_info.percent=proposal_info.voted/web3.utils.fromWei(fund[4], 'ether')*100
          proposal_info.agree_percent=proposal_info.votes/web3.utils.fromWei(fund[4], 'ether')*100
          proposal_info.agree_percent=proposal_info.votes/web3.utils.fromWei(fund[4], 'ether')*100
          if(proposal_info.status==="Passed"){
            proposal_info.button_info='提现'
          }else if(proposal_info.status==="Failed"||proposal_info.status==="Ongoing"){
            proposal_info.button_info='提现'
          }else{
            proposal_info.button_info='已提现'
          }
          if(proposal_info.status==='Passed'||proposal_info.status==='Ongoing'){
            fund_info.total_proposal_amount+=proposal_info.amount
          }
          if(!proposal_info.withdrawal_disable)
            proposal_info.progress_status="success"
          if(proposal_info.status==="Failed"){
            proposal_info.progress_status="exception"
          }
          if(proposal_info.status==="Withdrawaled")
          proposal_info.progress_status='success'
          proposal_info.vote_disable=proposal_info.opinion==="Voted"?true:false
          if(fund[7]==='Invester'){
          if(proposal_info.vote_disable){
            proposal_info.button_info='已投票'
          }else if(proposal_info.status==="Passed"){
            proposal_info.button_info='已通过'
            proposal_info.vote_disable=true
          }else
          {
            proposal_info.button_info='投票'
          }
        }
          fund_info.proposals.push(proposal_info)
        }
        fund_info.index=i
        fund_info.name=fund[0]
        fund_info.description=fund[1]
        fund_info.target_amount=web3.utils.fromWei(fund[2], 'ether')
        fund_info.due= (new Date(parseInt(fund[3]))).toString()
        fund_info.total_amount=web3.utils.fromWei(fund[4], 'ether')
        fund_info.current_amount=web3.utils.fromWei(fund[5], 'ether')
        console.log(fund_info.total_amount>=fund_info.target_amount)
        if(fund_info.total_amount-fund_info.target_amount>=0){
          fund_info.status='Success'
          fund_info.progress_status='success'
          fund_info.status_color='green'
          if( !( (new Date())<(new Date(fund_info.due)))  ){
            fund_info.invest_disable=true
            fund_info.invest_button_info='已关闭'
          }
        }else{
          
          console.log(new Date(),new Date(fund_info.due),(new Date())<(new Date(fund_info.due)))
        if(  (new Date())<(new Date(fund_info.due))  ){
          fund_info.status='Ongoing'
          fund_info.withdrawal_button_info='项目进行中'
          fund_info.status_color='black'
          fund_info.withdrawal_disable=true
          fund_info.progress_status='active'
        }else{
          fund_info.status='Failed'
          fund_info.status_color='red'
          fund_info.withdrawal_disable=true
          fund_info.withdrawal_button_info='项目已失败'
          fund_info.progress_status='exception'
          fund_info.invest_disable=true
          fund_info.invest_button_info='已关闭'
        }
      }
        fund_info.role=fund[7]
        if(fund_info.role==="Invester"){
          fund_info.invest_amount=await web3.utils.fromWei(await crowdfundInstance.methods.get_weight(i).call({from:accounts[0]}), 'ether')
        }
        fund_info.invest_visble=fund_info.role==="Raiser"?'none':'inline'
        fund_info.new_proposal_visble=fund_info.role==="Raiser"?'inline':'none'
        fund_info.vote_visble=fund_info.role==="Invester"?'inline':'none'
        console.log(fund[8])
        fund_info.raiser=fund[8].toLowerCase()
        console.log(fund_info.raiser)
        fund_info.percent=fund_info.total_amount/fund_info.target_amount*100
        fund_info.progress_info="目标金额 "+fund_info.target_amount.toString()+" ETH, 当前总计筹集到 "+fund_info.total_amount.toString()+" ETH"
        crowd_funds.push(fund_info)
      }
      console.log(crowd_funds)
      this.setState({
        crowd_funds:crowd_funds,
        showfunddata:crowd_funds,
        accounts:await web3.eth.getAccounts()
      })
    }

    newfund = async()=>{
      
      console.log('newfund Button click')
      this.setState({ isClicked: true })
      let accounts = await web3.eth.getAccounts()
      console.log(this.state.new_project_name,this.state.new_project_des,this.state.timeinput,this.state.target_amount,accounts[0])

      try {
        await crowdfundInstance.methods.new_fund(this.state.new_project_name,this.state.new_project_des,this.state.timeinput,web3.utils.toWei(this.state.target_amount.toString(), 'ether')).send({
            from: accounts[0],
            // value: web3.utils.toWei('1', 'ether'),
            gas: '3000000',
        })
        window.location.reload()
        this.setState({ isClicked: false })
        alert('成功发起新的众筹')
    } catch (e) {
        console.log(e)
        this.setState({ isClicked: false })
        alert('众筹发起失败')
    }
    }

    refund = async () => {
        console.log('tuijiang Button click')
        //1.调用合约方法
        //2.转钱1ETH
        this.setState({ isClicked: true })
        let accounts = await web3.eth.getAccounts()
        try {
            await crowdfundInstance.methods.refund().send({
                from: accounts[0],
                // value: web3.utils.toWei('1', 'ether'),
                gas: '3000000',
            })
            window.location.reload()
            this.setState({ isClicked: false })
            alert('退奖成功')
        } catch (e) {
            console.log(e)
            this.setState({ isClicked: false })
            alert('退奖失败')
        }
    }

    constructor() {
        super()
        this.state = {
            manager: '',
            round: '',
            winner: '',
            playerCounts: 0,
            balance: 0,
            players: [],
            currentAccount: '',
            isClicked: false,
            isShowButton: '',
            current:'',
            timeinput:0,
            target_amount:0,
            new_project_name:'',
            new_project_des:'',
            crowd_funds:[],
            current_fund:-1,
            last_page:'1',
            invest_modal_visble:false,
            new_proposal_modal_visble:false,
            vote_modal_visble:false,
            new_proposal_info_name:'',
            new_proposal_info_description:'',
            new_proposal_info_amount:0,
            invest_amount:0,
            vote_opinion:false,
            invest_loading:false,
            new_prop_loading:false,
            vote_loading:false,
            accounts:[],
            showfunddata:[],
            view_option:0,
        }
    }

    componentDidMount() {
    }

    async componentWillMount() {
      let accounts = await web3.eth.getAccounts()
      web3.eth.defaultAccount=accounts[0]
      
        
        this.getfundinfo()
        let current='1'
        let timeinput=moment().valueOf()
        let target_amount=0
        this.setState({
          accounts,
          current,
          timeinput,
          target_amount,
          new_project_name:'',
          new_project_des:'',
          isClicked: false
        })
    }

    helpFunction = () => {
        
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts[0]) {
                
                this.setState({ currentAccount: accounts[0]})
            }
        })
    }

    render() {
      this.helpFunction()
      if(this.state.current==='1'){
      return (
        <>
        
          <PageExamplePage
          current_account={this.state.accounts[0].toLowerCase()}
          fund_data={this.state.showfunddata}
          testdata={testdata}
          navclick={this.navclick}
          current={this.state.current}
          crowd_funds={this.state.showfunddata}
          fundclick={this.fund_click}
          view_option={this.state.view_option}
          view_change={this.viewOnchange}
          />
        
          
        </>
      );
      }else if(this.state.current==='4'){
        return(
          <>
          
            <PageExamplePage4
            current_account={this.state.accounts[0].toLowerCase()}
            testdata={testdata}
            navclick={this.navclick}
            current={this.state.current}
            timeinput={this.state.timeinput}
            dateinput={this.dateinput}
            amountinput={this.amountinput}
            target_amount={this.state.target_amount}
            nameinput={this.nameinput}
            new_project_name={this.state.new_project_name}
            new_project_des={this.state.new_project_des}
            desinput={this.desinput}
            isClicked= {this.state.isClicked}
            newfund={this.newfund}
            />
          
            
          </>
          );
      }else if(this.state.current==='5'){
        return(
          <>
        <PageExamplePage_info
        testdata={testdata}
        navclick={this.navclick}
        current={this.state.current}
        crowd_funds={this.state.crowd_funds}
        fund_data={this.state.crowd_funds[this.state.current_fund]}
        back_click={this.back_click}
        invest_modal_visble={this.state.invest_modal_visble}
          
          new_proposal_modal_visble={this.state.new_proposal_modal_visble}
          invest_click={this.invest_click}
          invest_ok={this.invest}
          invest_cancel={this.invest_cancel}
          new_prop_click={this.new_prop_click}
          new_prop_ok={this.new_prop}
          new_prop_cancel={this.new_prop_cancel}
          vote={this.vote}
          withdrawal={this.withdrawal}
          
          new_prop_name={this.new_prop_name}
          new_prop_description={this.new_prop_description}
          new_prop_amount={this.new_prop_amount}
          invest_loading={this.state.invest_loading}
          new_prop_loading={this.state.new_prop_loading}
          vote_loading={this.state.vote_loading}
          vote_modal_visble={this.state.vote_modal_visble}
          invest_input={this.invest_input}
          vote_click={this.vote_click}
          vote_cancel={this.vote_cancel}
          vote_change={this.vote_change}
          vote_opinion={this.state.vote_opinion}
          current_account={this.state.accounts[0].toLowerCase()}
        />
        </>
        );
      }else{
        return(<p>  error;  </p>)
      }
     
    }
}

export default App;