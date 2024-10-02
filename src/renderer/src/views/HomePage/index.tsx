import React, { useEffect, useMemo, useState } from 'react'
import { Avatar, Layout, Menu, Input, Button, Dropdown } from 'antd'
import {
  UserOutlined,
  MessageOutlined,
  TeamOutlined,
  SettingOutlined,
  PlusCircleOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { useDraggable } from '@/tools/useDraggable'
import { INIT_AVATAR_URL, INIT_INTRODUCTION } from '@/constants'
import * as Service from '@/service'
import webSocketManager from '@/tools/websocket'
import ChatBox from '@/components/ChatBox'
import { HOME, LOGIN } from '@/constants'

const { Header, Sider, Content } = Layout
const { Search } = Input

const HomePage: React.FC = () => {
  const dragRef = useDraggable('home')
  const [introduction, setIntroduction] = useState('')
  const [username, setUsername] = useState('')
  const [activeTab, setActiveTab] = useState('1')
  const [avatar, setAvatar] = useState('')
  const [isEditingIntro, setIsEditingIntro] = useState(false)
  const [id, setId] = useState('')

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    window.electron.ipcRenderer.on('login-home', (_, data) => {
      const { introduction, username, avatar, id } = data
      setIntroduction(introduction || INIT_INTRODUCTION)
      setUsername(username)
      setAvatar(avatar || INIT_AVATAR_URL)
      setId(id)
      webSocketManager.initWebSocket(id?.toString())
    })

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    refreshData()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  function refreshData() {
    Service.getUserInfo().then((res) => {
      const { introduction, username, avatar } = res.data.user ?? {}
      setIntroduction(introduction || INIT_INTRODUCTION)
      setUsername(username)
      setAvatar(avatar || INIT_AVATAR_URL)
    })
  }

  const handleAddFriend = () => {
    window.electron.ipcRenderer.invoke('open-window', { windowName: 'friend', data: { id } })
  }

  const handleIntroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntroduction(e.target.value)
  }

  const handleIntroBlur = () => {
    setIsEditingIntro(false)
    // 这里可以添加保存简介的逻辑
  }

  const calculateSiderWidth = useMemo(() => {
    if (windowWidth >= 770) return 250
    if (windowWidth <= 580) return '100%'
    return Math.max(150, windowWidth - 520) // 动态计算宽度
  }, [windowWidth])

  const handleLogout = () => {
    window.electron.ipcRenderer.invoke('close-window', HOME)
    localStorage.removeItem('token')
    window.electron.ipcRenderer.invoke('open-window', { windowName: LOGIN, data: {} })
  }

  const settingsMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出',
        onClick: handleLogout
      }
    ]
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={60} style={{ backgroundColor: '#1890ff' }}>
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <Avatar
            size={50}
            src={avatar}
            icon={<UserOutlined />}
            onClick={() => {
              console.log(windowWidth)
            }}
          />
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['message']}
          style={{
            backgroundColor: '#1890ff',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0px 10px'
          }}
        >
          <Menu.Item
            key="message"
            icon={<MessageOutlined />}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          />
          <Menu.Item
            key="contacts"
            icon={<TeamOutlined />}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          />
          <Dropdown menu={settingsMenu} placement="right" trigger={['click']}>
            <Menu.Item
              key="setting"
              icon={<SettingOutlined />}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            />
          </Dropdown>
        </Menu>
      </Sider>
      <Layout>
        <Sider width={calculateSiderWidth} style={{ backgroundColor: '#fff' }}>
          <Header
            ref={dragRef}
            style={{ background: '#fff', padding: '0 20px', display: 'flex', alignItems: 'center' }}
          >
            <Search placeholder="搜索" style={{ width: '100%' }} />
            <Button
              onClick={handleAddFriend}
              style={{
                border: 'none',
                boxShadow: 'none',
                backgroundColor: 'transparent',
                padding: 0,
                marginLeft: 'auto'
              }}
              icon={<PlusCircleOutlined />}
            />
          </Header>
          {windowWidth < 770 && (
            <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
              {/* 这里可以添加小屏幕时需要显示的内容 */}
            </Content>
          )}
        </Sider>

        {windowWidth >= 580 && (
          <Content style={{ overflow: 'initial', minWidth: 330 }}>
            <ChatBox />
          </Content>
        )}
      </Layout>
    </Layout>
  )
}

export default HomePage
