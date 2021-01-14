import React, {Component} from 'react';
import web3 from '../utils/initWeb3';
import {factoryContractInstance} from '../eth/instance';
import CardList from './common/CardList';
import {
    getFundingDetail,
    showRequests,
    agreeRequest
} from '../eth/interaction';
import {Button} from 'semantic-ui-react';
import RequestTab from './common/RequestTab';

class InvolveFundingTab extends Component {
    
    state = {
        involveFundingDetail : [],
        currentFundingDetail : '',
        requests : [],
    }

    async componentWillMount() {
        let accounts = await web3.eth.getAccounts()
        let allFundings = await factoryContractInstance.methods.getSupportorFunding().call({
            from : accounts[0]
        })
        let involveFundingDetail = await getFundingDetail(allFundings)
        this.setState({
            involveFundingDetail
        })
    }

    onClickCard = (currentFundingDetail) => {
        this.setState({
            currentFundingDetail
        })
    }

    onClickRequestDetail = async () => {
        try {
            let requests = await showRequests(this.state.currentFundingDetail.fundingAddress)
            this.setState({'requests': requests})
        } catch (e) {
            console.log(e)
        }
    }

    handleApprove = (index) => {
        try {
            console.log(this.state.currentFundingDetail.fundingAddress, index)
            agreeRequest(this.state.currentFundingDetail.fundingAddress, index)
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        return (
            <div>
                <CardList details={this.state.involveFundingDetail} onClickCard={this.onClickCard}/>
                {
                    this.state.currentFundingDetail && <div>
                        <Button onClick={this.onClickRequestDetail}>申请详情</Button>
                        <RequestTab requests={this.state.requests} tabNo={3} handleApprove={this.handleApprove}/>
                    </div>
                }
            </div>
        )
    }
}
 
export default InvolveFundingTab