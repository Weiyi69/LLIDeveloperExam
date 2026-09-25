import { useCallback, useEffect, useState } from 'react'
import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag, Typography, Popconfirm, message } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import api from '../services/api'

const { Title, Text } = Typography

const departmentOptions = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Finance', label: 'Finance' },
]

const positionOptions = [
  { value: 'Senior Developer', label: 'Senior Developer' },
  { value: 'Operations Lead', label: 'Operations Lead' },
  { value: 'Financial Analyst', label: 'Financial Analyst' },
  { value: 'QA Engineer', label: 'QA Engineer' },
]

export default function Employees() {
  const [form] = Form.useForm()
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [params, setParams] = useState({ page: 1, pageSize: 8, search: '', status: '' })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const isAdmin = localStorage.getItem('lli-user-role') === 'admin'

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/employees', { params })
      setRows(data.data.records)
      setTotal(data.data.total)
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    const timer = setTimeout(load, 0)
    return () => clearTimeout(timer)
  }, [load])

  const submit = async (values) => {
    try {
      if (editing) {
        await api.put(`/employees/${editing.id}`, values)
      } else {
        await api.post('/employees', values)
      }
      message.success(editing ? 'Employee updated' : 'Employee added')
      setOpen(false)
      load()
    } catch (error) {
      message.error(error.response?.data?.error || 'Could not save employee')
    }
  }

  const columns = [
    {
      title: 'Employee',
      fixed: 'left',
      width: 260,
      render: (_, record) => (
        <div className="person-cell">
          <span className="initials">{record.first_name[0]}{record.last_name[0]}</span>
          <div>
            <strong>{record.first_name} {record.last_name}</strong>
            <Text type="secondary">{record.email}</Text>
          </div>
        </div>
      ),
    },
    { title: 'Department', dataIndex: 'department', width: 150 },
    { title: 'Position', dataIndex: 'position', width: 190 },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: (value) => <Tag color={value === 'Active' ? 'green' : 'gold'}>{value}</Tag>,
    },
    ...(isAdmin ? [{
      title: '',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => {
            setEditing(record)
            form.setFieldsValue(record)
            setOpen(true)
          }} />
          <Popconfirm
            title="Delete this employee?"
            onConfirm={async () => {
              await api.delete(`/employees/${record.id}`)
              message.success('Employee deleted')
              load()
            }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    }] : []),
  ]

  return (
    <div className="page">
      <div className="page-heading compact">
        <div>
          <Text className="eyebrow">DIRECTORY / EMPLOYEES</Text>
          <Title>Employee directory</Title>
          <Text type="secondary">Keep your employee information current and easy to find.</Text>
        </div>
        {isAdmin && (
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => {
            setEditing(null)
            form.resetFields()
            form.setFieldValue('status', 'Active')
            setOpen(true)
          }}>
            Add employee
          </Button>
        )}
      </div>

      <Card className="table-card">
        <div className="toolbar">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search name, email or department"
            onChange={(event) => setParams({ ...params, page: 1, search: event.target.value })}
          />
          <Select
            value={params.status || undefined}
            allowClear
            placeholder="All statuses"
            options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]}
            onChange={(status) => setParams({ ...params, page: 1, status: status || '' })}
          />
        </div>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={rows}
          scroll={{ x: 800 }}
          pagination={{
            current: params.page,
            pageSize: params.pageSize,
            total,
            showSizeChanger: true,
            onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
          }}
        />
      </Card>

      <Modal
        className="employee-modal"
        title={editing ? 'Edit employee' : 'Add employee'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText={editing ? 'Save changes' : 'Add employee'}
        centered
        width={620}
        styles={{
          content: { background: '#ffffff', padding: 0 },
          header: { background: '#ffffff', borderBottom: '1px solid #f0f0f0', padding: '20px 24px 16px', marginBottom: 0 },
          body: { background: '#ffffff', padding: '20px 24px 8px' },
          footer: { background: '#ffffff', borderTop: '1px solid #f0f0f0', padding: '16px 24px' },
        }}
      >
        <Form form={form} layout="vertical" onFinish={submit}>
          <Space className="form-row" size="middle">
            <Form.Item name="first_name" label="First name" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="last_name" label="Last name" rules={[{ required: true }]}><Input /></Form.Item>
          </Space>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
          <Space className="form-row" size="middle">
            <Form.Item name="department" label="Department" rules={[{ required: true }]}>
              <Select options={departmentOptions} placeholder="Select department" />
            </Form.Item>
            <Form.Item name="position" label="Position" rules={[{ required: true }]}>
              <Select options={positionOptions} placeholder="Select position" />
            </Form.Item>
          </Space>
          <Space className="form-row" size="middle">
            <Form.Item name="contact_number" label="Contact number"><Input /></Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select options={[{ value: 'Active' }, { value: 'Inactive' }]} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  )
}
