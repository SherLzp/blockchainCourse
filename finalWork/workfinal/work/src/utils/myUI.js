import React, { Component } from 'react'
import { Button, Card, Table, Form, Icon, Image, Statistic } from 'semantic-ui-react'


const GetListV = (props)=>{
    var addr = props.address
    var vstate = props.votestate
    var vtar = props.votetar
    var vstr = props.votestr
    var idx = []
    addr.map((item,index)=>{
        if(vstate[index]>0){
            idx.push(index)
        }
    })
    const myItem = idx.map((item,index)=>{
        let tmp =(vstate[item]==1)?'进行中':(vstate[item]==2)?'失败':(vstate[item]==3)?'成功':'未开始'
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
                    <Table.HeaderCell>地址</Table.HeaderCell>
                    <Table.HeaderCell>目标</Table.HeaderCell>
                    <Table.HeaderCell>描述</Table.HeaderCell>
                    <Table.HeaderCell>状态</Table.HeaderCell>
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
                    <Table.HeaderCell>地址</Table.HeaderCell>
                    <Table.HeaderCell>目标</Table.HeaderCell>
                    <Table.HeaderCell>已有</Table.HeaderCell>
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
                    <Table.HeaderCell>描述</Table.HeaderCell>
                    <Table.HeaderCell>地址</Table.HeaderCell>
                    <Table.HeaderCell>目标金额</Table.HeaderCell>
                    <Table.HeaderCell>已有</Table.HeaderCell>
                    <Table.HeaderCell>截止时间</Table.HeaderCell>
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
                    Global Project List
                    <Card.Meta>
                        <p style={{ wordBreak: 'break-word' }}>总项目数: {this.props.totalcount}</p>
                        <GetList2 
                            strlist={this.props.strlist} 
                            address={this.props.prolist} 
                            goallist={this.props.goallist} 
                            gotlist={this.props.gotlist}
                            timelist={this.props.timelist}
                        />
                    </Card.Meta>
                    <Card.Meta>
                        <h3>正在进行资金使用投票的项目：</h3>
                        <GetListV
                            address={this.props.prolist}
                            votestate={this.props.votestate}
                            votetar={this.props.votetar}
                            votestr={this.props.votestr}
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
        console.log(this.props)
        return(
    <Form>
        <h1 className="ui centered">账户情况</h1>
        <p>当前账户地址：{this.props.myaddress}</p>
        <Form.Field>
            <label>已发起的众筹</label>
            <GetListByidx index={this.props.hostindex} address={this.props.prolist} goallist={this.props.goallist} gotlist={this.props.gotlist}/>
        </Form.Field>
        <Form.Field>
            <label>已参加的众筹</label>
            <GetListByidx index={this.props.paidindex} address={this.props.prolist} goallist={this.props.goallist} gotlist={this.props.gotlist}/>
        </Form.Field>
        <Form.Field>
            <label>发起新众筹</label>
            <input ref='rp_reason' placeholder='reason'>
            </input>
            <input ref='rp_value' placeholder='ether'>
            </input>
            <Button animated='fade' onClick={()=>{this.props.raisepro(this.refs.rp_reason.value, this.refs.rp_value.value)}}>
                <Button.Content>发起新众筹</Button.Content>
            </Button>
        </Form.Field>
        <Form.Field>
            <label>发起新投票</label>
            <input ref='rv_addr' placeholder='project address'>
            </input>
            <input ref='rv_reason' placeholder='reason'>
            </input>
            <input ref='rv_value' placeholder='ether'>
            </input>
            <Button animated='fade' onClick={()=>{this.props.raisevote(this.refs.rv_addr.value, this.refs.rv_reason.value, this.refs.rv_value.value)}}>
                <Button.Content>发起投票</Button.Content>
            </Button>
        </Form.Field>
        <Form.Field>
            <label>参加众筹</label>
            <input ref='pay_addr' placeholder='project address'>
            </input>
            <input ref='pay_value' placeholder='ether'>
            </input>
            <Button animated='fade' onClick={()=>{this.props.payfor(this.refs.pay_addr.value, this.refs.pay_value.value)}}>
                <Button.Content>支付</Button.Content>
            </Button>
        </Form.Field>
        <Form.Field>
            <label>参加投票</label>
            <input ref='vote_addr' placeholder='project address'>
            </input>
            <Button animated='fade' onClick={()=>{this.props.votefor(this.refs.vote_addr.value,1)}}>
                <Button.Content>支持</Button.Content>
            </Button>
            <Button animated='fade' onClick={()=>{this.props.votefor(this.refs.vote_addr.value,2)}}>
                <Button.Content>反对</Button.Content>
            </Button>
        </Form.Field>
    </Form>
)}
}

export {GlobalTable, PersonalTable}