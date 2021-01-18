import React from "react";
import FundingTable from "./FundingTable"

export default class MyCreateFunding extends React.Component {
    render(){
      const allData = this.props.allData; 
      const currentAccount = this.props.currentAccount;
      const data = allData.filter(item => item.initiator===currentAccount);
      return(
        <FundingTable {...this.props} showData={data} tableType={3}/>
        
      )
    }
}