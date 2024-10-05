import React, { useState, useRef, useEffect } from 'react'
import { Layout, Input, Button, List, Avatar, Typography, Row, Popover } from 'antd'
import { SendOutlined, SmileOutlined } from '@ant-design/icons'
import { useDraggable } from '@/tools/useDraggable'
import EmojiPanel from '@/components/EmojiPanel'
import Close from './Close'
import Minimize from '@/components/Minimize'
const { Header, Content, Footer } = Layout
const { TextArea } = Input
const { Text } = Typography

interface ChatBoxProps {
  id: string
  username: string
  avatar: string
  introduction: string
}

const ChatBox: React.FC<ChatBoxProps> = ({id, username, avatar, introduction}) => {
  const dragRef = useDraggable('home')
  const [inputMessage, setInputMessage] = useState('')
  const [emojiPanelVisible, setEmojiPanelVisible] = useState(false)
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleEmojiClick = (emoji: string) => {
    if (cursorPosition !== null && textAreaRef.current) {
      const newMessage = inputMessage.slice(0, cursorPosition) + emoji + inputMessage.slice(cursorPosition)
      setInputMessage(newMessage)
      setEmojiPanelVisible(false)
      
      // 设置新的光标位置
      const newPosition = cursorPosition + emoji.length
      setTimeout(() => {
        textAreaRef.current?.setSelectionRange(newPosition, newPosition)
        textAreaRef.current?.focus()
      }, 0)
    } else {
      setInputMessage(prevMessage => prevMessage + emoji)
      setEmojiPanelVisible(false)
    }
  }

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value)
    setCursorPosition(e.target.selectionStart)
  }

  const [footerHeight, setFooterHeight] = useState(150)
  const footerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const startYRef = useRef(0)
  const startHeightRef = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      const deltaY = startYRef.current - e.clientY
      const newHeight = Math.min(Math.max(startHeightRef.current + deltaY, 150), 290)
      setFooterHeight(newHeight)
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true
    startYRef.current = e.clientY
    startHeightRef.current = footerHeight
  }

  return (
    <Layout style={{ height: '100%', backgroundColor: '#e7edff' }}>
      <Minimize />
      <Close />
      <Header style={{ backgroundColor: '#e7edff', borderBottom: '1px solid #e8e8e8' }} ref={dragRef}>
        <Avatar src={avatar} />
        <Text strong>{username} ({id})</Text>
        <Text>{introduction}</Text>
      </Header>
      <Content
        style={{
          padding: '16px',
          overflowY: 'auto',
          height: `calc(100% - ${footerHeight}px - 64px)`
        }}
      >
      </Content>
      <Footer
        ref={footerRef}
        style={{
          padding: '0px 8px 8px 8px',
          backgroundColor: '#e7edff',
          height: `${footerHeight}px`,
          position: 'relative',
          resize: 'vertical',
          overflow: 'auto',
          borderTop: '1px solid #e8e8e8',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            cursor: 'ns-resize'
          }}
          onMouseDown={handleMouseDown}
        />
        <Row style={{ display: 'flex' }}>
          <Popover
            content={<EmojiPanel onEmojiClick={handleEmojiClick} />}
            trigger="click"
            visible={emojiPanelVisible}
            onVisibleChange={setEmojiPanelVisible}
            placement="topLeft"
          >
            <Button
              icon={<SmileOutlined style={{ fontSize: '20px' }} />}
              style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}
              onClick={() => setEmojiPanelVisible(!emojiPanelVisible)}
            />
          </Popover>
        </Row>
        <Row
          style={{ width: '100%', height: '100%', resize: 'none' }}
        >
          <TextArea
            ref={textAreaRef}
            value={inputMessage}
            onChange={handleTextAreaChange}
            onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart)}
            style={{ backgroundColor: 'transparent', border: 'none' }}
          />
        </Row>
        <Row>
          <Button
            type="primary"
            icon={<SendOutlined />}
            style={{ marginLeft: 'auto' }}
          >
            发送
          </Button>
        </Row>
      </Footer>
    </Layout>
  )
}

export default ChatBox
