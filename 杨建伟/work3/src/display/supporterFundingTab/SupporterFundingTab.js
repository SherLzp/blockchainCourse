import React, {Component} from 'react';
import {approveRequest, getFundingDetails, showRequests} from '../../eth/interaction'
import CardList from "../common/CardList";
import RequestTable from "../common/RequestTable";
import {Button} from 'semantic-ui-react'

class SupporterFundingTab extends Component {

    state = {
        supporterFundingDetails: [],
        seletedFundingDetail: '',
        requests: [], //所有的花费请求
        show:false
    }

    async componentWillMount() {
        //funding地址的数组
        let supporterFundingDetails = await getFundingDetails(3)
        // console.table(creatorFundingDetails)
        console.log('xxxx', supporterFundingDetails)


        this.setState({
            supporterFundingDetails
        })
    }

    //传递一个回调函数给CardList，将所选择的Card的详细信息返回来
    onCardClick = (seletedFundingDetail) => {
        console.log("ccc :", seletedFundingDetail)

        this.setState({
            seletedFundingDetail
        })
    }

    handleShowRequests = async () => {
        let fundingAddress = this.state.seletedFundingDetail.fundingAddress
        try {
            let requests = await showRequests(fundingAddress)
            console.log('requests:', requests)
            this.setState({requests})
            this.setState({show:true})

        } catch (e) {
            console.log(e)
        }
    }

    handleApprove = async (index) => {
        console.log('批准按钮点击!', index)
        //1. 指定合约地址
        //2. 指定选择请求的index
        try {
            let res = await approveRequest(this.state.seletedFundingDetail.fundingAddress, index)
        } catch (e) {
            console.log(e)
        }

    }

    render() {
        let {supporterFundingDetails, seletedFundingDetail, requests} = this.state
        return (
            <div>
                <CardList details={supporterFundingDetails}
                          onCardClick={this.onCardClick}
                />
                {
                    seletedFundingDetail && (<div>
                        <Button onClick={this.handleShowRequests}>申请详情</Button>
                        {
                            this.state.show?
                        <RequestTable requests={requests}
                                      handleApprove={this.handleApprove}
                                      pageKey={3}
                        />:null
                        }   
                    </div>)
                }
            </div>
        )
    }
}

export default SupporterFundingTab
