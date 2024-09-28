// 初始头像url
export const INIT_AVATAR_URL = 'http://127.0.0.1:9000/avatar/qq.png'
// 初始介绍
export const INIT_INTRODUCTION = '这个人很懒，什么都没留下'

interface WindowConfig {
  width: number
  height: number
  windowName: string
  resizable?: boolean
  minWidth?: number
  minHeight?: number
}
export const LOGIN = 'login'
export const REGISTER = 'register'
export const HOME = 'home'
export const FRIEND = 'friend'
// 窗口名称
export const WINDOW: Record<string, WindowConfig> = {
  login: { width: 450, height: 340, windowName: LOGIN },
  register: { width: 450, height: 340, windowName: REGISTER },
  home: {
    width: 300,
    height: 700,
    windowName: HOME,
    resizable: true,
    minWidth: 300,
    minHeight: 700
  },
  friend: { width: 900, height: 600, windowName: FRIEND }
}
