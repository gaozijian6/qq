package routes

import (
	"database/sql"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func FriendRequestRoute(c *fiber.Ctx, db *sql.DB) error {
	var request struct {
		UserIdFrom string `json:"userIdFrom"`
		UserIdTo   string `json:"userIdTo"`
	}
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "无效的请求数据",
		})
	}

	userIdFrom, userIdTo := request.UserIdFrom, request.UserIdTo
	fmt.Println(userIdFrom, userIdTo)
	rows, err := db.Query("SELECT * FROM friendRequest WHERE userIdFrom = ? AND userIdTo = ?", userIdFrom, userIdTo)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "查询好友请求失败",
		})
	}
	defer rows.Close()

	if rows.Next() {
		return c.JSON(fiber.Map{
			"success": false,
			"message": "您已添加好友，请等待好友审核",
		})
	}

	_, err = db.Exec("INSERT INTO friendRequest (userIdFrom, userIdTo) VALUES (?, ?)", userIdFrom, userIdTo)
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
