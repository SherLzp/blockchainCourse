import React from 'react'
import { Layout, Menu, Card, Col, Row,Input,InputNumber,List, Space,Progress,Button,Radio,Modal} from 'antd';
import './page.css'
const { TextArea } = Input;
const { Header, Content } = Layout;
const options=[
  {label:'Agree',value:true},
  {label:'Disagree',value:false}
]
const InfoPage = (props)=>(
    <Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} onClick={props.navclick} >
        <Menu.Item key="1">Existing Projects</Menu.Item>
        
        <Menu.Item key="2">New Project</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      
      <div className="site-layout-content" >
      <Modal
          visible={props.invest_modal_visble}
          title="Invest"
          onOk={props.invest_ok}
          onCancel={props.invest_cancel}
          footer={[
            <Button key="back" onClick={props.invest_cancel}>
              Return
            </Button>,
            <Button key="submit" type="primary" loading={props.invest_loading} onClick={props.invest_ok}>
              Submit
            </Button>,
          ]}
        >
          <Space size={10} direction="vertical" style={{alignSelf:'center'}}>
          <div>Invest Money<InputNumber min={0} defaultValue={0} onChange={props.invest_input}/></div>

          </Space>
        </Modal>

        <Modal
          visible={props.new_proposal_modal_visble}
          title="Propose New Usage of Fund"
          onOk={props.new_prop_ok}
          onCancel={props.new_prop_cancel}
          footer={[
            <Button key="back" onClick={props.new_prop_cancel}>
              Return
            </Button>,
            <Button key="submit" type="primary" loading={props.new_prop_loading} onClick={props.new_prop_ok}>
              Submit
            </Button>,
          ]}
        >
          <Space size={10} direction="vertical" style={{alignSelf:'center'}}>
          <div>Proposal Name<Input placeholder="Name" onChange={props.new_prop_name} /></div>
          <div>Proposed Money<InputNumber min={0} defaultValue={0} onChange={props.new_prop_amount}/></div>
          <div>Proposal Description<TextArea placeholder="Description" rows={5} onChange={props.new_prop_description} /></div>
          </Space>
        </Modal>

        <Modal
          visible={props.vote_modal_visble}
          title="Vote for Proposal"
          onOk={props.vote}
          onCancel={props.vote_cancel}
          footer={[
            <Button key="back" onClick={props.vote_cancel}>
              Return
            </Button>,
            <Button key="submit" type="primary" loading={props.vote_loading} onClick={props.vote}>
              Submit
            </Button>,
          ]}
        >
          <Space size={10} direction="vertical" style={{alignSelf:'center'}}>
            <Radio.Group options={options} onChange={props.vote_change} value={props.vote_opinion} optionType="button" buttonStyle="solid"/>
          </Space>
        </Modal>
      <Space direction='vertical' size={20}>
      <div className="site-card-wrapper">
        <Row >
            <Col span={10}>
                <Card title="Project Name" bordered>
                {props.fund_data.name}
                </Card>
            </Col>
            <Col span={10}>
                <Card title="Project State" bordered>
                {props.fund_data.status}
                </Card>
            </Col>
            </Row>
        <Row >
            <Col span={10}>
                <Card title="Project Owner" bordered>
               {props.fund_data.raiser}
                </Card>
            </Col>

            <Col span={10}>
                <Card title="Target" bordered>
                {props.fund_data.target_amount}ETH
                </Card>
            </Col>
            </Row>
        <Row >
            <Col span={10}>
                <Card title="Collected" bordered>
                {props.fund_data.total_amount}ETH
                </Card>
            </Col>
            <Col span={10}>
                <Card title="Used" bordered>
               {props.fund_data.total_amount-props.fund_data.current_amount}ETH
                </Card>
            </Col>
        </Row>
        <Row >
          <Col span={24}>
          <Card  title='Description'  bordered  > 
          {props.fund_data.description}
          </Card>
          </Col>
        </Row>
        <Row >
          <Col span={12} style={{alignSelf:"center",display:props.fund_data.invest_visble}}>
          <Card  title='Invest Project'  bordered  > 
          Money Invested:{props.fund_data.invest_amount}ETH
          <br/>
          <Button onClick={props.invest_click} disabled={props.fund_data.invest_disable}  >{props.fund_data.invest_button_info}</Button>
          </Card>
          </Col>
          <Col span={12} style={{alignSelf:"center" ,display:props.fund_data.new_proposal_visble}}>
          <Card  title='Withdraw'  bordered  > 
          Money Withdrawable：{props.fund_data.current_amount}ETH
          <br/>
          <Button onClick={props.new_prop_click}>New Propsal</Button>
          </Card>
          </Col>
          
         
        </Row>
  </div>

    <List
      size="large"
      header={<div style={{width:"100%"}}>
          <Space size={300}>
          <div class="div-inline-vote">Proposal</div><div class="div-inline-vote">Proposal Cost</div><div class="div-inline-vote">Proposal Reason</div><div class="div-inline-vote">Agree</div><div style={{display:"inline"}}>操作</div>
          </Space>
      </div>}
      dataSource={props.fund_data.proposals}
      renderItem={item => (<List.Item ><List.Item>{item.name}</List.Item>
      <List.Item>{item.amount}</List.Item>
      <List.Item>{item.description}</List.Item>
      <List.Item> <Progress style={{width:200}} percent={item.percent} success={{percent:item.agree_percent}}  status={item.progress_status} /> </List.Item> 
       <List.Item>  <Button value={item.index} disabled={item.withdrawal_disable} style={{display:props.fund_data.new_proposal_visble}} onClick={props.withdrawal}  type="primary"  > {item.button_info} </Button> 
       <Button value={item.index} disabled={item.vote_disable}  style={{display:props.fund_data.vote_visble}} onClick={props.vote_click}  type="primary"> {item.button_info} </Button>
        </List.Item> 
          </List.Item>)
    }
      
    />
    </Space>
      </div>
    </Content>
  </Layout>
)
export default InfoPage