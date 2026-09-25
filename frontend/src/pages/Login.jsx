import { useState } from 'react'
import { Alert, Button, Form, Input, Typography } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const { Title, Text } = Typography

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async ({ identifier, password }) => {
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/login', { identifier, password })
      const { token, user } = response.data.data
      localStorage.setItem('lli-auth-token', token)
      localStorage.setItem('lli-user', JSON.stringify(user))
      localStorage.setItem('lli-user-role', user.role)
      navigate('/', { replace: true })
    } catch (loginError) {
      setError(loginError.response?.data?.error || 'Unable to sign in. Check your username and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-form-wrap">
          <div className="mobile-brand brand">
            <span className="brand-mark">LLI</span>
            <span>Lloyd Laboratories Inc.</span>
          </div>
          <Text className="eyebrow">WELCOME BACK</Text>
          <Title level={2}>Sign in to your workspace</Title>
          <Text type="secondary">Use your EmployeeHub account to continue.</Text>
          {error && <Alert type="error" showIcon message={error} style={{ marginTop: 20 }} />}
          <Form layout="vertical" onFinish={handleSubmit} requiredMark={false} style={{ marginTop: 24 }}>
            <Form.Item label="Username or email" name="identifier" rules={[{ required: true, message: 'Enter your username or email' }]}>
              <Input prefix={<UserOutlined />} placeholder="admin or admin@employeehub.local" size="large" />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Enter your password' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">Sign in</Button>
          </Form>
          <Text type="secondary" style={{ display: 'block', marginTop: 20, fontSize: 12 }}>
            Demo access: admin / Password123!
          </Text>
        </div>
      </section>
    </main>
  )
}
