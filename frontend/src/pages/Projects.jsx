import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Row,
  Select,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FolderOpenOutlined,
  PlusOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

const initialProjectData = [
  {
    key: '1',
    name: 'LLI Q4 People Ops Revamp',
    owner: 'Maya Chen',
    status: 'In progress',
    progress: 72,
    team: 6,
    due: '2026-10-18',
  },
  {
    key: '2',
    name: 'Department Capacity Planning',
    owner: 'John Williams',
    status: 'To do',
    progress: 0,
    team: 4,
    due: '2026-10-09',
  },
  {
    key: '3',
    name: 'Hiring Pipeline Automation',
    owner: 'Ari Patel',
    status: 'In progress',
    progress: 41,
    team: 5,
    due: '2026-10-25',
  },
  {
    key: '4',
    name: 'Engagement Survey Rollout',
    owner: 'Noah Garcia',
    status: 'To do',
    progress: 0,
    team: 3,
    due: '2026-10-30',
  },
]

const statusColors = {
  'In progress': 'processing',
  'To do': 'default',
}

export default function Projects() {
  const storedRole = localStorage.getItem('lli-user-role') || 'viewer'
  const canManage = ['admin', 'manager'].includes(storedRole)
  const [projects, setProjects] = useState(() => {
    try {
      const storedProjects = localStorage.getItem('lli-projects')
      return storedProjects ? JSON.parse(storedProjects) : initialProjectData
    } catch {
      return initialProjectData
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [form] = Form.useForm()

  const openEditModal = useCallback((project) => {
    setEditingProject(project)
    form.setFieldsValue({
      name: project.name,
      owner: project.owner,
      status: project.status,
      due: project.due ? dayjs(project.due) : null,
      team: project.team,
      progress: project.progress,
    })
    setIsModalOpen(true)
  }, [form])

  const columns = useMemo(() => [
    {
      title: 'Project',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <strong>{text}</strong>
          <div style={{ color: '#6c7a75', fontSize: 12 }}>{record.owner}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={statusColors[status] || 'default'}>{status}</Tag>,
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (value) => (
        <div className="project-progress">
          <Progress
            percent={value}
            showInfo={false}
            size="small"
            strokeColor="#1677ff"
            trailColor="#3a3a3a"
          />
          <span>{value}%</span>
        </div>
      ),
    },
    {
      title: 'Team',
      dataIndex: 'team',
      key: 'team',
      render: (value) => `${value} members`,
    },
    {
      title: 'Due date',
      dataIndex: 'due',
      key: 'due',
    },
    ...(canManage ? [{
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
          Edit
        </Button>
      ),
    }] : []),
  ], [canManage, openEditModal])

  const handleSubmit = (values) => {
    const normalizedValues = {
      ...values,
      progress: values.status === 'To do' ? 0 : values.status === 'Completed' ? 100 : Number(values.progress || 0),
      due: values.due ? dayjs(values.due).format('YYYY-MM-DD') : '',
    }

    const nextProjects = editingProject
      ? projects.map((project) => project.key === editingProject.key ? { ...project, ...normalizedValues } : project)
      : [{ key: String(Date.now()), ...normalizedValues }, ...projects]

    setProjects(nextProjects)
    localStorage.setItem('lli-projects', JSON.stringify(nextProjects))

    setIsModalOpen(false)
    setEditingProject(null)
    form.resetFields()
  }

  return (
    <div className="page">
      <div className="dashboard-heading" style={{ marginBottom: 24 }}>
        <div>
          <Text className="eyebrow">PROJECTS / OVERVIEW</Text>
          <Title level={2} style={{ marginTop: 8, marginBottom: 0 }}>Projects</Title>
        </div>
        {canManage ? (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingProject(null)
              form.resetFields()
              setIsModalOpen(true)
            }}
          >
            Add project
          </Button>
        ) : (
          <Tag color="default">Read-only access</Tag>
        )}
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 18 }}>
        <Col xs={24} sm={12} xl={6}>
          <Card className="workspace-stat-card stat-blue">
            <div className="stat-icon"><FolderOpenOutlined /></div>
            <Statistic title="Total projects" value={projects.length} />
            <Text type="secondary">active this quarter</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="workspace-stat-card stat-mint">
            <div className="stat-icon"><CheckCircleOutlined /></div>
            <Statistic title="To do" value={projects.filter((project) => project.status === 'To do').length} />
            <Text type="secondary">ready to begin</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="workspace-stat-card stat-lilac">
            <div className="stat-icon"><CheckCircleOutlined /></div>
            <Statistic title="Completed" value={projects.filter((project) => project.status === 'Completed').length} />
            <Text type="secondary">this quarter</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="workspace-stat-card stat-amber">
            <div className="stat-icon"><ClockCircleOutlined /></div>
            <Statistic title="Due soon" value={projects.filter((project) => project.status !== 'Completed').length} />
            <Text type="secondary">this month</Text>
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 12, border: '1px solid #e6ece8' }}>
        <Table
          columns={columns}
          dataSource={projects}
          pagination={false}
          rowClassName="workspace-table-row"
          style={{ overflow: 'hidden' }}
        />
      </Card>

      <Modal
        className="project-modal"
        title={editingProject ? 'Edit project' : 'Add project'}
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); setEditingProject(null) }}
        footer={null}
        centered
        width={620}
        styles={{
          content: { background: '#ffffff', padding: 0 },
          header: { background: '#ffffff', borderBottom: '1px solid #f0f0f0', padding: '20px 24px 16px', marginBottom: 0 },
          body: { background: '#ffffff', padding: '20px 24px 8px' },
          footer: { background: '#ffffff', borderTop: '1px solid #f0f0f0', padding: '16px 24px' },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={(changedValues) => {
            if (changedValues.status === 'To do') form.setFieldValue('progress', 0)
            if (changedValues.status === 'Completed') form.setFieldValue('progress', 100)
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Project name" rules={[{ required: true, whitespace: true, message: 'Please enter project name' }]}> 
                <Input placeholder="Project name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="owner" label="Owner" rules={[{ required: true, whitespace: true, message: 'Please enter an owner' }]}> 
                <Input placeholder="Owner" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status" label="Status" initialValue="In progress" rules={[{ required: true, message: 'Please select a status' }]}> 
                <Select>
                  <Option value="To do">To do</Option>
                  <Option value="In progress">In progress</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item noStyle shouldUpdate={(previousValues, currentValues) => previousValues.status !== currentValues.status}>
                {() => (
                      <Form.Item name="progress" label="Progress (%)" rules={[{ required: true, message: 'Please enter progress' }]}> 
                    <InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="0-100" disabled={form.getFieldValue('status') !== 'In progress'} />
                  </Form.Item>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="team" label="Team size" rules={[{ required: true, message: 'Please enter team size' }]}> 
                <InputNumber style={{ width: '100%' }} min={1} placeholder="6" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="due" label="Due date" rules={[{ required: true, message: 'Please select a due date' }]}> 
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  placeholder="Select date"
                  popupClassName="project-date-picker"
                />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <Button
              onClick={() => {
                setIsModalOpen(false)
                form.resetFields()
                setEditingProject(null)
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
