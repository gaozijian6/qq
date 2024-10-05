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
import { FRIEND, INIT_AVATAR_URL, INIT_INTRODUCTION } from '@/constants'
import * as Service from '@/service'
import ChatBox from '@/components/ChatBox'
import Detail from '@/components/Detail'
const { Header, Sider, Content } = Layout
const { Search } = Input

interface FriendRequestItem {
  id: string
  username: string
  avatar: string
  introduction: string
}

const HomePage: React.FC = () => {
  const dragRef = useDraggable('home')
  const [introduction, setIntroduction] = useState('')
  const [username, setUsername] = useState('')
  const [activeTab, setActiveTab] = useState('1')
  const [avatar, setAvatar] = useState('')
  const [isEditingIntro, setIsEditingIntro] = useState(false)
  const [id, setId] = useState('')
  const [friendRequestList, setFriendRequestList] = useState<FriendRequestItem[]>([])
  const [friendList, setFriendList] = useState<FriendRequestItem[]>([])
  const [selectedFriend, setSelectedFriend] = useState<FriendRequestItem | null>(null)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  // 1 消息 2 好友
  const [type1, setType1] = useState(1)
  // 1 空白 2 好友详情 3 聊天
  const [type2, setType2] = useState(1)
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    window.electron.ipcRenderer.on('login-home', (_, data) => {
      const { introduction, username, avatar, id, friends } = data
      setIntroduction(introduction || INIT_INTRODUCTION)
      setUsername(username)
      setAvatar(avatar || INIT_AVATAR_URL)
      setId(id)
      setFriendList(friends)
    })

    window.electron.ipcRenderer.on('newFriendRequest', (_, data) => {
      setFriendRequestList((prevList) => [...prevList, data])
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
    window.electron.ipcRenderer.invoke('open-window', { windowName: FRIEND, data: { id } })
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
    window.electron.ipcRenderer.invoke('logout')
    localStorage.removeItem('token')
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

  const handleItemClick = (item: FriendRequestItem) => {
    setSelectedFriend(item)
    if (clickTimer) {
      clearTimeout(clickTimer)
      setClickTimer(null)
      setType2(3)
    } else {
      const timer = setTimeout(() => {
        setType2(2)
        setClickTimer(null)
      }, 200)
      setClickTimer(timer)
    }
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
            onClick={() => setType1(1)}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          />
          <Menu.Item
            key="contacts"
            icon={<TeamOutlined />}
            onClick={() => setType1(2)}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          />
          <Dropdown menu={settingsMenu} placement="topRight" trigger={['click']}>
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
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            {type1 === 1 && friendRequestList?.map((item) => (
              <div
                key={item.id}
                style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
              >
                <Avatar src={item.avatar} />
                <span style={{ fontWeight: 'bold', color: '#1890ff', marginLeft: '10px' }}>
                  {item.username}
                </span>
                <span style={{ marginLeft: '5px', color: '#666' }}>请求添加你为好友</span>
              </div>
            ))}
            {type1 === 2 && friendList?.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
              >
                <Avatar src={item.avatar} />
                <span style={{ fontWeight: 'bold', color: '#1890ff', marginLeft: '10px' }}>
                  {item.username}
                </span>
              </div>
            ))}
          </Content>
        </Sider>

        {windowWidth >= 580 && (
          <Content style={{ overflow: 'initial', minWidth: 330 }}>
            {type2 === 1 && <div style={{ height: '100%' }} />}
            {type2 === 2 && <Detail />}
            {type2 === 3 && selectedFriend?.id && <ChatBox {...selectedFriend} />}
          </Content>
        )}
      </Layout>
    </Layout>
  )
}

export default HomePage
