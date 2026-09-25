import { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Grid, Input, Layout, Menu } from 'antd'
import {
  AppstoreOutlined,
  BarChartOutlined,
  CheckSquareOutlined,
  FolderOpenOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

const { Sider, Header, Content } = Layout

const getRoleValue = (user) => {
  const storedRole = localStorage.getItem('lli-user-role')
  return user?.role || storedRole || 'viewer'
}

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [, setRoleVersion] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('lli-user') || 'null')
  const screens = Grid.useBreakpoint()
  const profileName =
    user?.username ||
    user?.email ||
    'Account'
  const profileEmail = user?.email || 'Signed-in account'
  const role = getRoleValue(user)

  useEffect(() => {
    const handleRoleChange = () => {
      setRoleVersion((current) => current + 1)
    }

    window.addEventListener('lli-user-role-change', handleRoleChange)
    return () => window.removeEventListener('lli-user-role-change', handleRoleChange)
  }, [])

  const menu = [
    { key: '/', icon: <AppstoreOutlined />, label: <Link to="/">Dashboard</Link> },
    { key: '/projects', icon: <FolderOpenOutlined />, label: <Link to="/projects">Projects</Link> },
    { key: '/tasks', icon: <CheckSquareOutlined />, label: <Link to="/tasks">Tasks</Link> },
    { key: '/employees', icon: <TeamOutlined />, label: <Link to="/employees">Team management</Link> },
    { key: '/reports', icon: <BarChartOutlined />, label: <Link to="/reports">Reports</Link> },
    { key: '/settings', icon: <SettingOutlined />, label: <Link to="/settings">Account settings</Link> },
  ]

  return (
    <Layout className="workspace-shell">
      <Sider
        className="workspace-sider"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        breakpoint="lg"
        collapsedWidth={screens.lg ? 76 : 0}
      >
        <Link to="/settings" className="workspace-profile" title="Open account settings">
          <Avatar icon={<UserOutlined />} />
          <span className="workspace-profile-copy">
            {!collapsed && (
              <>
                <strong>{profileName}</strong>
                <small>{profileEmail}</small>
              </>
            )}
          </span>
        </Link>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menu} />
      </Sider>

      <Layout>
        <Header className="workspace-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <Input
              className="global-search"
              prefix={<SearchOutlined />}
              placeholder="Search people, departments..."
            />
          </div>

          <div className="header-user">
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    label: 'Account settings',
                    onClick: () => navigate('/settings'),
                  },
                  { type: 'divider' },
                  {
                    key: 'logout',
                    label: 'Sign out',
                    icon: <LogoutOutlined />,
                    onClick: () => {
                      localStorage.removeItem('lli-auth-token')
                      localStorage.removeItem('lli-user')
                      window.location.assign(`${import.meta.env.BASE_URL}login`)
                    },
                  },
                ],
              }}
            >
              <Button type="text" className="role-button">
                {role}
              </Button>
            </Dropdown>
          </div>
        </Header>

        <Content className="workspace-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
