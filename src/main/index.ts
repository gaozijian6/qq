import { app, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import electronWindow from './ElectronWindow'
import createWindow from './createWindow'
import { LOGIN } from '../renderer/src/constants'

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

  ipcMain.handle('close-window', (_, windowName: string) => {
    electronWindow.get(windowName)?.close()
  })

  createWindow(LOGIN)
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(LOGIN)
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
