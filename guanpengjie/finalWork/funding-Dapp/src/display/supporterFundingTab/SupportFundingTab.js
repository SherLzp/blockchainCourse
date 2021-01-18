import React, { Component } from 'react';
import { getFundingDetails, showRequests, approveRequest } from '../../eth/interation';
import CardList from '../common/CardList';
import RequestTable from '../common/RequestTable';
import { Button} from 'semantic-ui-react';


class SupportFundingTab extends Component {

    state = {
        supportFundingDetails: [],
        selectedFundingDetail: '',
        requestsDeatils:[], //所有的花费请求
    }

    async componentWillMount() {
        let supportFundingDetails = await getFundingDetails(3)
        console.table(supportFundingDetails)

        this.setState({
            supportFundingDetails,
        })
    }

    //传递一个回调函数给CardList，将所选择的card的详细信息返回来
    onCardClick = (selectedFundingDetail) => {
        console.log('ccccc:', selectedFundingDetail)
        this.setState({
            selectedFundingDetail: selectedFundingDetail
        })
    }

    handleShowRequests = async () => {
        let fundingAddress = this.state.selectedFundingDetail.fundingAddress
        try {
            let requestsDeatils =  await showRequests(fundingAddress)
            console.log('requestsDeatils:',requestsDeatils)
            this.setState({
                requestsDeatils:requestsDeatils
            })
        } catch (error) {
            console.log(error)
        }
    }

    handleApprove = async (index) => {
        console.log('批准按钮点击',index)
        //1.指定合约地址
        //2.指定选择请求的index
        try {
            await approveRequest(this.state.selectedFundingDetail.fundingAddress,index)
        } catch (error) {
            console.log(error)
        }

    }

    render() {

        let {selectedFundingDetail,requestsDeatils} = this.state
        return (
            <div>
                <CardList details={this.state.supportFundingDetails} onCardClick={this.onCardClick}/>

                {
                    selectedFundingDetail && (<div>
                        <Button onClick={this.handleShowRequests}>申请详情</Button>
                        <RequestTable 
                            requestsDeatils={requestsDeatils} 
                            handleApprove={this.handleApprove}
                            pageKey={3}
                            investorsCount={selectedFundingDetail.investorsCount}
                            />
                    </div>)
                }
            </div>

        )
    }
}

export default SupportFundingTab