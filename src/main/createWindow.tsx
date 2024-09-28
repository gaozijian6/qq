import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'
import { join } from 'path'
import electronWindow from './ElectronWindow'
import { WINDOW, HOME } from '../renderer/src/constants'

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
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false,
    }
  })

  electronWindow.add(windowName, window)

  window.on('ready-to-show', () => {
    window?.show()
    if (windowName === HOME) {
      window?.webContents.send('login-home', data)
    }
  })

  window.loadURL(
    is.dev && process.env['ELECTRON_RENDERER_URL']
      ? `${process.env['ELECTRON_RENDERER_URL']}/#/${windowName}`
      : `file://${join(__dirname, '../renderer/index.html')}#/${windowName}`
  )

  window.on('closed', () => {
    window = null
  })

  return window
}
