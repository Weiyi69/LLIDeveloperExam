import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  List,
  Popconfirm,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
  message,
} from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PauseCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import api from '../services/api'

const { Title, Text } = Typography

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    setError('')
    api
      .get('/dashboard')
      .then(({ data: response }) => setData(response.data))
      .catch((requestError) => {
        setError(requestError.response?.data?.error || 'The API server is unavailable. Start the backend and try again.')
      })
  }

  useEffect(() => {
    const timer = setTimeout(load, 0)
    return () => clearTimeout(timer)
  }, [])

  if (error) {
    return (
      <div className="page">
        <Alert
          type="error"
          showIcon
          title="Dashboard data could not be loaded"
          description={error}
          action={<Button onClick={load}>Retry</Button>}
        />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="dashboard-loading">
        <Skeleton active />
        <Skeleton active />
      </div>
    )
  }

  const activePercent = data.stats.total
    ? Math.round((data.stats.active / data.stats.total) * 100)
    : 0
  const canManage = ['admin', 'manager'].includes(localStorage.getItem('lli-user-role') || 'viewer')
  const departmentCounts = data.recent.reduce((counts, person) => {
    counts[person.department] = (counts[person.department] || 0) + 1
    return counts
  }, {})
  const departments = Object.entries(departmentCounts)
    .sort(([, firstCount], [, secondCount]) => secondCount - firstCount)
    .slice(0, 4)

  const deleteEmployee = async (person) => {
    try {
      await api.delete(`/employees/${person.id}`)
      message.success('Employee deleted')
      load()
    } catch (requestError) {
      message.error(requestError.response?.data?.error || 'Could not delete employee')
    }
  }

  return (
    <div className="page dashboard-page">
      <div className="dashboard-heading">
        <div>
          <Text className="eyebrow">PEOPLE OPERATIONS / OVERVIEW</Text>
          <Title>Welcome back.</Title>
          <Text type="secondary">Here is what is happening across your team today.</Text>
        </div>
      </div>

      <Row gutter={[16, 16]} className="workspace-stats">
        <Col xs={24} sm={12} xl={6}>
          <Card className="workspace-stat-card stat-blue">
            <div className="stat-icon"><TeamOutlined /></div>
            <Statistic title="Total people" value={data.stats.total} />
            <Text type="secondary">in your workspace</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="workspace-stat-card stat-mint">
            <div className="stat-icon"><CheckCircleOutlined /></div>
            <Statistic title="Active people" value={data.stats.active} />
            <Text type="secondary">{activePercent}% of total</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="workspace-stat-card stat-lilac">
            <div className="stat-icon"><ClockCircleOutlined /></div>
            <Statistic title="Departments" value={departments.length || 0} />
            <Text type="secondary">represented recently</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="workspace-stat-card stat-amber">
            <div className="stat-icon"><PauseCircleOutlined /></div>
            <Statistic title="Inactive" value={data.stats.inactive} />
            <Text type="secondary">need attention</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="dashboard-panels">
        <Col xs={24} xl={16}>
          <Card
            className="workspace-panel"
            title={(
              <div>
                <Title level={4}>Recent team activity</Title>
                <Text type="secondary">The latest people added to your directory</Text>
              </div>
            )}
            extra={<Button type="link" href="/employees">View all</Button>}
          >
            <List
              dataSource={data.recent}
              locale={{ emptyText: <Empty description="No recent activity" /> }}
              renderItem={(person) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<span className="person-avatar">{person.first_name[0]}{person.last_name[0]}</span>}
                    title={`${person.first_name} ${person.last_name}`}
                    description={`${person.position} · ${person.department}`}
                  />
                  <Space>
                    <Tag color={person.status === 'Active' ? 'green' : 'gold'}>{person.status}</Tag>
                    {canManage && (
                      <>
                        <Button
                          type="text"
                          title={`View ${person.first_name} ${person.last_name}`}
                          icon={<EyeOutlined />}
                          href="/employees"
                        />
                        <Button
                          type="text"
                          title={`Edit ${person.first_name} ${person.last_name}`}
                          icon={<EditOutlined />}
                          href="/employees"
                        />
                        <Popconfirm
                          title="Delete this employee?"
                          onConfirm={() => deleteEmployee(person)}
                        >
                          <Button
                            type="text"
                            danger
                            title={`Delete ${person.first_name} ${person.last_name}`}
                            icon={<DeleteOutlined />}
                          />
                        </Popconfirm>
                      </>
                    )}
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card
            className="workspace-panel"
            title={(
              <div>
                <Title level={4}>Team health</Title>
                <Text type="secondary">Active status across people</Text>
              </div>
            )}
          >
            <div className="health-score">
              <Progress type="circle" percent={activePercent} strokeColor="#4e9b83" trailColor="#e6eee9" />
              <div>
                <strong>{data.stats.active} active</strong>
                <Text type="secondary">of {data.stats.total} people</Text>
              </div>
            </div>
            <div className="panel-divider" />
            <Title level={5}>Top departments</Title>
            {departments.length ? departments.map(([department, count]) => (
              <div className="department-row" key={department}>
                <span>{department}</span>
                <span>{count}</span>
              </div>
            )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No departments yet" />}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
