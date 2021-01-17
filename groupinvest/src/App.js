import './App.css';
import React, { Component } from 'react';
import  Page1 from './Pages/page1'
import  Page2 from './Pages/page2'
import  InfoPage from './Pages/infopage'
import moment from 'moment';
let web3 = require('./utils/InitWeb3');
let investInstance = require('./eth/Invest')


class App extends Component {

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
        investments:[],
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
    }
}

render() {
  if(this.state.current==='1'){
  return (
      <Page1
      fund_data={this.state.showfunddata}
      navclick={this.navclick}
      current={this.state.current}
      investments={this.state.showfunddata}
      fundclick={this.fund_click}
      />
  );
  }else if(this.state.current==='2'){
    return(
        <Page2
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
      );
  }else if(this.state.current==='3'){
    return(
    <InfoPage
    navclick={this.navclick}
    current={this.state.current}
    investments={this.state.investments}
    fund_data={this.state.investments[this.state.current_fund]}
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
    );
  }else{
    return(<p>  error;  </p>)
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

     this.setState({
       last_page:this.state.current,
       current:'3',
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

    new_prop_name =e=>{
      this.setState({new_proposal_info_name: e.target.value})
    }

    new_prop_description=e=>{
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
      if(e.target.value===1){
        filter='Invester'
      }else if(e.target.value===2){
        filter='Raiser'
      }else{
        filter='all'
      }
      for(let i=0;i<this.state.investments.length;i++){
          if(filter==='all'){
            show_data.push(this.state.investments[i])
          }else{
            if(this.state.investments[i].role===filter){
              show_data.push(this.state.investments[i])
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
        await investInstance.methods.proposal_pass(fund_id,prop_id).send({
          from:accounts[0],
          gas:'500000',
        })
        this.setState({ isClicked: false })
        this.getfundinfo()
        
        alert('Withdraw Succeed')
      }catch(e){
        console.log(e)
        this.setState({ isClicked: false })
        alert('Withdraw Failed')
      }
    }

    vote =async e=>{
      let accounts = await web3.eth.getAccounts()
      this.setState({ isClicked: true ,vote_loading:true})
      let fund_id=this.state.current_fund
      let prop_id=this.state.vote_id
      console.log(fund_id,prop_id,this.state.vote_opinion)
      try{
        await investInstance.methods.vote_for_proposal(fund_id,prop_id,this.state.vote_opinion).send({
          from:accounts[0],
          gas:'500000',
        })
        this.setState({ isClicked: false ,vote_loading:false})
        this.getfundinfo()
        alert('Vote Succeeded')
      }catch(e){
        this.setState({ isClicked: false,vote_loading:false })
        alert('Vote Failed')
      }
    }

    invest =async ()=>{
      let accounts = await web3.eth.getAccounts()
      this.setState({ isClicked: true ,invest_loading:true})
      let fund_id=this.state.current_fund
      console.log(fund_id)
      try{
        console.log(this.state.invest_amount.toString())
        await investInstance.methods.invest(fund_id).send({
          from:accounts[0],
          value:web3.utils.toWei(this.state.invest_amount.toString(),'ether'),
          gas:'500000',
        })
        this.setState({ isClicked: false ,invest_loading:false})
        this.getfundinfo()
        alert('Invest Completed')
      }catch(e){
        console.log(e)
        this.setState({ isClicked: false ,invest_loading:false})
        alert('Invest Failed')
      }
    }

    new_prop=async ()=>{
      let accounts = await web3.eth.getAccounts()
      try{
        this.setState({ isClicked: true ,new_prop_loading:true})
        if(this.state.new_proposal_info_amount<=0||this.state.new_proposal_info_amount>=this.state.investments[this.state.current_fund].current_amount){
          
          throw "Incorrect invest value"
        }
        console.log(this.state.new_proposal_info_name,this.state.new_proposal_info_description,web3.utils.toWei(this.state.new_proposal_info_amount.toString(),'ether'),this.state.current_fund)
        await investInstance.methods.new_proposal(this.state.new_proposal_info_name,this.state.new_proposal_info_description,web3.utils.toWei(this.state.new_proposal_info_amount.toString(),'ether'),this.state.current_fund).send({
          from:accounts[0],
          
          gas:'500000',
        })
        this.setState({ isClicked: false ,new_prop_loading:false})
        this.getfundinfo()
        alert('Proposal Added')
      }catch(e){
        console.log(e)
        this.setState({ isClicked: false,new_prop_loading:false })
        alert('Proposal Failed')
      }
    }

    getfundinfo = async()=>{
      let accounts = await web3.eth.getAccounts()
      console.log('Fetching fund info')
      let investments=[]
      let fund_count= await investInstance.methods.get_fund_number().call()
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
          invest_button_info:'Invest',
          new_proposal_visble:'none',
          vote_visble:'none',
          vote_id:-1
          
        }
        let fund=  await investInstance.methods.get_fund_info(i).call({from:accounts[0]})
        console.log(fund)
        
        let proposal_count= await investInstance.methods.get_proposal_number(i).call()
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
            button_info:''
          }
          let proposal= await investInstance.methods.get_proposal_info(i,j).call({from:accounts[0]})
          console.log(proposal)
          proposal_info.index=j
          proposal_info.name=proposal[0]
          proposal_info.description=proposal[1]
          proposal_info.amount=web3.utils.fromWei(proposal[2], 'ether')
          proposal_info.voted=web3.utils.fromWei(proposal[3], 'ether')
          proposal_info.votes=web3.utils.fromWei(proposal[4], 'ether')
          proposal_info.status=proposal[5]
          proposal_info.opinion=proposal[6]
          proposal_info.withdrawal_disable=(proposal_info.status==="Passed")?false:true
          proposal_info.percent=proposal_info.voted/web3.utils.fromWei(fund[4], 'ether')*100
          proposal_info.agree_percent=proposal_info.votes/web3.utils.fromWei(fund[4], 'ether')*100
          proposal_info.agree_percent=proposal_info.votes/web3.utils.fromWei(fund[4], 'ether')*100
          if(proposal_info.status==="Passed"){
            proposal_info.button_info='Withdraw'
          }else if(proposal_info.status==="Failed"||proposal_info.status==="In Progress"){
            proposal_info.button_info='Withdraw'
          }else{
            proposal_info.button_info='Withdrawn'
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
            proposal_info.button_info='Voted'
          }else if(proposal_info.status==="Passed"){
            proposal_info.button_info='Passed'
            proposal_info.vote_disable=true
          }else
          {
            proposal_info.button_info='Vote'
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
          if( !( (new Date())<(new Date(fund_info.due)))  ){
            fund_info.invest_disable=true
            fund_info.invest_button_info='Closed'
          }
        }else{
          
          console.log(new Date(),new Date(fund_info.due),(new Date())<(new Date(fund_info.due)))
        if(  (new Date())<(new Date(fund_info.due))  ){
          fund_info.status='In Progress'
          fund_info.progress_status='active'
        }else{
          fund_info.status='Failed'
          fund_info.progress_status='exception'
          fund_info.invest_disable=true
          fund_info.invest_button_info='Closed'
        }
      }
        fund_info.role=fund[7]
        if(fund_info.role==="Invester"){
          fund_info.invest_amount=await web3.utils.fromWei(await investInstance.methods.get_weight(i).call({from:accounts[0]}), 'ether')
        }
        fund_info.invest_visble=fund_info.role==="Raiser"?'none':'inline'
        fund_info.new_proposal_visble=fund_info.role==="Raiser"?'inline':'none'
        fund_info.vote_visble=fund_info.role==="Invester"?'inline':'none'
        console.log(fund[8])
        fund_info.raiser=fund[8].toLowerCase()
        console.log(fund_info.raiser)
        fund_info.percent=fund_info.total_amount/fund_info.target_amount*100
        
        investments.push(fund_info)
      }
      console.log(investments)
      this.setState({
        investments:investments,
        showfunddata:investments,
        accounts:await web3.eth.getAccounts()
      })
    }

    newfund = async()=>{
      
      console.log('newfund Button click')
      this.setState({ isClicked: true })
      let accounts = await web3.eth.getAccounts()
      console.log(this.state.new_project_name,this.state.new_project_des,this.state.timeinput,this.state.target_amount,accounts[0])

      try {
        await investInstance.methods.new_fund(this.state.new_project_name,this.state.new_project_des,this.state.timeinput,web3.utils.toWei(this.state.target_amount.toString(), 'ether')).send({
            from: accounts[0],
            gas: '500000',
        })
        window.location.reload()
        this.setState({ isClicked: false })
        alert('New Fund Launched')
    } catch (e) {
        console.log(e)
        this.setState({ isClicked: false })
        alert('Fund Launching Failed')
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
          current,
          timeinput,
          target_amount,
          new_project_name:'',
          new_project_des:'',
          isClicked: false
        })
    }

    helpFunction = () => {
        let manager = this.state.manager.toLowerCase()
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts[0]) {
                let isShowButton = accounts[0].toLowerCase() === manager ? 'inline' : 'none'
                this.setState({ currentAccount: accounts[0], isShowButton: isShowButton })
            }
        })
    }
}

export default App;