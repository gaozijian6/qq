export class WebSocketManager {
  private static instance: WebSocketManager | null = null
  private socket: WebSocket | null = null

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager()
    }
    return WebSocketManager.instance
  }

  public initWebSocket(userId: string): void {
    if (!this.socket) {
      this.socket = new WebSocket(`ws://localhost:3000/ws`)

      this.socket.onopen = () => {
        console.log('WebSocket连接成功')
        this.socket?.send(
          JSON.stringify({
            type: 'connect',
            userId: userId
          })
        )
      }

      this.socket.onclose = () => {}

      this.socket.onerror = (error) => {
        console.error('WebSocket错误:', error)
      }
    }
  }

  public getSocket(): WebSocket | null {
    return this.socket
  }

  public closeWebSocket(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }
}

export default WebSocketManager.getInstance()
