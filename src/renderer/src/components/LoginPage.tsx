import React from 'react';
import { Form, Input, Button, Avatar, Row, Col, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import qqLogo from '@/assets/qq.jpg';
import { useDraggable } from '@/hooks/useDraggable';
import './gradientBG.less';
import Service from '@/service';
import Close from './Close';

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const dragRef = useDraggable('login');

  const handleLogin = (values: any) => {
    Service.post('/login', values).then(response => {
      message.success(response.data?.message ?? '登录成功');
      window.electron.ipcRenderer.invoke('open-window', 'home');
      window.electron.ipcRenderer.invoke('close-window', 'login');
    }).catch(error => {
      message.error(error.response?.data?.message ?? '登录失败，请稍后重试');
    });
  };


  return (
    <Row 
      justify="center" 
      align="middle" 
      className="background"
      ref={dragRef}
    >
      <Close targetWindow="login" />
      <Col>
        <Avatar 
          src={qqLogo} 
          size={64} 
          style={{ marginBottom: '20px', display: 'block', margin: '0 auto' }} 
        />
        <Form form={form} onFinish={handleLogin} style={{ width: '300px' }}>
          <Form.Item
            name="id"
            rules={[{ required: true, message: '请输入您的QQ号码' }]}
          >
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
                    e.preventDefault();
                    window.electron.ipcRenderer.invoke('open-window', 'register');
                  }}
                >
                  注册账号
                </a>
                <a 
                  href="#" 
                  style={{ fontSize: '14px' }}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('找回密码');
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
  );
};

export default LoginPage;