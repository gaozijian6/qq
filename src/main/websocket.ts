import WebSocket from 'ws'
import electronWindow from './ElectronWindow'
import { HOME } from '../renderer/src/constants'

export class WebSocketManager {
  private static instance: WebSocketManager | null = null
  private socket: WebSocket | null = null
  userId: string | null = null

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager()
    }
    return WebSocketManager.instance
  }

  public initWebSocket(userId: string): void {
    this.userId = userId
    if (!this.socket) {
      this.socket = new WebSocket(`ws://localhost:3000/ws`)
      this.socket.onopen = () => {
        console.log('WebSocket连接成功', userId)
        this.socket?.send(
          JSON.stringify({
            type: 'onopen',
            userId: userId
          })
        )
      }

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data.toString())
        if (data.type === 'newFriendRequest') {
          console.log(electronWindow.map)

          console.log('收到服务器消息:', data)
          electronWindow.get(HOME)?.webContents.send('newFriendRequest', data.user)
        }
      }

      this.socket.onclose = () => {
        console.log(`${userId} 断开连接`)
      }

      this.socket.onerror = (error) => {
        console.error('WebSocket错误:', error)
      }
    }
  }

  public sendMessage(message: any): void {
    if (this.socket) {
      this.socket.send(JSON.stringify(message))
    }
  }

  public closeWebSocket(): void {
    console.log(1)

    if (this.socket) {
      console.log(2)
      this.socket.close()
      this.socket = null
    }
  }

  public addFriend(userIdFrom: string, userIdTo: string): void {
    if (this.socket) {
      this.socket.send(
        JSON.stringify({
          type: 'addFriend',
          userIdFrom: userIdFrom,
          userIdTo: userIdTo
        })
      )
    }
  }
}

export default WebSocketManager.getInstance()
