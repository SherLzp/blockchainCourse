import { Link, RouteComponentProps } from 'react-router-dom'
import { FC, useState, useEffect } from 'react'
import { Card, Table } from 'antd'
import { get_all_project, Project } from '../api/contract'

const All : FC<RouteComponentProps> = ({ match }) => {

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
    }
  ]

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Project[]>([]);
  useEffect(() => {
    if(loading === true) {
      (async () => {
        setData(await get_all_project());
        setLoading(false);
      })();      
    }
  }, [loading]);

  return (
    <Card title="所有众筹">
      <Table columns={columns} dataSource={data} loading={loading} />
    </Card>
  )
}

export default All;