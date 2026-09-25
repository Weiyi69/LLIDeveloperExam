import { useState } from 'react'
import { Button, Card, Col, Row, Select, Statistic, Table, Tag, Typography, message } from 'antd'
import { DownloadOutlined, FileTextOutlined, PrinterOutlined } from '@ant-design/icons'
import api from '../services/api'

const { Title, Text } = Typography

const projectRecords = [
  { id: 'project-1', name: 'LLI Q4 People Ops Revamp', owner: 'Maya Chen', status: 'In progress', progress: 72, team: 6, due: '2026-10-18' },
  { id: 'project-2', name: 'Department Capacity Planning', owner: 'John Williams', status: 'To do', progress: 0, team: 4, due: '2026-10-09' },
  { id: 'project-3', name: 'Hiring Pipeline Automation', owner: 'Ari Patel', status: 'In progress', progress: 41, team: 5, due: '2026-10-25' },
  { id: 'project-4', name: 'Engagement Survey Rollout', owner: 'Noah Garcia', status: 'To do', progress: 0, team: 3, due: '2026-10-30' },
]

const taskRecords = [
  { id: 'task-1', title: 'Finalize recruitment brief', assignee: 'Maya Chen', status: 'In progress', progress: 50, due: '2026-09-25' },
  { id: 'task-2', title: 'Review onboarding checklist', assignee: 'John Williams', status: 'To do', progress: 0, due: '2026-09-26' },
  { id: 'task-3', title: 'Prepare engagement survey', assignee: 'Ari Patel', status: 'Completed', progress: 100, due: '2026-09-25' },
  { id: 'task-4', title: 'Update headcount forecast', assignee: 'Noah Garcia', status: 'In progress', progress: 35, due: '2026-09-30' },
]

const getProjectRecords = () => {
  try {
    const storedProjects = localStorage.getItem('lli-projects')
    return storedProjects ? JSON.parse(storedProjects) : projectRecords
  } catch {
    return projectRecords
  }
}

const getTaskRecords = () => {
  try {
    const storedTasks = localStorage.getItem('lli-tasks')
    return storedTasks ? JSON.parse(storedTasks) : taskRecords
  } catch {
    return taskRecords
  }
}

