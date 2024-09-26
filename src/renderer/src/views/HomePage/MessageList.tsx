import { Avatar } from 'antd'

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

export default MessageList
