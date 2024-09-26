import React, { useState } from 'react'
import { Input, Button, message } from 'antd'
import Service from '@/service'

const AddFriend: React.FC = () => {
  const [friendId, setFriendId] = useState('')

  const handleAddFriend = () => {
    if (!friendId) {
      message.error('请输入好友ID')
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

  return (
    <div style={{ padding: '20px' }}>
      <Input
        placeholder="输入好友ID"
        value={friendId}
        onChange={(e) => setFriendId(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Button type="primary" onClick={handleAddFriend} block>
        添加好友
      </Button>
    </div>
  )
}

export default AddFriend