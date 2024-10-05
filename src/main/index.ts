import { app, BrowserWindow, ipcMain, Tray, Menu } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import electronWindow from './ElectronWindow'
import createWindow from './createWindow'
import { HOME, LOGIN } from '../renderer/src/constants'
import WebSocketManager from './websocket'
import path from 'path'

// 读取环境变量并设置不同的 userData 路径
const customUserDataDir = process.env.USER_DATA_DIR || 'default'
const userDataPath = path.join(app.getPath('userData'), customUserDataDir.trim()) // 使用 trim 去除多余空格
app.setPath('userData', userDataPath)

let tray: Tray | null = null
let isLoggedIn = false

function updateTrayIcon() {
  if (tray) {
    const iconPath = isLoggedIn
      ? path.join(__dirname, '../../resources/icon.png')
      : path.join(__dirname, '../../resources/cry.png')
    tray.setImage(iconPath)
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('move-window', (_, { windowName, mouseX, mouseY }) => {
    if (electronWindow.get(windowName)) {
      const [x, y] = electronWindow.get(windowName)?.getPosition() ?? [0, 0]
      electronWindow.get(windowName)?.setPosition(x + mouseX, y + mouseY)
    }
  })

  ipcMain.handle('open-window', (_, { windowName, data }) => {
    if (electronWindow.get(windowName)) {
      electronWindow.get(windowName)?.focus()
    } else {
      createWindow(windowName, data)
    }
  })

  ipcMain.handle('hide-window', () => {
    BrowserWindow.getFocusedWindow()?.hide()
  })

  ipcMain.handle('exit-app', () => {
    app.quit()
  })

  ipcMain.handle('minimize-window', () => {
    BrowserWindow.getFocusedWindow()?.minimize()
  })

  ipcMain.handle('logout', () => {
    WebSocketManager.closeWebSocket()
    isLoggedIn = false
    updateTrayIcon()
    BrowserWindow.getFocusedWindow()?.close()
    createWindow(LOGIN)
  })

  // 初始化WebSocketManager
  ipcMain.handle('init-websocket', (_, userId) => {
    WebSocketManager.initWebSocket(userId)
  })

  ipcMain.handle('add-friend', (_, { userIdFrom, userIdTo }) => {
    WebSocketManager.addFriend(userIdFrom, userIdTo)
  })

  createWindow(LOGIN)
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(LOGIN)
    }
  })

  // 创建系统托盘
  tray = new Tray(path.join(__dirname, '../../resources/cry.png'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        if (isLoggedIn) {
          electronWindow.get(HOME)?.show()
        } else {
          electronWindow.get(LOGIN)?.show()
        }
      }
    },
    { label: '退出', click: () => app.quit() }
  ])
  tray.setToolTip('qq模拟器')
  tray.setContextMenu(contextMenu)

  // 单击托盘图标时打开窗口
  tray.on('click', () => {
    if (isLoggedIn) {
      electronWindow.get(HOME)?.show()
    } else {
      electronWindow.get(LOGIN)?.show()
    }
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('before-quit', () => {
    tray?.destroy()
    tray = null
  })

  ipcMain.handle('login-success', (_, user) => {
    console.log(user)
    WebSocketManager.initWebSocket(user.id.toString())
    BrowserWindow.getFocusedWindow()?.close()
    createWindow(HOME, user)
    isLoggedIn = true
    updateTrayIcon()
  })
})
