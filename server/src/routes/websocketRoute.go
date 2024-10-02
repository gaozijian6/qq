package routes

import (
	"log"
	"sync"

	"github.com/gofiber/websocket/v2"
)

var clients = make(map[string]*websocket.Conn)
var clientsMutex = sync.Mutex{}

func WebsocketConnect(c *websocket.Conn) {
	userId := c.Params("userId")

	clientsMutex.Lock()
	clients[userId] = c
	clientsMutex.Unlock()

	defer func() {
		clientsMutex.Lock()
		delete(clients, userId)
		clientsMutex.Unlock()
		c.Close()
	}()

	for {
		messageType, message, err := c.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket错误: %v", err)
			}
			break
		}

		if messageType == websocket.TextMessage {
			// 处理接收到的消息
			log.Printf("收到来自用户 %s 的消息: %s", userId, string(message))

			// 这里可以添加消息处理逻辑
		}
	}
}

func SendWebsocketMessage(userId string, message []byte) {
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	if client, ok := clients[userId]; ok {
		err := client.WriteMessage(websocket.TextMessage, message)
		if err != nil {
			log.Printf("发送WebSocket消息错误: %v", err)
		}
	}
}