export default function Reports() {
  const [reportType, setReportType] = useState('employees')
  const [status, setStatus] = useState('')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      if (reportType === 'employees') {
        const { data } = await api.get('/reports/employees', { params: { status } })
        setReport({ ...data.data, type: 'employees' })
      } else {
        const records = (reportType === 'projects' ? getProjectRecords() : getTaskRecords())
          .filter((record) => !status || record.status === status)
        const completed = records.filter((record) => record.status === 'Completed').length
        setReport({
          type: reportType,
          records,
          summary: {
            total: records.length,
            active: records.filter((record) => record.status === 'In progress').length,
            inactive: completed,
          },
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const exportCsv = () => {
    if (!report) return

    const csvDate = (value) => value ? `="${value}"` : ''

    const headers = report.type === 'employees'
      ? ['Name', 'Email', 'Department', 'Position', 'Status']
      : report.type === 'projects'
        ? ['Project', 'Owner', 'Status', 'Progress', 'Team', 'Due date']
        : ['Task', 'Assignee', 'Status', 'Progress', 'Due date']
    const csv = [
      headers,
      ...report.records.map((record) => report.type === 'employees'
        ? [`${record.first_name} ${record.last_name}`, record.email, record.department, record.position, record.status]
        : report.type === 'projects'
          ? [record.name, record.owner, record.status, `${record.progress}%`, `${record.team} members`, csvDate(record.due)]
          : [record.title, record.assignee, record.status, `${record.progress}%`, csvDate(record.due)]),
    ]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n')

    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    link.download = `${report.type}-report.csv`
    link.click()
    URL.revokeObjectURL(link.href)
    message.success('CSV exported')
  }

  const columns = reportType === 'employees'
    ? [
        { title: 'Name', render: (_, record) => `${record.first_name} ${record.last_name}` },
        { title: 'Department', dataIndex: 'department' },
        { title: 'Position', dataIndex: 'position' },
        { title: 'Status', dataIndex: 'status', render: (value) => <Tag color={value === 'Active' ? 'green' : 'gold'}>{value}</Tag> },
      ]
    : reportType === 'projects'
      ? [
          { title: 'Project', dataIndex: 'name' },
          { title: 'Owner', dataIndex: 'owner' },
          { title: 'Status', dataIndex: 'status', render: (value) => <Tag color={value === 'In progress' ? 'processing' : value === 'Completed' ? 'success' : 'default'}>{value}</Tag> },
          { title: 'Progress', render: (_, record) => `${record.progress}%` },
          { title: 'Team', render: (_, record) => `${record.team} members` },
          { title: 'Due date', dataIndex: 'due' },
        ]
      : [
          { title: 'Task', dataIndex: 'title' },
          { title: 'Assignee', dataIndex: 'assignee' },
          { title: 'Status', dataIndex: 'status', render: (value) => <Tag color={value === 'In progress' ? 'processing' : value === 'Completed' ? 'success' : 'default'}>{value}</Tag> },
          { title: 'Progress', render: (_, record) => `${record.progress}%` },
          { title: 'Due date', dataIndex: 'due' },
        ]

  const scopeOptions = reportType === 'employees'
    ? [{ value: '', label: 'All employees' }, { value: 'Active', label: 'Active only' }, { value: 'Inactive', label: 'Inactive only' }]
    : [{ value: '', label: 'All statuses' }, { value: 'To do', label: 'To do only' }, { value: 'In progress', label: 'In progress only' }, { value: 'Completed', label: 'Completed only' }]

  const reportLabel = reportType === 'employees' ? 'Employees' : reportType === 'projects' ? 'Projects' : 'Tasks'
  const summaryLabels = reportType === 'employees'
    ? ['Total records', 'Active records', 'Inactive records']
    : ['Total items', 'In progress', 'Completed']

  return (
    <div className="page">
      <div className="page-heading compact">
        <div>
          <Text className="eyebrow">INSIGHTS / REPORTING</Text>
          <Title>{reportLabel} report</Title>
          <Text type="secondary">Generate, review, and export a clear {reportLabel.toLowerCase()} snapshot.</Text>
        </div>
        <div className="report-actions">
          <Select
            className="report-type-select"
            value={reportType}
            onChange={(value) => { setReportType(value); setStatus(''); setReport(null) }}
            aria-label="Report type"
            options={[{ value: 'employees', label: 'Employees' }, { value: 'projects', label: 'Projects' }, { value: 'tasks', label: 'Tasks' }]}
          />
          <Select
            className="report-scope-select"
            value={status}
            onChange={setStatus}
            aria-label="Report scope"
            options={scopeOptions}
          />
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>Print</Button>
          <Button icon={<DownloadOutlined />} onClick={exportCsv} disabled={!report}>Export CSV</Button>
          <Button type="primary" icon={<FileTextOutlined />} loading={loading} onClick={generate}>Generate report</Button>
        </div>
      </div>

      {report ? (
        <>
          <Row gutter={[16, 16]} className="stat-grid">
            <Col xs={24} sm={8}><Card className="stat-card"><Statistic title={summaryLabels[0]} value={report.summary.total} /></Card></Col>
            <Col xs={24} sm={8}><Card className="stat-card"><Statistic title={summaryLabels[1]} value={report.summary.active} /></Card></Col>
            <Col xs={24} sm={8}><Card className="stat-card"><Statistic title={summaryLabels[2]} value={report.summary.inactive} /></Card></Col>
          </Row>
          <Card className="table-card report-table" title="Report results">
            <Table rowKey="id" columns={columns} dataSource={report.records} pagination={{ pageSize: 10 }} />
          </Card>
        </>
      ) : (
        <Card className="empty-report">
          <FileTextOutlined />
          <Title level={3}>Your report is ready when you are</Title>
          <Text type="secondary">Choose a report type and scope, then generate the latest snapshot.</Text>
        </Card>
      )}
    </div>
  )
}
