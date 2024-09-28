import React, { useState } from 'react'
import { Input, Button, message, Row, Col, Form, Avatar } from 'antd'
import * as Service from '@/service'
import Close from '@/components/Close'
import '@/components/gradientBG.less'
import { useDraggable } from '@/tools/useDraggable'

const AddFriend: React.FC = () => {
  const [friendId, setFriendId] = useState('')
  const dragRef = useDraggable('friend')
  const [form] = Form.useForm()

  const handleAddFriend = () => {
    if (!friendId) {
      message.error('请输入好友ID或用户名')
      return
    }

    Service.post('/add-friend', { friendId })
      .then((response) => {
        message.success(response.data.message)
        setFriendId('')
      })
      .catch((error) => {
        message.error(error.response?.data?.message ?? '添加好友失败，请稍后重试')
      })
  }

  const friendList = [
    {
      id: 1,
      name: '张三',
      avatar: 'https://avatars.githubusercontent.com/u/1032474?v=4'
    },
    {
      id: 2,
      name: '李四',
      avatar: 'https://avatars.githubusercontent.com/u/1032474?v=4'
    },
    {
      id: 3,
      name: '王五',
      avatar: 'https://avatars.githubusercontent.com/u/1032474?v=4'
    },
    {
      id: 4,
      name: '赵六',
      avatar: 'https://avatars.githubusercontent.com/u/1032474?v=4'
    },
  ]

  return (
    <>
      <Close targetWindow="friend" />
      <Row style={{ height: '50px',padding:'10px',textAlign: 'left', fontSize: '20px', fontWeight: 'bold',color:'white',cursor:'default' }} ref={dragRef} className='background'>
        查找好友
      </Row>
      <Row style={{ padding: '20px' }}>
        <Col span={12}>
          <Input
            placeholder="输入好友ID或用户名"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
        </Col>
        <Col span={12}>
          <Button type="primary" onClick={handleAddFriend}>查找</Button>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]} style={{ overflowY: 'auto', height: '100%', maxHeight: 'calc(100vh - 150px)' }}>
            {friendList.map((friend) => (
              <Col key={friend.id} span={6} >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', border: '1px solid #e8e8e8', borderRadius: '4px', height: '100%' }}>
                  <Avatar src={friend.avatar} size={64} style={{ marginBottom: '12px' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold' }}>{friend.name}</div>
                    <Button type="primary" style={{ marginTop: '12px' }}>添加好友</Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default AddFriend