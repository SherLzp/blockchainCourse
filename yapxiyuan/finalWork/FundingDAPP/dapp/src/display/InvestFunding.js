//投资人所投资的众筹页面
import React, { Component } from 'react';
import { getFundingDetails, showRequests, approveRequest } from '../eth/interact';
import CardList from '../display/CardList';
import Request from '../display/Request';
import { Button} from 'semantic-ui-react';

class InvestFunding extends Component{
    state={
        investFundingDetails : [],
        selectedFundingDetail: '',
        requestsDetails:[],
    }

    async componentWillMount(){
        let investFundingDetails = await getFundingDetails(3)
        console.table(investFundingDetails)
        this.setState({
            investFundingDetails,
        })
    }

    //CardList function 
    onCardClick = (selectedFundingDetail) => {
        console.log('ccccc:', selectedFundingDetail)
        this.setState({
            selectedFundingDetail: selectedFundingDetail
        })
    }

    //data change 
    handleShowRequests = async() => {
        let fundingAddress = this.state.selectedFundingDetail.fundingAddress
        try {
            let requestsDetails = await showRequests(fundingAddress)
            console.log('requestsDetails:',requestsDetails)
            this.setState({
                requestsDetails:requestsDetails
            })
        } catch (error) {
            console.log(error)
        }
    }
    handleApprove = async(index) => {
        console.log('批准按钮点击',index)
        //指定合约的地址
        //指定批准的request index
        try{
            await approveRequest(this.state.selectedFundingDetail.fundingAddress,index)
            alert('批准成功\n')
        }catch(error){
            console.log(error)
        }
    }

    render(){
        let {selectedFundingDetail,requestsDetails} = this.state
        return(
            <div>
                <CardList details={this.state.investFundingDetails} onCardClick={this.onCardClick}/>
                {
                    selectedFundingDetail && (
                        <div>
                            <Button onClick={this.handleShowRequests}>申请详情</Button>
                            <Request
                                requestsDetails={requestsDetails}
                                handleApprove={this.handleApprove}
                                pageKey={3}
                                investorsCount = {selectedFundingDetail.investorsCount}
                            />
                        </div>
                    )
                }
            </div>
        )
    
    }
}
export default InvestFunding