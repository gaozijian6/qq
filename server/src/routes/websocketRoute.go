package routes

import (
	"database/sql"
	"encoding/json"
	"log"
	"qq-server/tools"

	"github.com/gofiber/websocket/v2"
)

var clients = make(map[string]*websocket.Conn)

func WebsocketConnect(c *websocket.Conn, db *sql.DB) {
	var userId string

	defer func() {
		if userId != "" {
			log.Printf("用户 %s 断开连接，已从clients映射中移除", userId)
			delete(clients, userId)
		}
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
			var msg map[string]interface{}
			if err := json.Unmarshal(message, &msg); err != nil {
				log.Printf("解析消息错误: %v", err)
				continue
			}

			switch msg["type"] {
			case "onopen":
				userId = msg["userId"].(string)
				log.Printf("用户 %s 连接到WebSocket", userId)
				clients[userId] = c
			case "addFriend":
				userIdFrom := msg["userIdFrom"].(string)
				user, err := tools.GetUserInfo(userIdFrom, db)
				if err != nil {
					log.Printf("获取用户信息失败: %v", err)
					continue
				}

				userIdTo := msg["userIdTo"].(string)
				if clients[userIdTo] != nil {
					userWithType := map[string]interface{}{
						"type": "newFriendRequest",
						"user": user,
					}
					jsonUser, _ := json.Marshal(userWithType)
					clients[userIdTo].WriteMessage(websocket.TextMessage, jsonUser)
				}
			}
		}
	}
}
