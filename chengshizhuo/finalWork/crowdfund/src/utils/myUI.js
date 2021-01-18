import React, { Component } from 'react'
import { Button, Card, Table, Form } from 'semantic-ui-react'


const GetListV = (props)=>{
    var addr = props.address
    var vstate = props.votestate
    var vtar = props.voteneed
    var vstr = props.voteproposal
    var idx = []
    addr.map((item,index)=>{
        if(vstate[index]>=0 ){
            idx.push(index)
        }
    })
    console.log(props)
    console.log("osofjosf")
    const myItem = idx.map((item,index)=>{
        let tmp =(vstate[item]==0 && vtar[item] == 0)?'Not Start':(vstate[item]==1)?'Succeed':(vstate[item]==2)?'Fail':'Going on '
        return(
            <Table.Row>
                <Table.Cell>
                    {addr[item]}
                </Table.Cell>
                <Table.Cell>
                    {vtar[item]}
                </Table.Cell>
                <Table.Cell>
                    {vstr[item]}
                </Table.Cell>
                <Table.Cell>
                    {tmp}
                </Table.Cell>
            </Table.Row>
        )
    })
    return(
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>address</Table.HeaderCell>
                    <Table.HeaderCell>need</Table.HeaderCell>
                    <Table.HeaderCell>details</Table.HeaderCell>
                    <Table.HeaderCell>status</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {myItem}
            </Table.Body>
        </Table>        
    )
}



const GetList1 = (props)=>{
    console.log("in GetList1")
    var addr = props.address
    var tar = props.goallist
    var got = props.gotlist
    const myItem = addr.map((item,index)=>{
        return(
            <Table.Row>
                <Table.Cell>
                    {addr[index]}
                </Table.Cell>
                <Table.Cell>
                    {tar[index]}
                </Table.Cell>
                <Table.Cell>
                    {got[index]}
                </Table.Cell>
            </Table.Row>
        )
    })
    console.log("out")
    return(
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>address</Table.HeaderCell>
                    <Table.HeaderCell>goal</Table.HeaderCell>
                    <Table.HeaderCell>got</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {myItem}
            </Table.Body>
        </Table>
    )
}

const GetList2 = (props)=>{
    console.log("in GetList2")
    var addr = props.address
    var str = props.strlist
    var tar = props.goallist
    var got = props.gotlist
    var ddl = props.timelist
    console.log("wtfffffffff")
    console.log(addr)
    console.log(tar)
    console.log(got)
    const myItem = addr.map((item,index)=>{
        return(
            <Table.Row>
                <Table.Cell>{str[index]}</Table.Cell>
                <Table.Cell>{addr[index]}</Table.Cell>
                <Table.Cell>{tar[index]}</Table.Cell>
                <Table.Cell>{got[index]}</Table.Cell>
                <Table.Cell>{ddl[index]}</Table.Cell>
            </Table.Row>
        )
    })
    console.log("out")
    return(
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>details</Table.HeaderCell>
                    <Table.HeaderCell>address</Table.HeaderCell>
                    <Table.HeaderCell>goal</Table.HeaderCell>
                    <Table.HeaderCell>got</Table.HeaderCell>
                    <Table.HeaderCell>ddl</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {myItem}
            </Table.Body>
        </Table>
    )
}

const GetListByidx = (props) =>{
    var idx = props.index
    var addr = []
    var tar = []
    var got = []
    for(let i in idx){
        let x = idx[i]
        addr.push(props.address[x])
        tar.push(props.goallist[x])
        got.push(props.gotlist[x])
    }
    return <GetList1 address={addr} goallist={tar} gotlist={got}/>
}

class GlobalTable extends Component{
    constructor(){
        super()
        // console.log("GLobal")
        // console.log(this.props)
    }
    render(){
        return(
            <Form>
                <Form.Field>
                    <h3>Funding Board</h3>
                    <Card.Meta>
                        <p style={{ wordBreak: 'break-word' }}>Total: {this.props.totalcount}</p>
                        <GetList2 
                            strlist={this.props.strlist} 
                            address={this.props.fundlist} 
                            goallist={this.props.goallist} 
                            gotlist={this.props.gotlist}
                            timelist={this.props.timelist}
                        />
                    </Card.Meta>
                    <Card.Meta>
                        <h3>Proposal Board</h3>
                        <GetListV
                            address={this.props.fundlist}
                            votestate={this.props.votestate}
                            voteneed={this.props.voteneed}
                            voteproposal={this.props.voteproposal}
                        />
                    </Card.Meta>
                </Form.Field>
            </Form>
        )
    }
}
class PersonalTable extends Component{
    constructor(){
        super()
    }
    render(){
        console.log("PPPPPPP")
        console.log(this.props)
        return(
    <Form>
        <h1 className="ui centered">Account</h1>
        <p>Address：{this.props.myaddress}</p>
        <Form.Field>
            <label>Started</label>
            <GetListByidx index={this.props.StartIndex} address={this.props.fundlist} goallist={this.props.goallist} gotlist={this.props.gotlist}/>
        </Form.Field>
        <Form.Field>
            <label>Invested</label>
            <GetListByidx index={this.props.InvestIndex} address={this.props.fundlist} goallist={this.props.goallist} gotlist={this.props.gotlist}/>
        </Form.Field>
        <Form.Field>
            <label>Start a new funding</label>
            <input ref='rp_name' placeholder='name'>
            </input>
            <input ref='rp_reason' placeholder='reason'>
            </input>
            <input ref='rp_value' placeholder='ether'>
            </input>
            <input ref='rp_ddl' placeholder='time/s'>
            </input>
            <Button animated='fade' onClick={()=>{this.props.newFunding(this.refs.rp_name.value,this.refs.rp_reason.value,this.refs.rp_ddl.value, this.refs.rp_value.value)}}>
                <Button.Content>Start</Button.Content>
            </Button>
        </Form.Field>
        <Form.Field>
            <label>Start a new proposal</label>
            <input ref='rv_addr' placeholder='project address'>
            </input>
            <input ref='rv_reason' placeholder='reason'>
            </input>
            <input ref='rv_value' placeholder='ether'>
            </input>
            <Button animated='fade' onClick={()=>{this.props.newProposal(this.refs.rv_addr.value, this.refs.rv_reason.value, this.refs.rv_value.value)}}>
                <Button.Content>Start a new proposal</Button.Content>
            </Button>
        </Form.Field>
        <Form.Field>
            <label>Donate</label>
            <input ref='pay_addr' placeholder='project address'>
            </input>
            <input ref='pay_value' placeholder='ether'>
            </input>
            <Button animated='fade' onClick={()=>{this.props.donate(this.refs.pay_addr.value, this.refs.pay_value.value)}}>
                <Button.Content>donate</Button.Content>
            </Button>
        </Form.Field>
        <Form.Field>
            <label>Vote</label>
            <input ref='vote_addr' placeholder='project address'>
            </input>
            <Button animated='fade' onClick={()=>{this.props.vote(this.refs.vote_addr.value,1)}}>
                <Button.Content>Approve</Button.Content>
            </Button>
            <Button animated='fade' onClick={()=>{this.props.vote(this.refs.vote_addr.value,2)}}>
                <Button.Content>Reject</Button.Content>
            </Button>
        </Form.Field>
    </Form>
)}
}

export {GlobalTable, PersonalTable}