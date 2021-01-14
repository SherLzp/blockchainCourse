import React from 'react'
import {Button} from 'antd'
import {getPronum,openPro,returnProAdd,getAPro,contribute,getProMes,needMoney,getonerequire,approveuse} from '../function/function.js'

class home extends React.Component {


  constructor(props) {
      super(props);
      this.state={
          balance:0,
          add:[],
          promes:"",
      }
  }

  handle=async ()=>{
      try{
          console.log(1);
          await openPro('wan','wanle',100,3);
          let balance=await getPronum();
          this.setState({
              balance:balance,
          });
          alert('success');
      }catch(error){
          console.log(error);
      }
  };

  handle2=async ()=>{
      try{
          await contribute(0,90);
          let message=await getProMes(0);
          this.setState({
              promes:message,
          });
          alert('success');
      }catch(error){
          console.log(error);
      }
  };

  handle3=async ()=>{
      try{
          await needMoney(0,'wan',50);
          let message=await getProMes(0);
          let require=await getonerequire(0,0);
          this.setState({
              promes:message,
          });
          console.log(require);
          console.log(message);
          alert('success');
      }catch(error){
          console.log(error);
      }
  };

  handle4=async ()=>{
      try{
          await approveuse(0,1,true);
          let message=await getProMes(0);
          this.setState({
              promes:message,
          });
          console.log(message);
      }catch(error){
          console.log(error);
      }
  };

  async componentDidMount() {
      let balance=await getPronum();
      console.log(balance);
      let add=await returnProAdd();
      let message=await getProMes(0);
      this.setState({
          balance:balance,
          add:add,
          promes:message,
      });
      console.log(this.state.add);
      console.log(this.state.promes);
  }

  showmessage=()=>{
      if(this.state.promes==="")
          return "";
      else{
          return this.state.promes.creator+" "+this.state.promes.state+" "+this.state.promes.nowmoney;
      }
  };

  render() {
    return (
      <div>
        <h1>Hello, World!</h1>
        <h1>{this.state.balance}</h1>
        <h1>{this.showmessage()}</h1>
        <Button onClick={this.handle}>创建</Button>
        <Button onClick={this.handle2}>投资</Button>
        <Button onClick={this.handle3}>要钱</Button>
        <Button onClick={this.handle4}>同意用钱</Button>
      </div>
    );
  }
}

export default home;