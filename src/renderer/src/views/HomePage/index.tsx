import React, { useEffect, useState } from 'react'
import { Avatar, Col, Input, Row, Menu } from 'antd'
import { useDraggable } from '@/tools/useDraggable'
import Close from '../../components/Close'
import MessageList from './MessageList'
import ContactList from './ContactList'
import { INIT_AVATAR_URL, INIT_INTRODUCTION } from '@/constants'
import Service from '@/service'

const HomePage: React.FC = () => {
  const dragRef = useDraggable('home')
  const [introduction, setIntroduction] = useState('')
  const [username, setUsername] = useState('')
  const [activeTab, setActiveTab] = useState('1')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    window.electron.ipcRenderer.on('login-home', (_, data) => {
      const { introduction, username, avatar } = data
      console.log(data)
      setIntroduction(introduction)
      setUsername(username)
      setAvatar(avatar || INIT_AVATAR_URL)
      setIntroduction(introduction || INIT_INTRODUCTION)
    })
  }, [])
 
  function refreshData() {
    Service.get('/user/info').then((res) => {
      const { introduction, username, avatar } = res.data.user ?? {}
      setIntroduction(introduction || INIT_INTRODUCTION)
      setUsername(username)
      setAvatar(avatar || INIT_AVATAR_URL)
    })
  }

  const handleAddFriend = () => {
    window.electron.ipcRenderer.invoke('open-window', { windowName: 'friend', data: {} })
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f2f5' }}
    >
      <Close targetWindow="home" />
      <Row
        ref={dragRef}
        style={{
          padding: '20px',
          background: 'linear-gradient(to right, #4a90e2, #50c9c3)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          height: '85px',
          justifyContent: 'space-between'
        }}
      >
        <Col style={{ width: '40px', marginRight: '10px' }}>
          <Avatar size={40} src={avatar} onClick={refreshData} />
        </Col>
        <Col flex="1" style={{ width: 'calc(100% - 50px)' }}>
          <Row>
            <Col
              span={24}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {username}
            </Col>
          </Row>
          <Row>
            <Col
              span={24}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              {introduction}
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Input.Search placeholder="搜索" style={{ alignSelf: 'center' }} />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ width: '100%' }}
            onClick={({ key }) => setActiveTab(key)}
          >
            <Menu.Item key="1" style={{ width: '50%', textAlign: 'center' }}>
              消息
            </Menu.Item>
            <Menu.Item key="2" style={{ width: '50%', textAlign: 'center' }}>
              联系人
            </Menu.Item>
          </Menu>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {activeTab === '1' && <MessageList />}
          {activeTab === '2' && <ContactList />}
        </Col>
      </Row>

      <Menu
        mode="horizontal"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-around',
          borderTop: '1px solid #e8e8e8'
        }}
        selectedKeys={['setting']}
      >
        <Menu.Item key="setting">设置</Menu.Item>
        <Menu.Item key="addFriend" onClick={handleAddFriend}>添加好友</Menu.Item>
        <Menu.Item key="music">我的音乐</Menu.Item>
      </Menu>
    </div>
  )
}

export default HomePage
