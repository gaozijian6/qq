import React, { useState } from 'react'
import { Avatar, Col, Input, Row, Tabs } from 'antd'
import { useDraggable } from '@/hooks/useDraggable'
import Close from './Close'

const { TabPane } = Tabs

const HomePage: React.FC = () => {
  const dragRef = useDraggable('home')
  const [sign, setSign] = useState('啊啊撒大声地撒')

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
          justifyContent: 'space-between',
        }}
      >
        <Col style={{ width: '40px', marginRight: '10px' }}>
          <Avatar size={40} src="path/to/avatar.jpg" />
        </Col>
        <Col flex="1" style={{ width: 'calc(100% - 50px)' }}>
          <Row>
            <Col span={24} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '16px', fontWeight: 'bold' }}>
              阿萨德as asdsad asd saasdadasdasd
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
              {sign}
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Input.Search placeholder="搜索" style={{ alignSelf: 'center' }} />
        </Col>

        <Col span={24}>
          <Tabs
            defaultActiveKey="1"
            style={{ flex: 1, overflow: 'auto', width: '100%' }}
            centered
            indicator={{ size: 80 }}
          >
            <TabPane
              tab={<div style={{ width: '100%', textAlign: 'center', height: '100%' }}>消息</div>}
              key="1"
            >
              {/* <MessageList /> */}
            </TabPane>
            <TabPane tab={<div style={{ width: '100%', textAlign: 'center' }}>联系人</div>} key="2">
              {/* 联系人列表内容 */}
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  )
}

const MessageList: React.FC = () => {
  const messages = [
    { id: 1, name: '我的iPad', content: '你已登录平板QQ,可传文件到平板', time: '22:28' },
    { id: 2, name: '我的Android手机', content: '你已登录手机QQ,可传文件到手机', time: '22:28' },
    {
      id: 3,
      name: 'ehNwBI0bDxI8OE75qoXsz4',
      content: '王者荣耀:小狗蛋,王者荣耀:小狗蛋合作',
      time: '15:15'
    },
    { id: 4, name: '小YOYO', content: '38.8元得价值888点券皮肤', time: '11:03' },
    { id: 5, name: '好友动态', content: '地图19-40小马哥发表了说说', time: '昨天' },
    { id: 6, name: 'QQ游戏中心', content: '蓝蓝蓝蓝蓝蓝蓝蓝蓝', time: '昨天' },
    { id: 7, name: '一声问候', content: '雨天已到来了,送个祝福吧', time: '8-18' },
    { id: 8, name: '验证消息', content: '你已添加335887845947好友', time: '8-14' }
  ]

  return (
    <div>
      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            borderBottom: '1px solid #e8e8e8'
          }}
        >
          <Avatar size={40}>{msg.name[0]}</Avatar>
          <div style={{ marginLeft: '10px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{msg.name}</span>
              <span style={{ color: '#999', fontSize: '12px' }}>{msg.time}</span>
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>{msg.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HomePage
