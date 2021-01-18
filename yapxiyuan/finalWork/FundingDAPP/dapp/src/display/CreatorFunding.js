//发起人页面
import React, {Component} from 'react';
import {getFundingDetails,createRequest,showRequests,finalizeRequest} from '../eth/interact';
import CardList from './CardList';
import CreateNewFunding from './CreateNewFunding';
import {Form,Label,Segment,Button} from 'semantic-ui-react';
import Request from './Request';

class CreatorFunding extends Component{
    state = {
        creatorFundingDetails : [],
        selectedFundingDetail: '',
        requestDesc: '', //description
        requestBalance: '',
        requestAddress: '',
        requestsDetails: [],
    }

    async componentWillMount() {
        let creatorFundingDetails = await getFundingDetails(2)
        console.table(creatorFundingDetails)

        this.setState({
            creatorFundingDetails,
        })
    }

    //CardList function 
    onCardClick = (selectedFundingDetail) => {
        console.log('bbbbb',selectedFundingDetail)
        this.setState({
            selectedFundingDetail:selectedFundingDetail
        })
    }

    //data changed then activate function
    handleChange = (e, {name,value}) => this.setState({ [name]:value })
    handleCreateRequest = async() => {
        let {selectedFundingDetail,requestDesc,requestBalance,requestAddress} = this.state
        console.log(requestDesc,requestBalance,requestAddress)
        try{
            await createRequest(selectedFundingDetail.fundingAddress,requestDesc,requestBalance,requestAddress)
            alert('申请请求成功\n')
        }catch(error){
            console.log(error)
        }
    }
    handleShowRequests = async () =>{
        let fundingAddress = this.state.selectedFundingDetail.fundingAddress
        try{
            let requestsDetails = await showRequests(fundingAddress)
            console.log('requestsDetails:',requestsDetails)
            this.setState({
                requestsDetails:requestsDetails
            })
        }catch(err){
            console.log(err)
        }
    }
    handleFinalize = async (index) => {
        console.log('终结请求',index)
        try{
            await finalizeRequest(this.state.selectedFundingDetail.fundingAddress,index)
            alert('支付成功\n')
        }catch(error){
            console.log(error)
        }
    }

    render(){
        let{ creatorFundingDetails,selectedFundingDetail,requestDesc,requestBalance,requestAddress,requestsDetails } = this.state
        return(
            <div>
                <CardList details={creatorFundingDetails} onCardClick={this.onCardClick} />
                <h4></h4>
                <CreateNewFunding />
                {
                    <div>
                        <h1></h1>
                        <h3>发起支付请求</h3>
                        <Segment>
                            <h4>当前众筹项目 : {selectedFundingDetail.projectName}</h4>
                            <h4>地址 : {selectedFundingDetail.fundingAddress}</h4>
                            <Form onSubmit={this.handleCreateRequest}>
                                <Form.Input type = 'text' name='requestDesc' required value={requestDesc}
                                        label='请求描述' placeholder='请求描述' onChange={this.handleChange} />

                                <Form.Input type = 'text' name='requestBalance' required value={requestBalance}
                                        label='支付金额' labelPosition='left' placeholder='支付金额' onChange={this.handleChange}>
                                    <Label basic>￥</Label>
                                    <input />
                                </Form.Input>
                                
                                <Form.Input type = 'text' name='requestAddress' required value={requestAddress}
                                        label='商家收款地址' labelPosition='left' placeholder='商家收款地址' onChange={this.handleChange}>
                                    <Label basic><span role='img' aria-label='location'>📍</span></Label>
                                    <input />
                                </Form.Input>
                                <Form.Button primary content='申请请求' />

                            </Form>
                        </Segment>
                    </div>
                }

                {
                    selectedFundingDetail && (
                        <div>
                            <Button onClick={this.handleShowRequests}>申请详情</Button>
                            <Request 
                                requestsDetails = {requestsDetails}
                                handleFinalize = {this.handleFinalize}
                                pageKey={2}
                                investorsCount = {selectedFundingDetail.investorsCount}
                            />
                        </div>
                    )
                }
            </div>
        )

    }

}
export default CreatorFunding