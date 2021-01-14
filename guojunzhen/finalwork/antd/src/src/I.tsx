import { Link, RouteComponentProps } from 'react-router-dom'
import { FC, useState, useEffect } from 'react'
import { Card, Table } from 'antd'
import { get_my, Project, myAccount } from '../api/contract'

const I:FC<RouteComponentProps> = ({ match }) => {
  
  const [account, setAccount] = useState('');
  myAccount().then(res => setAccount(res));

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Project) => (
        <Link to={`/funding/${record.project_id}`}>
          {text}
        </Link>
      )
    },
    {
      title: '开始时间',
      dataIndex: 'start',
      key: 'start',
      render: (text:number, record:Project) => (
        <div>
          {new Date(text * 1000).toLocaleString()}
        </div>
      )
    },
    {
      title: '结束时间',
      dataIndex: 'end',
      key: 'end',
      render: (text:number, record:Project) => (
        <div>
          {new Date(text * 1000).toLocaleString()}
        </div>
      )
    },
    {
      title: '目标金额',
      dataIndex: 'target',
      key: 'target'
    },
    {
      title: '现在金额',
      dataIndex: 'current_amount',
      key: 'current_amount'
    },
    {
      title: '我投入的钱',
      dataIndex: 'i',
      key: 'i'
    },
    {
      title: '我自己？',
      dataIndex: 'm',
      key: 'm',
      render: (text:undefined, record:Project) => (
        record.initiator === account
        ? (
          <div>我自己发起的</div>
        )
        : (
          <div>我投资别人的</div>
        )
      )
    }
  ]

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Project[]>([]);
  useEffect(() => {
    if(loading === true) {
      (async () => {
        setData(await get_my());
        setLoading(false);
      })();      
    }
  }, [loading]);

  return (
    <Card title="我的众筹">
      <Table columns={columns} dataSource={data} loading={loading} />
    </Card>
  )
}

export default I;