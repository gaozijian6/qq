import { app, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import createWindow from '../renderer/src/tools/creatWindow'

let loginWindow: BrowserWindow | null = null
let registerWindow: BrowserWindow | null = null
let homeWindow: BrowserWindow | null = null
let friendWindow: BrowserWindow | null = null

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('move-window', (_, { targetWindow, mouseX, mouseY }) => {
    switch (targetWindow) {
      case 'login': {
        const [x, y] = loginWindow?.getPosition() ?? [0, 0]
        loginWindow?.setPosition(x + mouseX, y + mouseY)
        break
      }
      case 'register': {
        const [x, y] = registerWindow?.getPosition() ?? [0, 0]
        registerWindow?.setPosition(x + mouseX, y + mouseY)
        break
      }
      case 'home': {
        const [x, y] = homeWindow?.getPosition() ?? [0, 0]
        homeWindow?.setPosition(x + mouseX, y + mouseY)
        break
      }
      default:
        break
    }
  })

  ipcMain.handle('open-window', (_, { windowName, data }) => {
    switch (windowName) {
      case 'login':
        loginWindow = createWindow(450, 340, 'login')
        break
      case 'register':
        if (registerWindow) {
          registerWindow.focus()
        } else {
          registerWindow = createWindow(450, 340, 'register')
        }
        break
      case 'home':
        homeWindow = createWindow(300, 700, 'home')
        homeWindow?.once('ready-to-show', () => {
          homeWindow?.webContents.send('login-home', data)
        })
        break
      case 'friend':
        friendWindow = createWindow(450, 400, 'friend')
        break
      default:
        break
    }
  })

  ipcMain.handle('close-window', (_, targetWindow: string) => {
    switch (targetWindow) {
      case 'login':
        loginWindow?.close()
        registerWindow?.close()
        break
      case 'register':
        registerWindow?.close()
        break
      case 'home':
        homeWindow?.close()
        break
      case 'friend':
        friendWindow?.close()
        break
      default:
        break
    }
  })

  loginWindow = createWindow(450, 340, 'login')

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      loginWindow = createWindow(450, 340, 'login')
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
