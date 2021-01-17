import React, { Component } from 'react';
import { getFundingDetails, createRequest, showRequests, finalizeRequest } from '../../eth/interation';
import CardList from '../common/CardList';
import CreateFundingForm from './CreateFundingForm';
import { Form, Label, Segment, Button } from 'semantic-ui-react';
import RequestTable from '../common/RequestTable'

class CreatorFundingTab extends Component {

    state = {
        creatorFundingDetails: [],
        selectedFundingDetail: '',
        requestDesc: '',  //项目方花费的目的
        requestBalance: '',  //花费金额
        requestAddress: '',  //卖家地址
        requestsDeatils: [], //所有的花费请求

    }

    async componentWillMount() {
        let creatorFundingDetails = await getFundingDetails(2)
        console.table(creatorFundingDetails)

        this.setState({
            creatorFundingDetails,
        })
    }

    //传递一个回调函数给CardList，将所选择的card的详细信息返回来
    onCardClick = (selectedFundingDetail) => {
        console.log('bbbbbb:', selectedFundingDetail)
        this.setState({
            selectedFundingDetail: selectedFundingDetail
        })
    }

    //表单数据变化时触发
    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleCreateRequest = async () => {

        let { selectedFundingDetail, requestDesc, requestBalance, requestAddress } = this.state
        console.log(requestDesc, requestBalance, requestAddress)
        //创建花费请求
        try {
            await createRequest(selectedFundingDetail.fundingAddress, requestDesc, requestBalance, requestAddress)
        } catch (error) {
            console.log(error)
        }

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

    handleFinalize = async (index) => {
        console.log('终结请求',index)
        try {
            await finalizeRequest(this.state.selectedFundingDetail.fundingAddress,index)
        } catch (error) {
            console.log(error)
        }
    }

    render() {


        let { creatorFundingDetails, selectedFundingDetail, requestDesc, requestBalance, requestAddress, requestsDeatils } = this.state
        return (
            <div>
                <CardList details={creatorFundingDetails} onCardClick={this.onCardClick} />
                <CreateFundingForm />
                {
                    <div>
                        <h3>发起付款请求</h3>

                        <Segment>
                            <h4>当前项目:{selectedFundingDetail.projectName}, 地址: {selectedFundingDetail.fundingAddress}</h4>
                            <Form onSubmit={this.handleCreateRequest}>
                                <Form.Input type='text' name='requestDesc' required value={requestDesc}
                                    label='请求描述' placeholder='请求描述' onChange={this.handleChange} />

                                <Form.Input type='text' name='requestBalance' required value={requestBalance}
                                    label='付款金额' labelPosition='left' placeholder='付款金额'
                                    onChange={this.handleChange}>
                                    <Label basic>￥</Label>
                                    <input />
                                </Form.Input>

                                <Form.Input type='text' name='requestAddress' required value={requestAddress}
                                    label='商家收款地址' labelPosition='left' placeholder='商家地址'
                                    onChange={this.handleChange}>
                                    <Label basic><span role='img' aria-label='location'>📍</span></Label>
                                    <input />
                                </Form.Input>

                                <Form.Button primary content='开始请求' />
                            </Form>
                        </Segment>
                    </div>
                }

                {
                    selectedFundingDetail && (<div>
                        <Button onClick={this.handleShowRequests}>申请详情</Button>
                        <RequestTable 
                            requestsDeatils={requestsDeatils} 
                            handleFinalize={this.handleFinalize}
                            pageKey={2}
                            investorsCount={selectedFundingDetail.investorsCount}
                            />
                    </div>)
                }

            </div>

        )
    }
}

export default CreatorFundingTab



