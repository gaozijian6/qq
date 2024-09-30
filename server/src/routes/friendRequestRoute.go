package routes

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func FriendRequestRoute(c *fiber.Ctx, db *sql.DB) error {
	data := map[string]interface{}{
		"userIdFrom": 0,
		"userIdTo":   0,
	}
	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "无效的请求数据",
		})
	}

	userIdFrom := data["userIdFrom"].(float64)
	userIdTo := data["userIdTo"].(float64)

	_, err := db.Exec("INSERT INTO friendRequest (userIdFrom, userIdTo) VALUES (?, ?)", userIdFrom, userIdTo)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "添加好友请求失败",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "成功添加好友,等待对方同意",
	})
}
