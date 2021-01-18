import React, { Component } from 'react'
import { Button, Card, Table, Form, Icon, Image, Statistic } from 'semantic-ui-react'

const GetList1 = (props) => {
    const myItem = props.address.map((item, index) => {
        return (
            <Table.Row>
                <Table.Cell>{props.globalFid[index]}</Table.Cell>
                <Table.Cell>{props.globalFstate[index]}</Table.Cell>
                <Table.Cell>{props.globalFintro[index]}</Table.Cell>
                <Table.Cell>{props.globalFgoal[index]}</Table.Cell>
                <Table.Cell>{props.globalFcurr[index]}</Table.Cell>
                <Table.Cell>{props.globalFddl[index]}</Table.Cell>
            </Table.Row>
        )
    })
    return (
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>State</Table.HeaderCell>
                    <Table.HeaderCell>Introduction</Table.HeaderCell>
                    <Table.HeaderCell>Goal</Table.HeaderCell>
                    <Table.HeaderCell>Current</Table.HeaderCell>
                    <Table.HeaderCell>DDL</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {myItem}
            </Table.Body>
        </Table>
    )
}

const GetList2 = (props) => {
    const myItem = props.address.map((item, index) => {
        return (
            <Table.Row>
                <Table.Cell>{props.localIid[index]}</Table.Cell>
                <Table.Cell>{props.localIstate[index]}</Table.Cell>
                <Table.Cell>{props.localIintro[index]}</Table.Cell>
                <Table.Cell>{props.localIgoal[index]}</Table.Cell>
                <Table.Cell>{props.localIinv[index]}</Table.Cell>
                <Table.Cell>{props.localItime[index]}</Table.Cell>
            </Table.Row>
        )
    })
    return (
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>State</Table.HeaderCell>
                    <Table.HeaderCell>Introduction</Table.HeaderCell>
                    <Table.HeaderCell>Goal</Table.HeaderCell>
                    <Table.HeaderCell>Invested</Table.HeaderCell>
                    <Table.HeaderCell>InvestTime</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {myItem}
            </Table.Body>
        </Table>
    )
}

const GetList3 = (props) => {
    const myItem = props.address.map((item, index) => {
        return (
            <Table.Row>
                <Table.Cell>{props.localSid[index]}</Table.Cell>
                <Table.Cell>{props.localSstate[index]}</Table.Cell>
                <Table.Cell>{props.localSintro[index]}</Table.Cell>
                <Table.Cell>{props.localSgoal[index]}</Table.Cell>
                <Table.Cell>{props.localScurr[index]}</Table.Cell>
                <Table.Cell>{props.localSddl[index]}</Table.Cell>
            </Table.Row>
        )
    })
    return (
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>State</Table.HeaderCell>
                    <Table.HeaderCell>Introduction</Table.HeaderCell>
                    <Table.HeaderCell>Goal</Table.HeaderCell>
                    <Table.HeaderCell>Current</Table.HeaderCell>
                    <Table.HeaderCell>DDL</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {myItem}
            </Table.Body>
        </Table>
    )
}

const GetList4 = (props) => {
    const myItem = props.address.map((item, index) => {
        return (
            <Table.Row>
                <Table.Cell>{props.localRstate[index]}</Table.Cell>
                <Table.Cell>{props.localRid[index]}</Table.Cell>
                <Table.Cell>{props.localRamount[index]}</Table.Cell>
                <Table.Cell>{props.localRcurr[index]}</Table.Cell>
                <Table.Cell>{props.localRddl[index]}</Table.Cell>
                <Table.Cell>
                    <Button animated='fade' onClick={() => { this.props.agreeRequest(props.localRid[index], 0) }}>
                        <Button.Content>Agree</Button.Content>
                    </Button>
                </Table.Cell>
                <Table.Cell>
                    <Button animated='fade' onClick={() => { this.props.disagreeRequest(props.localRid[index], 0) }}>
                        <Button.Content>Disagree</Button.Content>
                    </Button>
                </Table.Cell>
            </Table.Row>
        )
    })
    return (
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>State</Table.HeaderCell>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>RequestAmount</Table.HeaderCell>
                    <Table.HeaderCell>Current</Table.HeaderCell>
                    <Table.HeaderCell>DDL</Table.HeaderCell>
                    <Table.HeaderCell>Agree</Table.HeaderCell>
                    <Table.HeaderCell>Disagree</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {myItem}
            </Table.Body>
        </Table>
    )
}

