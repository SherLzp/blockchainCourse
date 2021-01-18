import React from 'react'
import { Button, Label, Table } from 'semantic-ui-react'

const RequestTab = (props) => {
    let MyRow = (props) => {
        let {request, handleApprove, index, tabNo, handleFinishRequest} = props
        let {0:purpose, 1:cost, 2:seller, 3:approveCount, 4:status} = request

        return (
            <Table.Row>
                <Table.Cell>
                    <Label ribbon>{purpose}</Label>
                </Table.Cell>
                <Table.Cell>{cost}</Table.Cell>
                <Table.Cell>{seller}</Table.Cell>
                <Table.Cell>{approveCount}</Table.Cell>
                <Table.Cell>{status}</Table.Cell>
                <Table.Cell>
                {
                    tabNo == 2 ?  <Button onClick={() => handleFinishRequest(index)}>支付</Button> : <Button onClick={() => handleApprove(index)}>批准</Button>
                }
                </Table.Cell>
            </Table.Row>
        )
    }
    
    let {requests, handleApprove, handleFinishRequest, tabNo} = props
    console.log(requests)
    console.log(tabNo)
    let rows = requests.map((request, i) => {
        return <MyRow 
            key={i} 
            request={request} 
            handleApprove = {handleApprove}
            index={i}
            tabNo={tabNo}
            handleFinishRequest={handleFinishRequest}
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
            <Table.Body>{rows}</Table.Body>
        </Table>
   )
}

export default RequestTab