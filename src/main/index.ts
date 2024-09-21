import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let loginWindow: BrowserWindow | null = null
let registerWindow: BrowserWindow | null = null

function createWindow(): void {
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

  loginWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
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

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('move-window', (_, { mouseX, mouseY }) => {
    const [x, y] = loginWindow?.getPosition() ?? [0, 0]
    loginWindow?.setPosition(x + mouseX, y + mouseY)
  })

  ipcMain.handle('open-register-window', () => {
    if (registerWindow) {
      registerWindow.focus()
    } else {
      createRegisterWindow()
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
      default:
        break
    }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
