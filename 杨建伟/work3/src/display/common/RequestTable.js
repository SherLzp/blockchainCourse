import React from 'react'
import {Button, Table} from 'semantic-ui-react'

const RequestTable = (props) => {

    let {requests, handleApprove, pageKey, handleFinalize, investorCount} = props
    console.log('aaaaaa:', handleApprove)
    //遍历request，每一个request都生成一个Table.Row（一行）

    //map(数据，索引)
    let rowContainer = requests.map((request, i) => {
        return <RowInfo key={i}
                        request={request}
                        handleApprove1={handleApprove}
                        handleFinalize={handleFinalize}
                        index={i}
                        pageKey={pageKey}
                        investorCount={investorCount}
        />
    })


    return (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>花费描述</Table.HeaderCell>
                    <Table.HeaderCell>花费金额</Table.HeaderCell>
                    <Table.HeaderCell>商家地址</Table.HeaderCell>
                    <Table.HeaderCell>当前赞成人数</Table.HeaderCell>
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

    let {request, handleApprove1, index, pageKey, handleFinalize, investorCount} = props
    console.log('bbbbbb:', handleApprove1)
    // return (req.purpose, req.cost, req.seller, req.approveCount, req.status);
    let {0: purpose, 1: cost, 2: seller, 3: approveCount, 4: status} = request

    let statusInfo = ''

    if (status == 0) {
        statusInfo = 'voting'
    } else if (status == 1) {
        statusInfo = 'approved'
    } else if (status == 2) {
        statusInfo = 'complete'
    }


    console.log(purpose, cost, seller, approveCount, status)

    return (
        <Table.Row>
            <Table.Cell>{purpose}</Table.Cell>
            <Table.Cell>{cost}</Table.Cell>
            <Table.Cell>{seller}</Table.Cell>
            <Table.Cell>{approveCount}/{investorCount}</Table.Cell>
            <Table.Cell>{statusInfo}</Table.Cell>
            <Table.Cell>
                {
                    (pageKey == 2) ? (
                        <Button onClick={() => handleFinalize(index)}>支付</Button>
                    ) : (
                        <Button onClick={() => handleApprove1(index)}>批准</Button>
                    )
                }
            </Table.Cell>
        </Table.Row>
    )
}

export default RequestTable
