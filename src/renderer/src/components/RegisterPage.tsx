import React, { useState } from 'react'
import { Form, Input, Button, Row, Col, Modal } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { useDraggable } from '@/hooks/useDraggable'
import Service from '@/service'
import Close from './Close'
import './gradientBG.less';

interface FormValues {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm<FormValues>()
  const dragRef = useDraggable('move-register-window')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [id, setId] = useState(0)

  const handleRegister = (values: FormValues) => {
    Service.post('/register', values).then(response => {
      setId(response.data.user.id)
      setIsModalVisible(true)
    }).catch(error => {
      console.error('注册失败:', error)
    })
  }

  const handleModalOk = () => {
    setIsModalVisible(false)
    window.electron.ipcRenderer.invoke('close-window', 'register')
  }

  return (
    <Row 
      justify="center" 
      align="middle" 
      className="background"
      ref={dragRef}
    >
      <Close targetWindow="register" />
      <Col>
        <Form form={form} onFinish={handleRegister} style={{ width: '300px' }}>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { max: 10, message: '用户名不能超过10个字' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名（最多10个字）" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码（8-16个字符）" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              注册
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Modal
        title="注册成功"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        okText="确认"
        cancelText="取消"
      >
        <p>恭喜您，注册成功！您的id为：{id}</p>
      </Modal>
    </Row>
  )
}

export default RegisterPage