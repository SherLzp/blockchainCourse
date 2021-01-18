import React from "react";
import FundingTable from "./FundingTable"

export default class UnfinishFunding extends React.Component {
    render(){
      const allData = this.props.allData; 
      const data = allData.filter(item => {
        console.log(item.current-item.goal<0);
        return((item.current-item.goal<0 && item.endTime*1000>(new Date()).getTime()));
      })
      return(
        <FundingTable {...this.props} showData={data} tableType={2}/>
      )
    }
}