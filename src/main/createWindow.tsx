import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'
import { join } from 'path'
import electronWindow from './ElectronWindow'
import { WINDOW, HOME, FRIEND } from '../renderer/src/constants'

export default function createWindow(windowName: string, data?: any): BrowserWindow {
  const { width, height, resizable, minWidth, minHeight } = WINDOW[windowName]
  let window: BrowserWindow | null = null

  window = new BrowserWindow({
    width,
    height,
    show: false,
    autoHideMenuBar: true,
    frame: false, // 去掉窗口框架
    resizable,
    minWidth,
    minHeight,
    icon:
      windowName === HOME
        ? join(__dirname, '../../resources/icon.png')
        : join(__dirname, '../../resources/cry.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
    }
  })

  electronWindow.add(windowName, window)

  window.on('ready-to-show', () => {
    window?.show()
    switch (windowName) {
      case HOME:
        window?.webContents.send('login-home', data)
        break
      case FRIEND:
        window?.webContents.send('home-friend', data)
        break
    }
  })

  window.loadURL(
    is.dev && process.env['ELECTRON_RENDERER_URL']
      ? `${process.env['ELECTRON_RENDERER_URL']}/#/${windowName}`
      : `file://${join(__dirname, '../renderer/index.html')}#/${windowName}`
  )

  window.on('closed', () => {
    window = null
    electronWindow.delete(windowName)
  })

  return window
}
