import { Card, Form, Button, Input, message, Table } from 'antd';
import { FC, useState, useEffect } from 'react'
import { RouteComponentProps } from "react-router-dom";
import { get_project, Project, create_investment, allow, collect, withdraw,
  get_request, Request, myAccount, create_request, get_my_amount } from '../api/contract'

const Funding: FC<RouteComponentProps> = ({ match }) => {

  // 保存我自己
  const [account, setAccount] = useState('');
  myAccount().then(res => setAccount(res));

  const [amount, setAmount] = useState(0);

  //@ts-ignore
  const [data, setData] = useState<Project>({});
  const [req, setReq] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      if (loading === true) {
        //@ts-ignore
        setData(await get_project(match.params.id))
        //@ts-ignore
        setReq(await get_request(match.params.id))
        //@ts-ignore
        get_my_amount(match.params.id).then(res => setAmount(res));
        setLoading(false);
      }
    })();
    //@ts-ignore
  }, [loading, match.params.id])

  // 投资
  async function investment(values: { value: number }) {
    try {
      //@ts-ignore
      await create_investment(match.params.id, values.value)
      setLoading(true)
      message.success('成功')
      return true
    } catch (e) {
      console.log(e);
      message.error('失败');
    }
  }

  // 发起请求
  async function onFinish(values:{description: string, amount: string}) {
    try {
      //@ts-ignore
      await create_request(match.params.id, values.description, values.amount);
      setLoading(true);
      message.success('成功')
      return true
    } catch (e) {
      console.log(e);
      message.error('失败');
    }
  }

  const columns = [
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '同意数量',
      dataIndex: 'support_count',
      key: 'support_count'
    },
    {
      title: '同意金额比例',
      dataIndex: 'rate',
      key: 'rate',
      render: (text:boolean, record:Request) => (
        <div>{text}%</div>
      )
    },
    {
      title: '是否通过',
      dataIndex: 'state',
      key: 'state',
      render: (text:boolean, record:Request) => (
        <div>{text ? '成功' : '等待'}</div>
      )
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text:undefined, record:Request) => {
        async function agree() {
          try {
            //@ts-ignore
            await allow(match.params.id, record.request_id);
            setLoading(true);
            message.success('成功')
          } catch(e) {
            console.log(e);
            message.error('失败');
          }
        }

        async function click_collect() {
          try {
            //@ts-ignore
            await collect(match.params.id, record.request_id);
            setLoading(true);
            message.success('成功')
          } catch(e) {
            console.log(e);
            message.error('失败');
          }
        }
        return (
          <div>
            {
              // eslint-disable-next-line
              !record.state && amount != 0
              ? (
                <Button onClick={agree} type="primary">
                  同意
                </Button>
              )
              : null
            }
            {
              // eslint-disable-next-line
              data.initiator === account && record.amount != 0 && record.state
              ? (
                <Button onClick={click_collect} type="primary">取钱</Button>
              )
              : null
            }
          </div>
        )
      }
    }
  ]

  return (
    <Card title="众筹详情">
      <h1 style={{ fontWeight: 600 }}>{data.title}</h1>
      <p>{data.description}</p>
      <ul>
        <li>开始时间:{new Date(data.start * 1000).toLocaleString()}</li>
        <li>结束时间:{new Date(data.end * 1000).toLocaleString()}</li>
        <li>目标金额:{data.target}</li>
        <li>当前金额:{data.current_amount}</li>
      </ul>
      <h1 style={{ fontWeight: 600 }}>
        你投资了{amount}Eth
        {
          // eslint-disable-next-line
          amount && data.total_amount != data.target ? (
            <Button onClick={
              async () => {
                try {
                  //@ts-ignore
                  await withdraw(match.params.id);
                  setLoading(true);
                  message.success('成功')
                } catch(e) {
                  console.log(e);
                  message.error('失败');
                }
              }
            } type="primary">
              退钱
            </Button>
          )
          : null
        }
      </h1>
      {
        parseInt(data.total_amount) < parseInt(data.target)
          ? (
            <Form onFinish={investment} layout="inline">
              <Form.Item label="金额" name="value">
                <Input suffix="Eth" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType='submit'>
                  投资
              </Button>
              </Form.Item>
            </Form>
          )
          : null
      }
      <h1 style={{ fontWeight: 600 }}>所有请求</h1>
      <Table columns={columns} dataSource={req} />
      {
        data.initiator === account
          ? (
            <div>
              <h1 style={{ fontWeight: 600 }}>发起请求</h1>
              <Form onFinish={onFinish}>
                <Form.Item label="请求介绍" name="description">
                  <Input.TextArea />
                </Form.Item>
                <Form.Item label="请求金额" name="amount">
                  <Input suffix="Eth"/>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    发起请求
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )
          : null
      }
    </Card>
  )
}

export default Funding;