import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'
import { join } from 'path'

export default function createWindow(wdith: number, height: number, page: string): BrowserWindow {
  let window: BrowserWindow | null = null
  // Create the browser window.
  window = new BrowserWindow({
    width: wdith,
    height: height,
    show: false,
    autoHideMenuBar: true,
    frame: false, // 去掉窗口框架
    resizable: false, // 禁止调整窗口大小
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
    }
  })

  window.on('ready-to-show', () => {
    window?.show()
  })

  window.loadURL(
    is.dev && process.env['ELECTRON_RENDERER_URL']
      ? `${process.env['ELECTRON_RENDERER_URL']}/#/${page}`
      : `file://${join(__dirname, '../renderer/index.html')}#${page}`
  )

  window.on('closed', () => {
    window = null
  })

  return window
}
