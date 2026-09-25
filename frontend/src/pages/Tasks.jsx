import dayjs from 'dayjs'
import { useState } from 'react'
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Modal, Progress, Row, Select, Steps, Tag, Typography } from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

const initialTasks = [
  {
    id: 1,
    title: 'Finalize recruitment brief',
    assignee: 'Maya Chen',
    priority: 'High',
    status: 'In progress',
    progress: 50,
    due: '2026-09-25',
  },
  {
    id: 2,
    title: 'Review onboarding checklist',
    assignee: 'John Williams',
    priority: 'Medium',
    status: 'To do',
    progress: 0,
    due: '2026-09-26',
  },
  {
    id: 3,
    title: 'Prepare engagement survey',
    assignee: 'Ari Patel',
    priority: 'Low',
    status: 'Completed',
    progress: 100,
    due: '2026-09-25',
  },
  {
    id: 4,
    title: 'Update headcount forecast',
    assignee: 'Noah Garcia',
    priority: 'High',
    status: 'In progress',
    progress: 35,
    due: '2026-09-30',
  },
]

const columns = [
  { key: 'todo', title: 'To do', status: 'To do' },
  { key: 'progress', title: 'In progress', status: 'In progress' },
  { key: 'completed', title: 'Completed', status: 'Completed' },
]

const priorityColor = {
  High: 'red',
  Medium: 'gold',
  Low: 'green',
}

const statusColor = {
  'To do': 'default',
  'In progress': 'processing',
  Completed: 'success',
}

export default function Tasks() {
  const role = localStorage.getItem('lli-user-role') || 'viewer'
  const canManage = ['admin', 'manager'].includes(role)
  const [tasks, setTasks] = useState(() => {
    try {
      const storedTasks = localStorage.getItem('lli-tasks')
      return storedTasks ? JSON.parse(storedTasks) : initialTasks
    } catch {
      return initialTasks
    }
  })
  const [open, setOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [form] = Form.useForm()

  const openCreateModal = () => {
    setEditingTask(null)
    form.resetFields()
    form.setFieldsValue({ priority: 'Medium', status: 'To do', progress: 0, due: dayjs().add(1, 'day') })
    setOpen(true)
  }

  const openEditModal = (task) => {
    setEditingTask(task)
    form.setFieldsValue({
      title: task.title,
      assignee: task.assignee,
      priority: task.priority,
      status: task.status,
      progress: task.progress,
      due: task.due ? dayjs(task.due) : null,
    })
    setOpen(true)
  }

  const handleSubmit = (values) => {
    const taskValues = {
      title: values.title,
      assignee: values.assignee,
      priority: values.priority,
      status: values.status,
      progress: values.status === 'To do' ? 0 : values.status === 'Completed' ? 100 : Number(values.progress || 0),
      due: values.due ? dayjs(values.due).format('YYYY-MM-DD') : '',
    }

    const nextTasks = editingTask
      ? tasks.map((task) => task.id === editingTask.id ? { ...task, ...taskValues } : task)
      : [{ id: Date.now(), ...taskValues }, ...tasks]

    setTasks(nextTasks)
    localStorage.setItem('lli-tasks', JSON.stringify(nextTasks))
    form.resetFields()
    setOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="page">
      <div className="dashboard-heading" style={{ marginBottom: 24 }}>
        <div>
          <Text className="eyebrow">TASKS / ACTIVE BOARD</Text>
          <Title level={2} style={{ marginTop: 8, marginBottom: 0 }}>Task board</Title>
        </div>
        {canManage ? (
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Assign task
          </Button>
        ) : (
          <Tag color="default">Read-only access</Tag>
        )}
      </div>

      <Card className="task-status-summary" style={{ marginBottom: 18 }}>
        <Steps
          size="small"
          items={columns.map((column) => ({
            title: <span style={{ color: '#ffffff' }}>{column.title}</span>,
            description: <span style={{ color: '#ffffff' }}>{tasks.filter((task) => task.status === column.status).length} tasks</span>,
          }))}
        />
        <div className="task-progress-summary">
          <Text type="secondary">Completed work</Text>
          <Progress
            percent={tasks.length ? Math.round((tasks.filter((task) => task.status === 'Completed').length / tasks.length) * 100) : 0}
            format={(percent) => <span style={{ color: '#ffffff' }}>{percent}%</span>}
            strokeColor="#1677ff"
            trailColor="#3a3a3a"
          />
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.status)

          return (
            <Col xs={24} lg={6} key={column.key}>
              <Card
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{column.title}</span>
                    <Tag>{columnTasks.length}</Tag>
                  </div>
                }
                style={{ borderRadius: 12, border: '1px solid #e6ece8', minHeight: 380 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {columnTasks.length === 0 ? (
                    <Text type="secondary">No tasks</Text>
                  ) : (
                    columnTasks.map((task) => (
                      <Card key={task.id} size="small" style={{ borderRadius: 10, border: '1px solid #e7ece9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                          <Text strong>{task.title}</Text>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Tag color={priorityColor[task.priority] || 'default'}>{task.priority}</Tag>
                            {canManage && (
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                aria-label={`Edit ${task.title}`}
                                onClick={() => openEditModal(task)}
                              />
                            )}
                          </div>
                        </div>

                        <div style={{ color: '#5d6d69', fontSize: 12, marginBottom: 8 }}>
                          {task.assignee}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Tag color={statusColor[task.status] || 'default'}>{task.status}</Tag>
                          <Text type="secondary" style={{ fontSize: 12 }}>{task.due}</Text>
                        </div>
                        <Progress percent={task.progress} size="small" showInfo strokeColor="#1677ff" trailColor="#3a3a3a" />
                      </Card>
                    ))
                  )}
                </div>
              </Card>
            </Col>
          )
        })}
      </Row>

      <Modal
        className="task-modal"
        title={editingTask ? 'Edit task' : 'Assign task'}
        open={open}
        onCancel={() => { setOpen(false); form.resetFields(); setEditingTask(null) }}
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
          <Form.Item name="title" label="Task title" rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="assignee" label="Assign to" rules={[{ required: true }]}> 
            <Select>
              <Option value="Maya Chen">Maya Chen</Option>
              <Option value="John Williams">John Williams</Option>
              <Option value="Ari Patel">Ari Patel</Option>
              <Option value="Noah Garcia">Noah Garcia</Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="Priority" initialValue="Medium" rules={[{ required: true, message: 'Please select a priority' }]}> 
            <Select>
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="To do" rules={[{ required: true, message: 'Please select a status' }]}> 
            <Select>
              <Option value="To do">To do</Option>
              <Option value="In progress">In progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(previousValues, currentValues) => previousValues.status !== currentValues.status}>
            {() => (
              <Form.Item name="progress" label="Progress (%)" rules={[{ required: true, message: 'Please enter progress' }]}> 
                <InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="0-100" disabled={form.getFieldValue('status') !== 'In progress'} />
              </Form.Item>
            )}
          </Form.Item>
          <Form.Item name="due" label="Due date" rules={[{ required: true, message: 'Please select a due date' }]}> 
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              placeholder="Select date"
              popupClassName="task-date-picker"
            />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => { setOpen(false); form.resetFields() }}>Cancel</Button>
            <Button type="primary" htmlType="submit">Save</Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
