import React from 'react';
import { Table ,Button} from 'semantic-ui-react';

const RequestTable = (props) => {
    let {requestsDeatils,handleApprove,pageKey,handleFinalize,investorsCount} = props
    //便利requestsDeatils，每一个requestsDeatil生成一行（Table.Row）

    let rowContainer =  requestsDeatils.map((requestsDeatil,i) => {

        return <RowInfo 
            key={i} 
            requestsDeatil={requestsDeatil} 
            handleApprove={handleApprove} 
            index={i} 
            pageKey={pageKey}
            handleFinalize={handleFinalize}
            investorsCount={investorsCount}
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
)}

let RowInfo = (props) => {
    let {requestsDeatil,handleApprove,index,pageKey,handleFinalize,investorsCount} = props
    //req.purpose,req.cost,req.shopAddress,req.approveCount,req.status
    let {0:purpose,1:cost,2:shopAddress,3:isVoted,4:voteCount,5:status} = requestsDeatil

    let statusInfo = ''

    if (status === '0') {
        statusInfo = 'voting'
    } else if (status === '1') {
        statusInfo = 'approved'
    } else if (status === '2') {
        statusInfo = 'complete'
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


export default RequestTable