class GlobalTable extends Component {
    constructor() {
        super()
    }
    render() {
        return (
            <Form>
                <Form.Field>
                    Global Project List
                    <Card.Meta>
                        <p style={{ wordBreak: 'break-word' }}>Total available funds : {this.props.globalAva}</p>
                        <GetList1
                            globalFid={this.props.globalFid}
                            globalFstate={this.props.globalFstate}
                            globalFintro={this.props.globalFintro}
                            globalFgoal={this.props.globalFgoal}
                            globalFcurr={this.props.globalFcurr}
                            globalFddl={this.props.globalFddl}
                        />
                    </Card.Meta>
                </Form.Field>
            </Form>
        )
    }
}
class LocalTable extends Component {
    constructor() {
        super()
    }
    render() {
        console.log(this.props)
        return (
            <Form>
                <h1 className="ui centered">Current Acount</h1>
                <p>Local Address£º{this.props.localAddr}</p>
                <Form.Field>
                    <label>Invested Fund</label>
                    <Card.Meta>
                       <GetList2
                            localIid={this.props.localIid}
                            localIstate={this.props.localIstate}
                            localIintro={this.props.localIintro}
                            localIgoal={this.props.localIgoal}
                            localIinv={this.props.localIinv}
                            localItime={this.props.localItime}
                        />
                    </Card.Meta>
                </Form.Field>
                <Form.Field>
                    <label>Sponsored Fund</label>
                    <Card.Meta>
                        <GetList3
                            localSid={this.props.localSid}
                            localSstate={this.props.localSstate}
                            localSintro={this.props.localSintro}
                            localSgoal={this.props.localSgoal}
                            localScurr={this.props.localScurr}
                            localSddl={this.props.localSddl}
                        />
                    </Card.Meta>
                </Form.Field>
                <Form.Field>
                    <label>Fund Requests</label>
                    <Card.Meta>
                        <GetList4
                            localRstate={this.props.localRstate}
                            localRid={this.props.localRid}
                            localRamount={this.props.localRamount}
                            localRcurr={this.props.localRcurr}
                            localRddl={this.props.localRddl}
                            agreeRequest={this.props.agreeRequest}
                            disagreeRequest={this.props.disagreeRequest}
                        />
                    </Card.Meta>
                </Form.Field>

                <Form.Field>
                    <label>Create Fund</label>
                    <input ref='intro' placeholder='introduction'>
                    </input>
                    <input ref='goal' placeholder='goal'>
                    </input>
                    <input ref='ddl' placeholder='ddl'>
                    </input>
                    <Button animated='fade' onClick={() => { this.props.createFund(this.refs.intro.value, this.refs.goal.value, this.refs.ddl.value) }}>
                        <Button.Content>Create Fund</Button.Content>
                    </Button>
                </Form.Field>
                <Form.Field>
                    <label>Create Request</label>
                    <input ref='intro' placeholder='introduction'>
                    </input>
                    <input ref='amount' placeholder='amount'>
                    </input>
                    <input ref='ddl' placeholder='ddl'>
                    </input>
                    <Button animated='fade' onClick={() => { this.props.createRequest(this.refs.intro.value, this.refs.amount.value, this.refs.ddl.value) }}>
                        <Button.Content>Create Request</Button.Content>
                    </Button>
                </Form.Field>
                <Form.Field>
                    <label>Invest Fund</label>
                    <input ref='fid' placeholder='fund ID'>
                    </input>
                    <input ref='amount' placeholder='amount'>
                    </input>
                    <Button animated='fade' onClick={() => { this.props.investFund(this.refs.fid.value, this.refs.amount.value) }}>
                        <Button.Content>Invest</Button.Content>
                    </Button>
                </Form.Field>
            </Form>
        )
    }
}

export { GlobalTable, LocalTable }