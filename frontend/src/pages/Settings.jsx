import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Form, Input, Row, Select, Tag, Typography, message } from 'antd'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

export default function Settings() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('lli-user') || 'null'))
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    form.setFieldsValue({
      firstName: user.firstName || user.username || '',
      lastName: user.lastName || '',
      email: user.email || '',
      username: user.username || '',
      role: localStorage.getItem('lli-user-role') || user.role || 'viewer',
    })
  }, [user, form])

  const handleSubmit = async (values) => {
    if (!user) return

    setSaving(true)
    setError('')

    try {
      const nextRole = values.role || 'viewer'
      const nextUser = { ...user, firstName: values.firstName, lastName: values.lastName, username: values.username || user.username, role: nextRole }
      setUser(nextUser)
      localStorage.setItem('lli-user', JSON.stringify(nextUser))
      localStorage.setItem('lli-user-role', nextRole)
      window.dispatchEvent(new Event('lli-user-role-change'))

      message.success('Account settings updated successfully.')
    } catch (updateError) {
      setError(updateError?.message || 'Unable to save account settings right now.')
      message.error(updateError?.message || 'Unable to save account settings right now.')
      setSaving(false)
      return
    }

    setSaving(false)
  }

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'LL'

  return (
    <div className="page">
      <div className="dashboard-heading" style={{ marginBottom: 16 }}>
        <div>
          <Text className="eyebrow">ACCOUNT / SETTINGS</Text>
          <Title level={2} style={{ marginTop: 8, marginBottom: 0 }}>Account settings</Title>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card style={{ borderRadius: 12, border: '1px solid #e6ece8', minHeight: 260 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 8 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#dceeea', display: 'grid', placeItems: 'center', fontSize: 24, fontWeight: 700, color: '#123d33', marginBottom: 16 }}>
                {initials}
              </div>
              <Title level={4} style={{ margin: 0, color: '#173d34' }}>
                {[user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Lloyd User'}
              </Title>
              <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                {user?.email || 'No email available'}
              </Text>
              <div style={{ marginTop: 16 }}>
                <Tag color="green" style={{ borderRadius: 999, padding: '2px 10px', fontWeight: 600 }}>
                  {localStorage.getItem('lli-user-role') || user?.role || 'viewer'}
                </Tag>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 12, border: '1px solid #e6ece8' }}>
            {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="First name" name="firstName" rules={[{ required: true, message: 'Please enter your first name' }]}>
                    <Input prefix={<UserOutlined />} placeholder="First name" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Last name" name="lastName" rules={[{ required: true, message: 'Please enter your last name' }]}>
                    <Input placeholder="Last name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Username" name="username">
                    <Input placeholder="Username" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Role" name="role">
                    <Select>
                      <Option value="admin">Admin</Option>
                      <Option value="manager">Manager</Option>
                      <Option value="viewer">Viewer</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Email" name="email">
                <Input prefix={<MailOutlined />} disabled />
              </Form.Item>

              <Form.Item label="Password" style={{ marginBottom: 0 }}>
                <Input prefix={<LockOutlined />} type="password" placeholder="••••••••" disabled />
              </Form.Item>

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" htmlType="submit" loading={saving}>
                  Save changes
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
