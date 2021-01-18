import React, {Component} from 'react';
import {createRequest, finalizeRequest, getFundingDetails, showRequests} from '../../eth/interaction'
import CardList from '../common/CardList';
import CreateFundingForm from './CreateFundingForm';
import {Button, Form, Label, Segment} from 'semantic-ui-react'
import RequestTable from "../common/RequestTable";

class CreatorFundingTab extends Component {

    state = {
        creatorFundingDetails: [],
        seletedFundingDetail: '',
        requestDesc: '', //purpose ， 项目方花费的目的
        requestBalance: '', //cost， 花费金额
        requestAddress: '', //seller, 卖家地址
        requests: [], //所有的花费请求
        show:false,
        showPay:false
    }

    async componentWillMount() {
        //funding地址的数组
        let creatorFundingDetails = await getFundingDetails(2)
        // console.table(creatorFundingDetails)
        console.log('xxxx', creatorFundingDetails)


        this.setState({
            creatorFundingDetails
        })
    }

    //传递一个回调函数给CardList，将所选择的Card的详细信息返回来
    onCardClick = (seletedFundingDetail) => {
        console.log("bbbb :", seletedFundingDetail)

        this.setState({
            seletedFundingDetail
        })
        this.setState({
            showPay:true
        })
    }

    //表单数据数据变化时触发
    handleChange = (e, {name, value}) => this.setState({[name]: value})

    handleCreateRequest = async () => {
        let {creatorFundingDetails, seletedFundingDetail, requestDesc, requestBalance, requestAddress} = this.state
        console.log(requestDesc, requestBalance, requestAddress)

        //创建花费请求
        // function createRequest(string _purpose, uint256 _cost, address _seller) onlyManager public {
        try {
            console.log(seletedFundingDetail.fundingAddress);
            let res = await createRequest(seletedFundingDetail.fundingAddress, requestDesc, requestBalance, requestAddress)
            console.log(res);
        } catch (e) {
            console.log(e)
        }
    }

    handleShowRequests = async () => {
        let fundingAddress = this.state.seletedFundingDetail.fundingAddress
        try {
            let requests = await showRequests(fundingAddress)
            console.log('requests:', requests)
            this.setState({requests})

        } catch (e) {
            console.log(e)
        }
    }

    handleFinalize = async (index) => {
        console.log('终结请求:', index)

        let address = this.state.seletedFundingDetail.fundingAddress

        try {
            let res = await finalizeRequest(address, index)
        } catch (e) {
            console.log(e)
        }
    }

    showCreateForm = async() => {
        this.setState({
            show:!this.state.show
        })
    }

    render() {
        let {
            creatorFundingDetails, seletedFundingDetail,
            requestDesc, requestBalance, requestAddress,
            requests,

        } = this.state

        return (
            <div>
                <CardList details={creatorFundingDetails}
                          onCardClick={this.onCardClick}
                />

                {
                    this.state.showPay?
                    <div>
                        <h3>发起付款</h3>

                        <Segment>
                            <h4>当前项目:{seletedFundingDetail.projectName}, 地址: {seletedFundingDetail.fundingAddress}</h4>
                            <Form onSubmit={this.handleCreateRequest}>
                                <Form.Input type='text' name='requestDesc' required value={requestDesc}
                                            label='请求描述' placeholder='请求描述' onChange={this.handleChange}/>

                                <Form.Input type='text' name='requestBalance' required value={requestBalance}
                                            label='付款金额' labelPosition='left' placeholder='付款金额'
                                            onChange={this.handleChange}>
                                    <input/>
                                </Form.Input>

                                <Form.Input type='text' name='requestAddress' required value={requestAddress}
                                            label='商家收款地址' labelPosition='left' placeholder='商家地址'
                                            onChange={this.handleChange}>
                                    <input/>
                                </Form.Input>

                                <Form.Button primary content='开始请求'/>
                            </Form>
                        </Segment>
                    </div>:null
                }

                {
                    seletedFundingDetail && (<div>
                        <Button onClick={this.handleShowRequests}>申请详情</Button>
                        <RequestTable requests={requests}
                                      handleFinalize={this.handleFinalize}
                                      pageKey={2}
                                      investorCount={seletedFundingDetail.investorCount}
                        />
                    </div>)
                }

                <br />
                <Button onClick={this.showCreateForm}>创建众筹</Button>
                {
                    this.state.show?
                    <CreateFundingForm/>:null
                }
            </div>
        )
    }
}

export default CreatorFundingTab
