//所有众筹项目页面
import React , {Component } from 'react';
import { getFundingDetails, handleInvestFunc } from '../eth/interact';
import CardList from './CardList';
import { Dimmer , Form , Label , Loader , Segment } from 'semantic-ui-react';

class AllFunding extends Component{
    state = {
        active : false,
        allFundingDetails : [],
        selectedFundingDetail : '',
    }

    async componentWillMount(){
        let allFundingDetails = await getFundingDetails(1)
        console.table(allFundingDetails)

        this.setState({
            allFundingDetails,
        })
    }

    //返回一个回调函数给CardList
    onCardClick = (selectedFundingDetail) => {
        console.log('aaaaa : ',selectedFundingDetail)
        this.setState({
            selectedFundingDetail:selectedFundingDetail
        })
    }

    handleInvest = async() => {
        this.setState({active:true})
        let{fundingAddress, investBalance} = this.state.selectedFundingDetail
        //send a clicked contract address
        try{
            await handleInvestFunc(fundingAddress, investBalance)
            alert('参与众筹项目成功\n')
            this.setState({active:false})
        }catch(error){
            console.log(error)
            this.setState({active:false})
        }
    }

    render(){
        let {fundingAddress, projectName, investBalance} = this.state.selectedFundingDetail
        return(
            <div>
                <h3>所有的众筹项目</h3>
                <CardList details={this.state.allFundingDetails} onCardClick={this.onCardClick}/>
                <div>
                    <h1></h1>
                    <Dimmer.Dimmable as = {Segment} dimmed={this.state.active}>
                        <Dimmer active={this.state.active} inverted>
                            <Loader>参与众筹</Loader>
                        </Dimmer>
                        <Form onSubmit={this.handleInvest}>
                            <Form.Input type = 'text' value={projectName || ''} label='项目名称 : '/>
                            <Form.Input type = 'text' value={fundingAddress || ''} label='项目地址 : '/>
                            <Form.Input type = 'text' value={investBalance || ''} label='固定投资金额 : ' labelPosition='left'>
                                <Label basic>￥</Label>
                                <input />
                            </Form.Input>
                            <Form.Button primary content = '参与众筹' />
                        </Form>
                    </Dimmer.Dimmable>
                </div>
            </div>
        )
    }
}

export default AllFunding