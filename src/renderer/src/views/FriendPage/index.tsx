import React, { useState, useEffect } from 'react'
import { Input, Button, message, Row, Col, Avatar, Typography, Card } from 'antd'
import * as Service from '@/service'
import Close from '@/components/Close'
import '@/components/gradientBG.less'
import { useDraggable } from '@/tools/useDraggable'

interface Friend {
  id: string
  avatar: string
  username: string
}

const AddFriend: React.FC = () => {
  const [value, setValue] = useState('')
  const dragRef = useDraggable('friend')
  const [friendList, setFriendList] = useState<Friend[]>([])
  const [id, setId] = useState<number>(0)
  useEffect(() => {
    window.electron.ipcRenderer.on('home-friend', (_, data) => {
      setId(data.id)
    })
  }, [])

  const handleFindFriend = () => {
    if (!value) {
      message.error('请输入好友ID或用户名')
      return
    }

    Service.findFriend({ value: value.trim() }).then((res) => {
      setFriendList(res.data.users)
      if (res.data.users.length === 0) {
        message.error(res.data.message)
      } else {
        message.success(res.data.message)
      }
    })
  }

  const handleAddFriend = (currentId: number): void => {
    if(currentId == id){
      message.error('不能添加自己为好友')
      return
    }
    console.log(id, currentId)
    Service.addFriend({ userIdFrom: id, userIdTo: currentId }).then((res) => {
      console.log(res)
      if (res.data.success) {
        message.success(res.data.message)
      } else {
        message.error(res.data.message)
      }
    })
  }

  return (
    <>
      <Close windowName="friend" />
      <Row
        style={{
          height: '50px',
          padding: '10px',
          textAlign: 'left',
          fontSize: '20px',
          fontWeight: 'bold',
          color: 'white',
          cursor: 'default'
        }}
        ref={dragRef}
        className="background"
      >
        查找好友
      </Row>
      <Row style={{ padding: '20px' }}>
        <Col span={12}>
          <Input
            placeholder="输入好友ID或用户名"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
        </Col>
        <Col span={12}>
          <Button type="primary" onClick={handleFindFriend}>
            查找
          </Button>
        </Col>
        <Col span={24}>
          {friendList.length === 0 ? (
            <div style={{ textAlign: 'center', width: '100%', padding: '20px' }}>
              没有搜索到相关结果
            </div>
          ) : (
            <Row
              gutter={[16, 16]}
              style={{ overflowY: 'auto', height: '100%', maxHeight: 'calc(100vh - 150px)' }}
            >
              {friendList.map((friend) => (
                <Col key={friend.id} span={6}>
                  <Card
                    bodyStyle={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%'
                    }}
                  >
                    <Avatar src={friend.avatar} size={64} style={{ marginBottom: '12px' }} />
                    <Typography.Text strong>{friend.username}</Typography.Text>
                    <Typography.Text>id:{friend.id}</Typography.Text>
                    <Button
                      type="primary"
                      style={{ marginTop: '12px' }}
                      onClick={() => handleAddFriend(Number(friend.id))}
                    >
                      添加好友
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </>
  )
}

export default AddFriend
