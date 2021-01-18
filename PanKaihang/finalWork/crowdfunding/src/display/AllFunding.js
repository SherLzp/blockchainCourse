import React from "react";
import FundingTable from "./FundingTable";

export default class AllFunding extends React.Component {
    render(){
      const allData = this.props.allData; 
      return(
        <FundingTable {...this.props} showData={allData} tableType={1}/>
      )
    }
}
