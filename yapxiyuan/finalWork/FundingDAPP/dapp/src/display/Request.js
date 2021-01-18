import React from 'react';
import { Table ,Button } from 'semantic-ui-react';

const Request = (props) => {
    let {requestsDetails,handleApprove,pageKey,handleFinalize,investorsCount} = props

    //rows of requests
    let rowContainer = requestsDetails.map((requestsDetails,i) => {
        return <RowInfo 
            key = {i}
            requestsDetail={requestsDetails}
            handleApprove = {handleApprove}
            index = {i}
            pageKey = {pageKey}
            handleFinalize = {handleFinalize}
            investorsCount = {investorsCount}
            />
    })

    return(
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>请求描述</Table.HeaderCell>
                    <Table.HeaderCell>支付金额</Table.HeaderCell>
                    <Table.HeaderCell>商家地址</Table.HeaderCell>
                    <Table.HeaderCell>当前同意人数</Table.HeaderCell>
                    <Table.HeaderCell>当前状态</Table.HeaderCell>
                    <Table.HeaderCell>操作</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    rowContainer
                }
            </Table.Body>
        </Table>
    )
}

let RowInfo = (props) => {
    let {requestsDetail,handleApprove,index,pageKey,handleFinalize,investorsCount} = props
    //struct of Request
    let{0:purpose,1:cost,2:shopAddress,3:isVoted,4:voteCount,5:status} = requestsDetail
    let statusInfo = ''

    if(status === '0'){
        statusInfo = 'Voting'
    }else if(status === '1'){
        statusInfo = 'Approved'
    }else if(status === '2'){
        statusInfo = 'Completed'
    }
    return (
        <Table.Row>
            <Table.Cell>{purpose}</Table.Cell>
            <Table.Cell>{cost}</Table.Cell>
            <Table.Cell>{shopAddress}</Table.Cell>
            <Table.Cell>{voteCount}/{investorsCount}</Table.Cell>
            <Table.Cell>{statusInfo}</Table.Cell>
            <Table.Cell>
                {
                    (pageKey === 2) ? (
                        <Button onClick={() => handleFinalize(index)}>支付</Button>
                    ) : (
                        <Button onClick={() => handleApprove(index)}>批准</Button>
                    )
                }
            </Table.Cell>
        </Table.Row>
    )
}

export default Request