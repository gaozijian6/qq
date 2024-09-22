import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let loginWindow: BrowserWindow | null = null
let registerWindow: BrowserWindow | null = null
let homeWindow: BrowserWindow | null = null

function createLoginWindow(): void {
  // Create the browser window.
  loginWindow = new BrowserWindow({
    width: 450,
    height: 340,
    show: false,
    autoHideMenuBar: true,
    frame: false, // 去掉窗口框架
    resizable: false, // 禁止调整窗口大小
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  loginWindow.on('ready-to-show', () => {
    loginWindow?.show()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    loginWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    loginWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createRegisterWindow(): void {
  registerWindow = new BrowserWindow({
    width: 450,
    height: 400,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  registerWindow.loadURL(
    is.dev && process.env['ELECTRON_RENDERER_URL']
      ? `${process.env['ELECTRON_RENDERER_URL']}/#/register`
      : `file://${join(__dirname, '../renderer/index.html')}#register`
  )

  registerWindow.on('ready-to-show', () => {
    registerWindow?.show()
  })

  ipcMain.handle('move-register-window', (_, { mouseX, mouseY }) => {
    const [x, y] = registerWindow?.getPosition() ?? [0, 0]
    registerWindow?.setPosition(x + mouseX, y + mouseY)
  })

  registerWindow.on('closed', () => {
    // 清理引用
    loginWindow?.focus()
    ipcMain.removeHandler('move-register-window')
  })
}

function createHomeWindow(): void {
  homeWindow = new BrowserWindow({
    width: 300,
    minWidth: 250,
    height: 700,
    minHeight: 500,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    resizable: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  homeWindow.loadURL(
    is.dev && process.env['ELECTRON_RENDERER_URL']
      ? `${process.env['ELECTRON_RENDERER_URL']}/#/home`
      : `file://${join(__dirname, '../renderer/index.html')}#home`
  )

  homeWindow.on('ready-to-show', () => {
    homeWindow?.show()
  })
}

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

  ipcMain.handle('open-window', (_, targetWindow: string) => {
    switch (targetWindow) {
      case 'login':
        createLoginWindow()
        break
      case 'register':
        if (registerWindow) {
          registerWindow.focus()
        } else {
          createRegisterWindow()
        }
        break
      case 'home':
        createHomeWindow()
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
        loginWindow = null
        registerWindow = null
        break
      case 'register':
        registerWindow?.close()
        registerWindow = null
        break
      case 'home':
        homeWindow?.close()
        homeWindow = null
        break
      default:
        break
    }
  })

  createLoginWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createLoginWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
