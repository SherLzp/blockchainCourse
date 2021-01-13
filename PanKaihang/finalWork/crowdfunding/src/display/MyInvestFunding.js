import React from "react";
import FundingTable from "./FundingTable"

export default class MyInvestFunding extends React.Component {
    render(){
      const allData = this.props.allData; 
      //const currentAccount = this.props.currentAccount;
      const data = allData.filter(item => parseInt(item.myMoney) !== 0);
      return(
        <FundingTable {...this.props} showData={data} tableType={4}/>
        
      )
    }
}