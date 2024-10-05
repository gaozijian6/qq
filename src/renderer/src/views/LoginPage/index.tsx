import React from 'react'
import { Form, Input, Button, Avatar, Row, Col, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useDraggable } from '@/tools/useDraggable'
import '@/assets/gradientBG.less'
import * as Service from '@/service'
import Close from '@/components/Close'
import { INIT_AVATAR_URL } from '@/constants'
import Minimize from '@/components/Minimize'
interface FormValues {
  id: number
  password: string
  remember: boolean
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm<FormValues>()
  const dragRef = useDraggable('login')

  const handleLogin = (values: FormValues) => {
    Service.login(values)
      .then((res) => {
        if (res.data.success) {
          message.success(res.data.message)
          const token = res.data.token
          localStorage.setItem('token', token)
          window.electron.ipcRenderer.invoke('login-success', res.data.user)
        } else {
          message.error(res.data.message)
        }
      })
      .catch((error) => {
        message.error(error.res.data.message)
      })
  }

  return (
    <Row justify="center" align="middle" className="background" ref={dragRef}>
      <Minimize />
      <Close isExit={true} />
      <Col>
        <Avatar
          src={INIT_AVATAR_URL}
          size={64}
          style={{ marginBottom: '20px', display: 'block', margin: '0 auto' }}
          onError={() => {
            console.error('头像加载失败', INIT_AVATAR_URL)
            return false
          }}
        />
        <Form form={form} onFinish={handleLogin} style={{ width: '300px' }}>
          <Form.Item name="id" rules={[{ required: true, message: '请输入您的QQ号码' }]}>
            <Input prefix={<UserOutlined />} placeholder="QQ号码" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入您的密码!' }]}
            style={{ marginBottom: '0px', marginTop: '0px' }}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item style={{ marginBottom: '0px', marginTop: '0px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住密码</Checkbox>
              </Form.Item>
              <div>
                <a
                  href="#"
                  style={{ fontSize: '14px', marginRight: '10px' }}
                  onClick={(e) => {
                    e.preventDefault()
                    window.electron.ipcRenderer.invoke('open-window', {
                      windowName: 'register',
                      data: {}
                    })
                  }}
                >
                  注册账号
                </a>
                <a
                  href="#"
                  style={{ fontSize: '14px' }}
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('找回密码')
                  }}
                >
                  找回密码
                </a>
              </div>
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default LoginPage
